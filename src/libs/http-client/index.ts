import { invalidRequestParams } from '../constants'
import { Utils } from '../utils'
import { PlainObjectOrPlainArray } from '../utils/typings'
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
  private readonly baseUrl?: string
  private readonly credentials?: RequestCredentials
  private readonly headers?: ReadHeadersFn
  private errorCallback?: ErrorCallback

  constructor(config?: Partial<HttpBaseConfig>) {
    if (config) {
      const { baseUrl, credentials, headers } = config
      this.baseUrl = baseUrl
      this.credentials = credentials
      this.headers = headers
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
      credentials: this.credentials,
      headers: this.headers && this.headers(),
      body: JSON.stringify(body),
    })
  }

  private async call<R extends PlainObjectOrPlainArray>(config: HttpCallConfig): Promise<R> {
    try {
      const { endpoint, queryParams, method, body } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, method, body)
      return response.json()
    } catch (error) {
      throw error
    }
  }

  public async get<R extends PlainObjectOrPlainArray>(endpoint: string, queryParams?: QueryParams): Promise<R> {
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

  public async post<R extends PlainObjectOrPlainArray>(endpoint: string, body?: PlainObjectOrPlainArray): Promise<R> {
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

  public async put<R extends PlainObjectOrPlainArray>(endpoint: string, body?: PlainObjectOrPlainArray): Promise<R> {
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

  public async delete<R extends PlainObjectOrPlainArray>(endpoint: string, body?: PlainObjectOrPlainArray): Promise<R> {
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
