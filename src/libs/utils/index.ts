import {
  ClassName,
  ClassNameCollection,
  PlainArray,
  PlainObject,
  PlainValue,
  Primitive,
  StringOrBoolean,
  StringOrNumber,
} from './typings'

export namespace Utils {
  export const isString = (value: PlainValue): value is string => {
    return typeof value === 'string'
  }

  export const isNumber = (value: PlainValue): value is number => {
    return typeof value === 'number' && isNumberPattern(value.toString())
  }

  export const isBoolean = (value: PlainValue): value is boolean => {
    return typeof value === 'boolean'
  }

  export const isUndefined = (value: PlainValue): value is undefined => {
    return typeof value === 'undefined'
  }

  export const isNull = (value: PlainValue): value is null => {
    return value === null
  }

  export const isPlainObject = (value: PlainValue): value is PlainObject => {
    return typeof value === 'object' && !isNull(value) && value.constructor === Object
  }

  export const isPlainArray = (value: PlainValue): value is PlainArray => {
    return Array.isArray(value)
  }

  export const isPrimitive = (value: PlainValue): value is Primitive => {
    return isString(value) || isNumber(value) || isBoolean(value) || isUndefined(value) || isNull(value)
  }

  export const isPlainValue = (value: unknown): value is PlainValue => {
    const match = value as PlainValue
    return isPrimitive(match) || isPlainObject(match) || isPlainArray(match)
  }

  export const isNumberPattern = (value: string): boolean => {
    const pattern = new RegExp('^[+-]?\\d+(\\.\\d+)?$')
    return pattern.test(value)
  }

  export const isBooleanPattern = (value: string): boolean => {
    const pattern = new RegExp('^(true|false)$')
    return pattern.test(value)
  }

  export const toNumber = (value: StringOrBoolean): number => {
    const result = Number(value)
    return Number.isNaN(result) ? 0 : result
  }

  export const toBoolean = (value: StringOrNumber): boolean => {
    return isNumber(value) ? Boolean(value) : isBooleanPattern(value) ? JSON.parse(value) : false
  }

  export const clone = <T extends PlainValue>(value: T, defy = new Array<PlainValue>()): T => {
    const exclude = defy.some((exclude) => isEqual(exclude, value))
    if (exclude) {
      return void exclude as T
    } else {
      if (isPlainObject(value)) {
        return Object.entries(value)
          .filter(([key]) => !defy.includes(`#${key}`))
          .reduce((result, [key, value]) => {
            const copy = clone(value, defy)
            return isUndefined(copy) ? result : { ...result, [key]: copy }
          }, {}) as T
      } else if (isPlainArray(value)) {
        return value.map((value) => clone(value, defy)).filter((value) => !isUndefined(value)) as T
      } else {
        return value
      }
    }
  }

  export const isEqual = (left: PlainValue, right: PlainValue): boolean => {
    if (isPlainObject(left) && isPlainObject(right)) {
      const leftKeys = Object.keys(left)
      const rightKeys = Object.keys(right)
      return isEqual(leftKeys, rightKeys) && leftKeys.every((key) => isEqual(left[key], right[key]))
    } else if (isPlainArray(left) && isPlainArray(right)) {
      return isEqual(left.length, right.length) && left.every((value) => right.some((other) => isEqual(value, other)))
    } else {
      return left?.toString() === right?.toString()
    }
  }

  export const generateClassName = (className: ClassName, classNameCollection?: ClassNameCollection): string => {
    const result = isString(className) ? className : className.join(' ')
    if (classNameCollection) {
      return Object.entries(classNameCollection).reduce((result, [key, value]) => {
        return value ? `${result} ${key}` : result
      }, result)
    } else {
      return result
    }
  }

  export const interpolate = (path: string, ...params: StringOrNumber[]): string => {
    const segments = path.split('/')
    let index = 0
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].startsWith(':') && params[index]) {
        segments[i] = params[index].toString()
        index++
      }
    }
    return segments.join('/')
  }
}
