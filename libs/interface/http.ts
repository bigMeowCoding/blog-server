interface ResponseSuccess<T> {
  data: T;
}
export type HttpResponse<T> = ResponseSuccess<T>;

export enum HttpStatus {
  ok = 200,
}
