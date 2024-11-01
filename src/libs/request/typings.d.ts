export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type QueryParamsKey = string

export type QueryParamsValue = string | number | boolean

export type ErrorCallback<E extends object = object> = (error: E) => void

export interface QueryParams {
  [key: QueryParamsKey]: QueryParamsValue
}

export interface RequestBaseConfig {
  baseUrl: string
  headers: HeadersInit
  credentials: RequestCredentials
}

export interface RequestCallConfig<Q extends QueryParams, B extends object> {
  method: RequestMethod
  endpoint: string
  queryParams?: Q
  body?: B
}
