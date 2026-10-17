import { JsonObjectOrJsonArray, StringOrNumberOrBoolean, Structure } from '../utils/typings'

export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type ErrorCallback<E = unknown> = (error: E) => void

export type OnReadStream = (stream: Stream) => void

export type LoadFileConfig = Pick<LoadStreamConfig, 'endpoint' | 'queryParams'>

export type QueryParams = Structure<StringOrNumberOrBoolean>

export type ReadHeadersFn = () => Structure<string>

export type HttpResponseData = JsonObjectOrJsonArray | ArrayBuffer | Uint8Array[]

export type ReadResponseFn<R extends HttpResponseData> = (response: Response) => Promise<R>

export type HttpBaseConfig = {
  baseUrl: string
  headers: ReadHeadersFn
  credentials: RequestCredentials
}

export type HttpCallConfig = {
  method: RequestMethod
  endpoint: string
  queryParams?: QueryParams
  body?: JsonObjectOrJsonArray
}

export type Stream = {
  value: Uint8Array
  loaded: number
  total: number
  progress: number
}

export type LoadStreamConfig = {
  endpoint: string
  queryParams?: QueryParams
  onReadStream?: OnReadStream
}

export const enum RequestHeaders {
  ContentType = 'content-type',
  ContentLength = 'content-length',
}

export const enum ContentType {
  ApplicationJson = 'application/json',
}

export const enum ResponseStatus {
  Ok = 200,
  BadRequest = 400,
  InternalServerError = 500,
}
