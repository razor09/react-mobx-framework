import { PathParams as Params } from 'msw'
import { invalidRequestParams } from '../../libs/constants'
import { Utils } from '../../libs/utils'
import { Nullable, Optional, StringOrNumberOrBoolean } from '../../libs/utils/typings'
import { PathParams, PathParamsKey, QueryParams, QueryParamsKey, Strategy } from './typings'

export namespace UrlParser {
  const transform = <T extends StringOrNumberOrBoolean>(value: Nullable<string>, strategy: Strategy): Optional<T> => {
    if (value) {
      switch (strategy) {
        case 'string':
          return value as T
        case 'number':
          return Utils.toNumber(value) as T
        case 'boolean':
          return Utils.isBoolean(value) as T
      }
    }
  }

  const getSingleQueryParam = (map: URL, key: QueryParamsKey): Nullable<string> => {
    return map.searchParams.get(key)
  }

  const getQueryParams = (url: string): Record<QueryParamsKey, Nullable<string>> => {
    const map = new URL(url)
    return {
      id: getSingleQueryParam(map, 'id'),
    }
  }

  export const parseQueryParams = (url: string): QueryParams => {
    const { id } = getQueryParams(url)
    const result: QueryParams = {
      id: transform(id, 'number') ?? 0,
    }
    return Utils.clone(result, invalidRequestParams)
  }

  export const parsePathParams = (params: Params<PathParamsKey>): PathParams => {
    const { id } = params as Record<PathParamsKey, never>
    return {
      id: Utils.isPlainArray(id) ? 0 : Utils.toNumber(id),
    }
  }
}
