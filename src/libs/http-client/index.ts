import { isArray } from '../utils/guards'
import { rebuild, toInteger } from '../utils/helpers'
import {
  Endpoint,
  ErrorCallback,
  HttpBaseConfig,
  HttpCallConfig,
  LoadFileConfig,
  LoadStreamConfig,
  QueryParams,
  RequestMethod,
  Stream,
} from './typings'

export class HttpClient {
  private readonly baseUrl: string
  private readonly headers: HeadersInit
  private readonly credentials: RequestCredentials

  private readonly exceptions = ['', NaN, null, undefined]

  private errorCallback: ErrorCallback<object>

  constructor(config?: Partial<HttpBaseConfig>) {
    if (config) {
      const { baseUrl, headers, credentials } = config
      this.baseUrl = baseUrl
      this.headers = headers
      this.credentials = credentials
    }
  }

  private generateFullPath(endpoint: Endpoint): string {
    if (isArray(endpoint)) {
      const [resource, ...params] = endpoint
      const parts = resource.split('/')
      let index = 0
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].startsWith(':') && params[index]) {
          parts[i] = params[index].toString()
          index++
        }
      }
      return parts.join('/')
    } else {
      return endpoint
    }
  }

  private generateUrl(endpoint: Endpoint, queryParams?: QueryParams): string {
    const baseUrl = this.baseUrl ?? ''
    const fullPath = this.generateFullPath(endpoint)
    if (queryParams) {
      const result = rebuild(queryParams, this.exceptions)
      const queryString = Object.entries(result)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
      return `${baseUrl}/${fullPath}?${queryString}`
    } else {
      return `${baseUrl}/${fullPath}`
    }
  }

  private async *pumpStream(total: number, reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<Stream> {
    let loaded = 0
    while (loaded < total) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        loaded += value.length
        yield {
          value,
          loaded,
          total,
          progress: Math.round((loaded / total) * 100),
        }
      }
    }
  }

  private async fetch<B extends object>(url: string, method: RequestMethod, body?: B): Promise<Response> {
    return await fetch(url, {
      method,
      headers: this.headers,
      credentials: this.credentials,
      body: JSON.stringify(body),
    })
  }

  private async call<R, Q extends QueryParams, B extends object>(config: HttpCallConfig<Q, B>): Promise<R> {
    try {
      const { endpoint, queryParams, method, body } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, method, body)
      return response.json()
    } catch (error) {
      throw error
    }
  }

  public async get<R, Q extends QueryParams = undefined>(endpoint: Endpoint, queryParams?: Q): Promise<R> {
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

  public async post<R, B extends object = undefined>(endpoint: Endpoint, body?: B): Promise<R> {
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

  public async put<R, B extends object = undefined>(endpoint: Endpoint, body?: B): Promise<R> {
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

  public async delete<R, B extends object = undefined>(endpoint: Endpoint, body?: B): Promise<R> {
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

  public async loadFile<Q extends QueryParams = undefined>(config: LoadFileConfig<Q>): Promise<ArrayBuffer> {
    try {
      const { endpoint, queryParams } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, 'get')
      return response.arrayBuffer()
    } catch (error) {
      if (this.errorCallback) this.errorCallback(error)
      throw error
    }
  }

  public async loadStream<Q extends QueryParams = undefined>(config: LoadStreamConfig<Q>): Promise<Uint8Array[]> {
    try {
      const { endpoint, queryParams, onReadStream } = config
      const url = this.generateUrl(endpoint, queryParams)
      const response = await this.fetch(url, 'get')
      const chunks = new Array<Uint8Array>()
      if (response.body) {
        const total = toInteger(response.headers.get('content-length'))
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

  public onError<E extends object>(errorCallback: ErrorCallback<E>): void {
    this.errorCallback = errorCallback
  }
}
