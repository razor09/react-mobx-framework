import viteReact from '@vitejs/plugin-react'
import { CommonServerOptions, defineConfig, UserConfig } from 'vite'
import { config } from './package.json'

export default defineConfig(({ mode }): UserConfig => {
  const { proxy, host, port } = config
  const mocksOn = mode === 'mocks'
  const baseUrl = mocksOn ? '' : proxy.baseUrl || '*'
  const options: CommonServerOptions = {
    host,
    port,
    proxy: mocksOn
      ? void mocksOn
      : {
          [baseUrl]: {
            target: proxy.origin.concat(baseUrl),
          },
        },
  }
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
