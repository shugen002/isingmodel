export interface AsyncCalculateRequest<T> {
  id: string;
  params: T;
}

export interface AsyncCalculateResult<T> {
  id: string;
  data?: T;
  error?: Error;
}