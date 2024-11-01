import { ProxyConfigArray } from 'webpack-dev-server'
import { stringify } from '../src/libs/utils/helpers'
import { Args } from './typings'

export const host = 'localhost'
export const port = 4200
export const origin = ''

const baseUrl = ''

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
  return getIsMocksOn(args) ? '' : stringify(baseUrl)
}

export const getProxy = (args: Args): ProxyConfigArray => {
  if (getIsMocksOff(args)) {
    const href = baseUrl || '/'
    return [
      {
        context: href,
        target: origin.concat(href),
      },
    ]
  }
}
