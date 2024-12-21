import {
  isArray,
  isBoolean,
  isBooleanPattern,
  isNumber,
  isNumberPattern,
  isObject,
  isPrimitive,
  isString,
} from './guards'
import { ClassName, ClassNameCollection, MaybeNotExist, Primitive, StringOrBoolean, StringOrNumber } from './typings'

export const toInteger = (value: MaybeNotExist<StringOrBoolean>): number => {
  if (isString(value) && isNumberPattern(value)) return Math.round(value as never)
  else if (isBoolean(value)) return Number(value)
  else return null
}

export const toBoolean = (value: MaybeNotExist<StringOrNumber>): boolean => {
  if (isString(value) && isBooleanPattern(value)) return JSON.parse(value)
  else if (isNumber(value)) return Boolean(value)
  else return null
}

export const isEqual = (first: unknown, second: unknown): boolean => {
  if (isPrimitive(first) && isPrimitive(second)) {
    return first === second
  }
  if (isObject(first) && isObject(second)) {
    const firstKeys = Object.keys(first)
    const secondKeys = Object.keys(second)
    return isEqual(firstKeys, secondKeys) && firstKeys.every((key: keyof object) => isEqual(first[key], second[key]))
  }
  if (isArray(first) && isArray(second)) {
    return isEqual(first.length, second.length) && first.every((value) => second.some((other) => isEqual(value, other)))
  }
}

export const rebuild = <T extends object>(object: T, exceptions?: Primitive[]): T => {
  return Object.entries(object).reduce((result, [key, value]) => {
    if (isPrimitive(value)) {
      return exceptions?.includes(value) ? { ...result } : { ...result, [key]: value }
    }
    if (isObject(value)) {
      return { ...result, [key]: rebuild(value, exceptions) }
    }
    if (isArray(value)) {
      return { ...result, [key]: value.map((nested) => rebuild(nested as T, exceptions)) }
    }
  }, {} as T)
}

export const generateClassName = (className: ClassName, classNameCollection?: ClassNameCollection): string => {
  const result = isString(className) ? className : className.join(' ')
  if (classNameCollection) {
    return Object.keys(classNameCollection).reduce((value, className) => {
      return classNameCollection[className] ? `${value} ${className}` : value
    }, result)
  } else {
    return result
  }
}
