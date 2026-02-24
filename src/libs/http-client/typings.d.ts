import { PlainObjectOrPlainArray, StringOrNumberOrBoolean, Structure } from '../utils/typings'

export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type ErrorCallback<E = unknown> = (error: E) => void

export type OnReadStream = (stream: Stream) => void

export type LoadFileConfig = Pick<LoadStreamConfig, 'endpoint' | 'queryParams'>

export type QueryParams = Structure<StringOrNumberOrBoolean>

export type ReadHeadersFn = () => HeadersInit

export type HttpBaseConfig = {
  baseUrl: string
  credentials: RequestCredentials
  headers: ReadHeadersFn
}

export type HttpCallConfig = {
  method: RequestMethod
  endpoint: string
  queryParams?: QueryParams
  body?: PlainObjectOrPlainArray
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

export const enum ResponseStatus {
  Ok = 200,
  BadRequest = 400,
  InternalServerError = 500,
}
