import { Utils } from '../utils'
import { JsonObjectOrJsonArray } from '../utils/typings'
import {
  Chunk,
  ContentType,
  ErrorCallback,
  HttpBaseConfig,
  HttpCallConfig,
  HttpResponseData,
  OnReadChunk,
  QueryParams,
  ReadHeadersFn,
  ReadResponseFn,
  RequestHeaders,
} from './typings'

export class HttpClient {
  private readonly baseUrl?: string
  private readonly credentials?: RequestCredentials
  private readonly headers?: ReadHeadersFn
  private errorCallback?: ErrorCallback

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
    const normalized = baseUrl.replace(/\/+$/, '')
    const path = endpoint.replace(/^\/+/, '')
    const url = `${normalized}/${path}`
    if (queryParams) {
      const queryString = Object.entries(queryParams)
        .filter(([_, value]) => Utils.isJsonPrimitive(value) && !Utils.isNull(value) && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
      if (queryString) {
        const hashIndex = url.indexOf('#')
        const hasHash = hashIndex !== -1
        const address = hasHash ? url.slice(0, hashIndex) : url
        const hash = hasHash ? url.slice(hashIndex) : ''
        const separator = address.includes('?') ? '&' : '?'
        return `${address}${separator}${queryString}${hash}`
      } else {
        return url
      }
    } else {
      return url
    }
  }

  private async call<R extends HttpResponseData>(config: HttpCallConfig, read: ReadResponseFn<R>): Promise<R> {
    try {
      const { endpoint, queryParams, method, body } = config
      const url = this.generateUrl(endpoint, queryParams)
      const initial = this.headers?.()
      const headers = new Headers(initial)
      const needsJsonContentType = body && !headers.has(RequestHeaders.ContentType)
      if (needsJsonContentType) headers.set(RequestHeaders.ContentType, ContentType.ApplicationJson)
      const payload = body && JSON.stringify(body)
      const response = await fetch(url, {
        method,
        headers,
        credentials: this.credentials,
        body: payload,
      })
      if (response.ok) {
        return await read(response)
      } else {
        throw new Error(`HTTP ${response.status}`, { cause: response })
      }
    } catch (error) {
      try {
        this.errorCallback?.(error)
      } finally {
        throw error
      }
    }
  }

  private async *readChunks(response: Response): AsyncGenerator<Chunk, void> {
    if (response.body) {
      const length = response.headers.get(RequestHeaders.ContentLength)
      const size = Number(length)
      const hasKnownSize = Number.isFinite(size) && size > 0
      const total = hasKnownSize ? size : 0
      let loaded = 0
      for await (const value of response.body) {
        loaded += value.length
        const fraction = hasKnownSize ? loaded / total : 0
        const percentage = Math.round(fraction * 100)
        const progress = Math.min(100, percentage)
        yield { value, loaded, total, progress }
      }
    }
  }

  public async get<R extends JsonObjectOrJsonArray>(endpoint: string, queryParams?: QueryParams): Promise<R> {
    const config: HttpCallConfig = {
      method: 'get',
      endpoint,
      queryParams,
    }
    return await this.call<R>(config, (response) => response.json())
  }

  public async post<R extends JsonObjectOrJsonArray>(endpoint: string, body?: JsonObjectOrJsonArray): Promise<R> {
    const config: HttpCallConfig = {
      method: 'post',
      endpoint,
      body,
    }
    return await this.call<R>(config, (response) => response.json())
  }

  public async put<R extends JsonObjectOrJsonArray>(endpoint: string, body?: JsonObjectOrJsonArray): Promise<R> {
    const config: HttpCallConfig = {
      method: 'put',
      endpoint,
      body,
    }
    return await this.call<R>(config, (response) => response.json())
  }

  public async delete<R extends JsonObjectOrJsonArray>(endpoint: string, body?: JsonObjectOrJsonArray): Promise<R> {
    const config: HttpCallConfig = {
      method: 'delete',
      endpoint,
      body,
    }
    return await this.call<R>(config, (response) => response.json())
  }

  public async downloadFile(endpoint: string, queryParams?: QueryParams): Promise<ArrayBuffer> {
    const config: HttpCallConfig = {
      method: 'get',
      endpoint,
      queryParams,
    }
    return await this.call(config, (response) => response.arrayBuffer())
  }

  public async downloadChunks(endpoint: string, queryParams?: QueryParams, onReadChunk?: OnReadChunk): Promise<Uint8Array[]> {
    const config: HttpCallConfig = {
      method: 'get',
      endpoint,
      queryParams,
    }
    return await this.call(config, async (response) => {
      const chunks = new Array<Uint8Array>()
      for await (const chunk of this.readChunks(response)) {
        chunks.push(chunk.value)
        onReadChunk?.(chunk)
      }
      return chunks
    })
  }

  public onError<E = unknown>(errorCallback: ErrorCallback<E>): void {
    this.errorCallback = errorCallback as ErrorCallback
  }
}
