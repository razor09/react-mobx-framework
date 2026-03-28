import { createServer } from 'http-server'
import { host, port, proxy, dist as root } from './utils'

const server = createServer({ root, proxy })

server.listen(port, host)
