<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NGlobalStyle, NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NLayoutSider, NLayoutFooter } from 'naive-ui'

</script>

<template>
  <n-config-provider>
    <n-global-style />
    <n-layout position="absolute">
      <n-layout-header bordered style="height: 64px; padding: 24px">没钱啦</n-layout-header>
      <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider>
        <n-layout-sider collapse-mode="width" :collapsed-width="120" :width="240" show-trigger="arrow-circle"
          content-style="padding: 24px;" bordered>
          海淀桥
        </n-layout-sider>
        <n-layout-content content-style="padding: 24px;">
          <router-view />
        </n-layout-content>
      </n-layout>
      <n-layout-footer bordered position="absolute" style="height: 64px; padding: 24px">要恰饭的嘛</n-layout-footer>
    </n-layout>

  </n-config-provider>
</template>

<style>
</style>
