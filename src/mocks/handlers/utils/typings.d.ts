import { DelayMode } from 'msw'
import { ResponseStatus } from '../../../libs/http-client/typings'

export declare const status = ResponseStatus.BadRequest

export declare const message = 'default'

export type MaybeError<T> = T | FailPayload

export type DurationOrMode = DelayMode | number

export interface PathParams {
  id: number
}

export interface QueryParams {
  id: number
}

export interface FailPayload {
  message: string
}

export const enum Count {
  Minimal = 1,
}
