import { PathParams as Params } from 'msw'
import { invalidRequestParams } from '../../libs/utils/constants'
import { Helpers } from '../../libs/utils/helpers'
import { Nullable, NullableProperties } from '../../libs/utils/typings'
import { PathParams, PathParamsKey, QueryParams, QueryParamsKey } from './typings'

export namespace UrlParser {
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
    const result: NullableProperties<QueryParams> = {
      id: Helpers.toInteger(id),
    }
    return Helpers.shake(result, invalidRequestParams) as QueryParams
  }

  export const parsePathParams = (params: Params<PathParamsKey>): PathParams => {
    const result: NullableProperties<PathParams> = {
      id: Helpers.isString(params.id) ? Helpers.toInteger(params.id) : null,
    }
    return Helpers.shake(result, invalidRequestParams) as PathParams
  }
}
