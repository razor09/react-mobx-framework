import { resolve } from 'path'
import { ProxyConfigArray } from 'webpack-dev-server'
import { Optional } from '../src/libs/utils/typings'
import { Args } from './typings'

const origin = ''
const baseUrl = ''

export const entry = resolve('src/main')
export const dist = resolve('dist')

export const host = 'localhost'
export const port = 4200
export const proxy = `http://${host}:${port}?${origin}`

export const getIsDevelopment = (args: Args): boolean => {
  return args.mode === 'development'
}

export const getIsProduction = (args: Args): boolean => {
  return args.mode === 'production'
}

export const getIsMocksOn = (args: Args): boolean => {
  return getIsDevelopment(args) && args.name === 'mocks'
}

export const getIsMocksOff = (args: Args): boolean => {
  return getIsDevelopment(args) && args.name !== 'mocks'
}

export const getBaseUrl = (args: Args): string => {
  return getIsMocksOn(args) ? '' : baseUrl
}

export const getProxy = (args: Args): Optional<ProxyConfigArray> => {
  if (getIsMocksOff(args)) {
    const prefix = baseUrl || '/'
    return [
      {
        context: prefix,
        target: origin.concat(prefix),
      },
    ]
  }
}
