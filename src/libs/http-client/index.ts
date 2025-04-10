import { invalidRequestParams } from '../constants'
import { Utils } from '../utils'
import { Optional, PlainObjectOrPlainArray, StringOrNumber } from '../utils/typings'
import {
  ErrorCallback,
  HttpBaseConfig,
  HttpCallConfig,
  OnReadStream,
  QueryParams,
  ReadHeadersFn,
  RequestMethod,
  Stream,
} from './typings'

export class HttpClient {
  private readonly baseUrl: Optional<string>
  private readonly headers: Optional<ReadHeadersFn>
  private readonly credentials: Optional<RequestCredentials>

  private errorCallback: Optional<ErrorCallback>

  constructor(config?: Partial<HttpBaseConfig>) {
    if (config) {
      const { baseUrl, headers, credentials } = config
      this.baseUrl = baseUrl
      this.headers = headers
      this.credentials = credentials
    }
  }

  private generateUrl(endpoint: string, queryParams?: QueryParams): string {
    const baseUrl = this.baseUrl ?? ''
    if (queryParams) {
      const result = Utils.clone(queryParams, invalidRequestParams)
      const queryString = Object.entries(result)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
      return `${baseUrl}/${endpoint}?${queryString}`
    } else {
      return `${baseUrl}/${endpoint}`
    }
  }

  private async *pumpStream(total: number, reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<Stream> {
    let loaded = 0
    while (loaded < total) {
      const { done, value } = await reader.read()
      if (value) {
        loaded += value.length
        yield {
          value,
          loaded,
          total,
          progress: Math.round((loaded / total) * 100),
        }
      } else if (done) break
    }
  }

  private async fetch(url: string, method: RequestMethod, body?: PlainObjectOrPlainArray): Promise<Response> {
    return await fetch(url, {
      method,
      headers: this.headers && this.headers(),
      credentials: this.credentials,
      body: JSON.stringify(body),
    })
  }

  private async call<R>(config: HttpCallConfig): Promise<R> {
    try {
      const { endpoint, queryParams, method, body } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, method, body)
      return response.json()
    } catch (error) {
      throw error
    }
  }

  public endpoint(resource: string, ...pathParams: StringOrNumber[]): string {
    const segments = resource.split('/')
    let index = 0
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].startsWith(':') && pathParams[index]) {
        segments[i] = pathParams[index].toString()
        index++
      }
    }
    return segments.join('/')
  }

  public async get<R>(endpoint: string, queryParams?: QueryParams): Promise<R> {
    try {
      return await this.call({
        method: 'get',
        endpoint,
        queryParams,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async post<R>(endpoint: string, body?: PlainObjectOrPlainArray): Promise<R> {
    try {
      return await this.call({
        method: 'post',
        endpoint,
        body,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async put<R>(endpoint: string, body?: PlainObjectOrPlainArray): Promise<R> {
    try {
      return await this.call({
        method: 'put',
        endpoint,
        body,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async delete<R>(endpoint: string, body?: PlainObjectOrPlainArray): Promise<R> {
    try {
      return await this.call({
        method: 'delete',
        endpoint,
        body,
      })
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async loadFile(endpoint: string, queryParams?: QueryParams): Promise<ArrayBuffer> {
    try {
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, 'get')
      return response.arrayBuffer()
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async loadStream(endpoint: string, queryParams?: QueryParams, onReadStream?: OnReadStream): Promise<Uint8Array[]> {
    try {
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, 'get')
      const chunks = new Array<Uint8Array>()
      if (response.body) {
        const length = response.headers.get('content-length') ?? false
        const total = Utils.toNumber(length)
        if (total) {
          const reader = response.body.getReader()
          for await (const stream of this.pumpStream(total, reader)) {
            chunks.push(stream.value)
            if (onReadStream) onReadStream(stream)
          }
        }
      }
      return chunks
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public onError<E = unknown>(errorCallback: ErrorCallback<E>): void {
    this.errorCallback = errorCallback as ErrorCallback
  }
}
