import { IsingParams, IsingResult } from "../@types/ising";

function ones(N: number) {
  var matrix: number[][] = [];
  for (var i = 0; i < N; i++) {
    matrix[i] = [];
    for (var j = 0; j < N; j++) {
      matrix[i][j] = 1;
    }
  }
  return matrix;
}

export function solve_Ising(param: IsingParams): IsingResult {
  var { temperature, resolution, exchangeIntergral: exchangeIntergral, magneticField: magneticField } = param;
  var matrix = ones(resolution);
  var randomtime = 1000 * resolution ** 2;
  function getDeltaE(x: number, y: number) {
    let deltaE = 2 * magneticField * matrix[x][y] +
      2 * exchangeIntergral * matrix[x][y] * matrix[(x + 1) % resolution][y] +
      2 * exchangeIntergral * matrix[x][y] * matrix[(x - 1 + resolution) % resolution][y] +
      2 * exchangeIntergral * matrix[x][y] * matrix[x][(y + 1) % resolution] +
      2 * exchangeIntergral * matrix[x][y] * matrix[x][(y - 1 + resolution) % resolution];
    return deltaE;
  }
  for (var i = 0; i < randomtime; i++) {
    var x = Math.floor(Math.random() * resolution);
    var y = Math.floor(Math.random() * resolution);
    var deltaE = getDeltaE(x, y);
    if (deltaE < 0 || Math.random() < Math.exp(-deltaE / temperature)) {
      matrix[x][y] *= -1;
    }
  }
  let mean = 0;
  for (var i = 0; i < resolution; i++) {
    for (var j = 0; j < resolution; j++) {
      mean += matrix[i][j];
    }
  }
  mean /= resolution * resolution;
  return {
    temperature,
    resolution,
    exchangeIntergral,
    magneticField,
    matrix: matrix,
    mean: mean
  }
}
export default solve_Ising;