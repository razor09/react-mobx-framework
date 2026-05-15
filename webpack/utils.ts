import { resolve } from 'path'
import { Configuration } from 'webpack-dev-server'
import { Args } from './typings'

const origin = ''
const baseUrl = ''

export const entry = resolve('src/main')
export const dist = resolve('dist')

export const getIsDevelopment = (args: Args): boolean => {
  return args.mode === 'development'
}

export const getIsProduction = (args: Args): boolean => {
  return args.mode === 'production'
}

export const getIsMocksOn = (args: Args): boolean => {
  return args.name === 'mocks'
}

export const getBaseUrl = (args: Args): string => {
  return getIsMocksOn(args) ? '' : baseUrl
}

export const getDevServer = (args: Args): Configuration => {
  return {
    host: 'localhost',
    port: 4200,
    historyApiFallback: true,
    proxy: getIsMocksOn(args)
      ? void args
      : [
          {
            context: baseUrl || '*',
            target: origin + baseUrl || '/',
          },
        ],
    client: getIsDevelopment(args)
      ? void args
      : {
          logging: 'none',
        },
  }
}
