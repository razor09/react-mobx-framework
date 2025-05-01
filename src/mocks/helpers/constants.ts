import { HttpResponseInit } from 'msw'
import { Error } from '../../libs/fallback/typings'
import { ResponseStatus } from '../../libs/http-client/typings'
import { DurationOrMode } from './typings'

export const durationOrMode: DurationOrMode = 'real'

export const fail: HttpResponseInit = { status: ResponseStatus.BadRequest }

export const error: Error = { message: 'error' }
