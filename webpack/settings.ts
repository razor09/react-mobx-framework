import { ProxyConfigArray } from 'webpack-dev-server'
import { Optional } from '../src/libs/utils/typings'
import { WebpackArgs } from './typings'

const origin = ''
const baseUrl = '*'

export const host = 'localhost'
export const port = 4200
export const fallback = `http://${host}:${port}?${origin}`

export const getIsDevelopment = (args: WebpackArgs): boolean => {
  return args.mode === 'development'
}

export const getIsProduction = (args: WebpackArgs): boolean => {
  return args.mode === 'production'
}

export const getIsMocksOn = (args: WebpackArgs): boolean => {
  return getIsDevelopment(args) && args.name === 'mocks'
}

export const getIsMocksOff = (args: WebpackArgs): boolean => {
  return getIsDevelopment(args) && args.name !== 'mocks'
}

export const getBaseUrl = (args: WebpackArgs): string => {
  return getIsMocksOn(args) ? '' : JSON.stringify(baseUrl)
}

export const getProxy = (args: WebpackArgs): Optional<ProxyConfigArray> => {
  if (getIsMocksOff(args)) {
    return [
      {
        context: baseUrl,
        target: origin.concat(baseUrl),
      },
    ]
  }
}
