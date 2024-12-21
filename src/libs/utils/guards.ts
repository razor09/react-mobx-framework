import { Primitive, Property } from './typings'

export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number'
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === 'undefined'
}

export const isNull = (value: unknown): value is null => {
  return value === null
}

export const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && !isNull(value) && !isArray(value)
}

export const isArray = (value: unknown): value is ReadonlyArray<Property> => {
  return Array.isArray(value)
}

export const isPrimitive = (value: unknown): value is Primitive => {
  return isString(value) || isNumber(value) || isBoolean(value) || isNull(value) || isUndefined(value)
}

export const isBooleanPattern = (value: string): boolean => {
  const pattern = new RegExp('^(true|false)$')
  return pattern.test(value)
}

export const isNumberPattern = (value: string): boolean => {
  const pattern = new RegExp('^[+-]?\\d+(\\.\\d+)?$')
  return pattern.test(value)
}

export const isIntegerPattern = (value: string): boolean => {
  const pattern = new RegExp('^[+-]?\\d+$')
  return pattern.test(value)
}
