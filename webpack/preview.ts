import { createServer } from 'http-server'
import { resolve } from 'path'
import { fallback, host, port } from './settings'

const server = createServer({
  root: resolve('dist'),
  proxy: fallback,
})

server.listen(port, host)
