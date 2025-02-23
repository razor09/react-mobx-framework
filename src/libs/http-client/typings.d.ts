import { PlainObject, PlainObjectOrArray, StringOrNumberOrBoolean } from '../utils/typings'

export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type ErrorCallback<E = unknown> = (error: E) => void

export type OnReadStream = (stream: Stream) => void

export type LoadFileConfig = Pick<LoadStreamConfig, 'endpoint' | 'queryParams'>

export type QueryParams = PlainObject<StringOrNumberOrBoolean>

export interface HttpBaseConfig {
  baseUrl: string
  headers: HeadersInit
  credentials: RequestCredentials
}

export interface HttpCallConfig {
  method: RequestMethod
  endpoint: string
  queryParams?: QueryParams
  body?: PlainObjectOrArray
}

export interface Stream {
  value: Uint8Array
  loaded: number
  total: number
  progress: number
}

export interface LoadStreamConfig {
  endpoint: string
  queryParams?: QueryParams
  onReadStream?: OnReadStream
}

export const enum ResponseStatus {
  Ok = 200,
  BadRequest = 400,
  InternalServerError = 500,
}
