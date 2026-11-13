import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

export default defineConfig(({ mode }) => {
  const {
    host,
    port,
    proxy: { origin, prefix },
  } = pkg.config
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
