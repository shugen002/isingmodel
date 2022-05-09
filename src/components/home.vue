<script setup lang="ts">
import { nanoid } from 'nanoid'

import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { NInputNumber, NButton, NInputGroupLabel, NInputGroup } from 'naive-ui'

import type { AsyncCalculateRequest, AsyncCalculateResult } from '../@types/asyncCalc'
import type { IsingParams, IsingResult } from '../@types/ising'

var worker: Worker | undefined;
let promiseQueue: { [key: string]: { resolve: (value: IsingResult & { id: string } | PromiseLike<IsingResult & { id: string }>) => void, reject: (reason?: any) => void } } = {};
onMounted(() => {
  worker = new Worker(new URL('../worker/index.ts', import.meta.url), {
    type: 'module'
  });
  worker.onmessage = (e: MessageEvent<AsyncCalculateResult<IsingResult>>) => {
    if (promiseQueue[e.data.id]) {
      let result = e.data;
      if (typeof result.error !== 'undefined') {
        promiseQueue[e.data.id].reject(e.data.error as Error);
      } else {
        let result: any = e.data.data;
        result.id = e.data.id;
        promiseQueue[e.data.id].resolve(result as IsingResult & { id: string });
      }
    }
    delete promiseQueue[e.data.id];
  };
})
onUnmounted(() => {
  if (worker) {
    worker.terminate();
  }
  Object.keys(promiseQueue).forEach(key => {
    promiseQueue[key].reject(new Error('Worker terminated'));
  });
  promiseQueue = {};
})


function solve_Ising(temperature: number, resolution: number, exchangeIntergral = 1, magneticField = 0): { id: string, promise: Promise<IsingResult & { id: string }> } {
  let id = nanoid();
  let promise: Promise<IsingResult & { id: string }> = new Promise((resolve, reject) => {
    let request: AsyncCalculateRequest<IsingParams> = {
      id,
      params: {
        temperature,
        resolution,
        exchangeIntergral,
        magneticField
      }
    }
    if (!worker) {
      reject(new Error('Worker not initialized'));
      return;
    }
    worker.postMessage(request);
    promiseQueue[id] = { resolve, reject };
  })
  return { id, promise };
}

const params = reactive({
  temperature: 0.001,
  resolution: 20,
  exchangeIntergral: 1,
  magneticField: 0
});

const lastId = ref('');
const lastResult = ref<IsingResult | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

function drawResult(result: IsingResult) {
  if (!canvas.value) return;
  let ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  let width = canvas.value.width / result.resolution;
  let height = canvas.value.height / result.resolution;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  for (var i = 0; i < result.resolution; i++) {
    for (var j = 0; j < result.resolution; j++) {
      ctx.fillStyle = result.matrix[i][j] == 1 ? '#000' : '#fff';
      ctx.fillRect(i * width, j * height, width, height);
    }
  }
}

function onUpdate() {
  let { id, promise } = solve_Ising(params.temperature, params.resolution, params.exchangeIntergral, params.magneticField)
  lastId.value = id;
  promise.then(result => {
    if (result.id === lastId.value) {
      lastResult.value = result;
      drawResult(result);
    }
  })
}
onMounted(() => {
  onUpdate();
})

</script>

<template>
  <div>
    <div class="params">
      <n-input-group>
        <n-input-group-label>Temperature:</n-input-group-label>
        <n-input-number v-model:value="params.temperature" :show-button="false" @update:value="onUpdate">
          <template #suffix>
            K
          </template>
        </n-input-number>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>Resolution:</n-input-group-label>
        <n-input-number v-model:value="params.resolution" :show-button="false" @update:value="onUpdate" />
      </n-input-group>
      <n-input-group>
        <n-input-group-label>Exchange Intergral:</n-input-group-label>
        <n-input-number v-model:value="params.exchangeIntergral" :show-button="false" @update:value="onUpdate" />
      </n-input-group>
      <n-input-group>
        <n-input-group-label>Magnetic Field: </n-input-group-label>
        <n-input-number v-model:value="params.magneticField" :show-button="false" @update:value="onUpdate">
          <template #suffix>
            B
          </template>
        </n-input-number>
      </n-input-group>
      <n-button @click="onUpdate">
        Update
      </n-button>
    </div>
    <div class="display">
      <div class="result">
        <p>Temperature: {{ lastResult?.temperature }}</p>
        <p>Resolution: {{ lastResult?.resolution }}</p>
        <p>Exchange Intergral: {{ lastResult?.exchangeIntergral }}</p>
        <p>Magnetic Field: {{ lastResult?.magneticField }}</p>
        <p>Mean: {{ lastResult?.mean }}</p>
      </div>
      <div class="image">
        <canvas ref="canvas" width="300" height="300"></canvas>
      </div>
    </div>
  </div>
</template>