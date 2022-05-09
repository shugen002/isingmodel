import { AsyncCalculateRequest } from "../@types/asyncCalc";
import { IsingParams } from "../@types/ising";
import { solve_Ising } from "./isingmodel";
export type { }

addEventListener('message', function (e: MessageEvent<AsyncCalculateRequest<IsingParams>>) {
  console.time('ising-' + e.data.id);
  try {
    let result = {
      data: solve_Ising(e.data.params),
      id: e.data.id
    };
    postMessage(result);
  } catch (error) {
    postMessage({
      id: e.data.id,
      error: error
    });
  }
  console.timeEnd('ising-' + e.data.id);
}, false);
