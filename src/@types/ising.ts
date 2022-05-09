export interface IsingParams {
  temperature: number;
  resolution: number;
  exchangeIntergral: number;
  magneticField: number;
}
export interface IsingResult {
  temperature: number;
  resolution: number;
  exchangeIntergral: number;
  magneticField: number;
  matrix: number[][];
  mean: number;
}