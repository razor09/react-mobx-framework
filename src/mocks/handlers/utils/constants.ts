import { HttpResponseInit } from 'msw'
import { DurationOrMode, FailPayload, message, status } from './typings'

export const exceptions = ['', null]

export const durationOrMode: DurationOrMode = 'real'

export const failResponse: HttpResponseInit = { status }

export const failPayload: FailPayload = { message }
