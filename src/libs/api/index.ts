import { Fallback } from '../fallback'
import { HttpClient } from '../http-client'

export namespace Api {
  const http = new HttpClient({ baseUrl })

  http.onError(Fallback.handler)
}
