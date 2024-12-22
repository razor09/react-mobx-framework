import { DelayMode } from 'msw'
import { Error } from '../../libs/fallback/typings'
import { ResponseStatus } from '../../libs/http-client/typings'

export declare const status = ResponseStatus.BadRequest

export declare const message = 'default'

export type MaybeError<T> = T | Error

export type DurationOrMode = DelayMode | number

export interface PathParams {
  id: number
}

export interface QueryParams {
  id: number
}

export const enum Count {
  Minimal = 1,
}
