import { createServer } from 'http-server'
import { resolve } from 'path'
import { host, origin, port } from './settings'

const server = createServer({
  root: resolve('dist'),
  proxy: origin,
})

server.listen(port, host)
