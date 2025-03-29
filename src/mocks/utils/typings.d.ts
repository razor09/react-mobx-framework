import { DelayMode } from 'msw'
import { Error } from '../../libs/fallback/typings'

export type Failable<T> = T | Error

export type DurationOrMode = DelayMode | number

export type PathParamsKey = keyof PathParams

export type QueryParamsKey = keyof QueryParams

export type Strategy = 'string' | 'number' | 'boolean'

export type PathParams = {
  id: number
}

export type QueryParams = {
  id: number
}

export const enum Count {
  Minimal = 1,
}
