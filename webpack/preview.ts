import { createServer } from 'http-server'
import { resolve } from 'path'
import { fallback, host, origin, port } from './settings'

const server = createServer({
  root: resolve('dist'),
  proxy: fallback.concat(origin),
})

server.listen(port, host)
