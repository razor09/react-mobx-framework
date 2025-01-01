import { HttpResponseInit } from 'msw'
import { Error } from '../../libs/fallback/typings'
import { DurationOrMode, message, status } from './typings'

export const exceptions = ['', null]

export const durationOrMode: DurationOrMode = 'real'

export const response: HttpResponseInit = { status }

export const error: Error = { message }
