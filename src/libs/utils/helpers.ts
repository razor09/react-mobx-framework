import { ClassName, ClassNameCollection, Nullable, PlainObject, Primitive, StringOrBoolean, StringOrNumber } from './typings'

export namespace Helpers {
  export const isString = (value: unknown): value is string => {
    return typeof value === 'string'
  }

  export const isNumber = (value: unknown): value is number => {
    return typeof value === 'number' && !Number.isNaN(value) && value !== Infinity
  }

  export const isBoolean = (value: unknown): value is boolean => {
    return typeof value === 'boolean'
  }

  export const isNull = (value: unknown): value is null => {
    return value === null
  }

  export const isUndefined = (value: unknown): value is undefined => {
    return typeof value === 'undefined'
  }

  export const isPrimitive = (value: unknown): value is Primitive => {
    return isString(value) || isNumber(value) || isBoolean(value) || isUndefined(value) || isNull(value)
  }

  export const isPlainObject = <T = unknown>(value: unknown): value is PlainObject<T> => {
    return typeof value === 'object' && !isNull(value) && value.constructor === Object
  }

  export const isNumberPattern = (value: Nullable<string>): boolean => {
    const pattern = new RegExp('^[+-]?\\d+(\\.\\d+)?$')
    return pattern.test(value ?? '')
  }

  export const isBooleanPattern = (value: Nullable<string>): boolean => {
    const pattern = new RegExp('^(true|false)$')
    return pattern.test(value ?? '')
  }

  export const toNumber = (value: Nullable<StringOrBoolean>): Nullable<number> => {
    const result = Number(value)
    return Number.isNaN(result) ? null : result
  }

  export const toBoolean = (value: Nullable<StringOrNumber>): Nullable<boolean> => {
    if (isString(value) && isBooleanPattern(value)) return JSON.parse(value)
    if (isNumber(value)) return Boolean(value)
    return null
  }

  export const omit = <T extends PlainObject<Primitive>>(object: T, ignore: Primitive[]): T => {
    return Object.entries(object).reduce((result, [key, value]) => {
      return ignore.includes(value) ? { ...result } : { ...result, [key]: value }
    }, {}) as T
  }

  export const clone = <T = unknown>(value: T): T => {
    if (isPlainObject(value)) {
      return Object.entries(value).reduce((result, [key, value]) => {
        return { ...result, [key]: clone(value) }
      }, {}) as T
    }
    if (Array.isArray(value)) {
      return value.map((value) => clone(value)) as T
    }
    return value
  }

  export const equals = (left: unknown, right: unknown): boolean => {
    if (isPlainObject(left) && isPlainObject(right)) {
      const leftKeys = Object.keys(left)
      const rightKeys = Object.keys(right)
      return equals(leftKeys, rightKeys) && leftKeys.every((key) => equals(left[key], right[key]))
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      return equals(left.length, right.length) && left.every((value) => right.some((other) => equals(value, other)))
    }
    return left === right
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
}
