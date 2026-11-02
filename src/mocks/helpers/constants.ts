import { HttpResponseInit } from 'msw'
import { Error } from '../../libs/fallback/typings'
import { ResponseStatus } from '../../libs/http-client/typings'
import { DurationOrMode } from './typings'

export namespace Constants {
  export const error: Error = {}

  export const fail: HttpResponseInit = { status: ResponseStatus.BadRequest }

  export const durationOrMode: DurationOrMode = 'real'
}
