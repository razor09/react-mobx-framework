import { PathParams as Params } from 'msw'
import { Constants } from '../../libs/constants'
import { Utils } from '../../libs/utils'
import { Nullable } from '../../libs/utils/typings'
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
    const result: QueryParams = {
      id: Utils.parse(id),
    }
    return Utils.clone(result, Constants.invalidRequestParams)
  }

  export const parsePathParams = (params: Params<PathParamsKey>): PathParams => {
    const { id } = params as Record<PathParamsKey, string>
    const result: PathParams = {
      id: Utils.parse(id),
    }
    return Utils.clone(result, Constants.invalidRequestParams)
  }
}
