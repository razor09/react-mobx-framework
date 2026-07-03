import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { config } from './package.json'

export default defineConfig(({ mode }) => {
  const {
    host,
    port,
    proxy: { origin, prefix },
  } = config
  const mocksOn = mode === 'mocks'
  const baseUrl = mocksOn ? '' : prefix || '*'
  const target = origin.concat(baseUrl)
  const proxy = { [baseUrl]: { target } }
  const options = mocksOn ? { host, port } : { host, port, proxy }
  return {
    plugins: viteReact(),
    server: options,
    preview: options,
    define: {
      mocksOn: JSON.stringify(mocksOn),
      baseUrl: JSON.stringify(baseUrl),
    },
  }
})
