import { PathParams as Params } from 'msw'
import { isArray } from '../../libs/utils/guards'
import { rebuild, toInteger } from '../../libs/utils/helpers'
import { exceptions } from './constants'
import { PathParams, QueryParams } from './typings'

const getSingleQueryParam = (map: URL, key: keyof QueryParams): string => {
  return map.searchParams.get(key)
}

const getQueryParams = (url: string): Record<keyof QueryParams, string> => {
  const map = new URL(url)
  return {
    id: getSingleQueryParam(map, 'id'),
  }
}

export const parseQueryParams = (url: string): Partial<QueryParams> => {
  const { id } = getQueryParams(url)
  const result: QueryParams = {
    id: toInteger(id),
  }
  return rebuild(result, exceptions)
}

export const parsePathParams = (params: Params<keyof PathParams>): Partial<PathParams> => {
  const result: PathParams = {
    id: isArray(params.id) ? null : toInteger(params.id),
  }
  return rebuild(result, exceptions)
}
