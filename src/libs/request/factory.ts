import { stringify } from '../utils/helpers'
import { ErrorCallback, QueryParams, RequestBaseConfig, RequestCallConfig } from './typings'

export class Request {
  private baseUrl: string
  private headers: HeadersInit
  private credentials: RequestCredentials
  private errorCallback: ErrorCallback

  constructor(config?: Partial<RequestBaseConfig>) {
    if (config) {
      const { baseUrl, headers, credentials } = config
      this.baseUrl = baseUrl
      this.headers = headers
      this.credentials = credentials
    }
  }

  private generateUrl(endpoint: string, queryParams?: QueryParams): string {
    const baseUrl = this.baseUrl || ''
    if (queryParams) {
      const queryString = Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join('&')
      return `${baseUrl}/${endpoint}?${queryString}`
    } else {
      return `${baseUrl}/${endpoint}`
    }
  }

  private async call<R, Q extends QueryParams, B extends object>(config: RequestCallConfig<Q, B>): Promise<R> {
    try {
      const { endpoint, queryParams, method, body } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await fetch(url, {
        method,
        headers: this.headers,
        credentials: this.credentials,
        body: stringify(body),
      })
      return response.json()
    } catch (error) {
      throw error
    }
  }

  public async get<R, Q extends QueryParams = QueryParams>(endpoint: string, queryParams?: Q): Promise<R> {
    try {
      return await this.call({
        method: 'get',
        endpoint,
        queryParams,
      })
    } catch (error) {
      this.errorCallback && this.errorCallback(error)
      throw error
    }
  }

  public async post<R, B extends object = object>(endpoint: string, body?: B): Promise<R> {
    try {
      return await this.call({
        method: 'post',
        endpoint,
        body,
      })
    } catch (error) {
      this.errorCallback && this.errorCallback(error)
      throw error
    }
  }

  public async put<R, B extends object = object>(endpoint: string, body?: B): Promise<R> {
    try {
      return await this.call({
        method: 'put',
        endpoint,
        body,
      })
    } catch (error) {
      this.errorCallback && this.errorCallback(error)
      throw error
    }
  }

  public async delete<R, B extends object = object>(endpoint: string, body?: B): Promise<R> {
    try {
      return await this.call({
        method: 'delete',
        endpoint,
        body,
      })
    } catch (error) {
      this.errorCallback && this.errorCallback(error)
      throw error
    }
  }

  public onError<E extends object>(errorCallback: ErrorCallback<E>): void {
    this.errorCallback = errorCallback
  }
}
