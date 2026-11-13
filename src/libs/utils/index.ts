import {
  ClassName,
  ClassNameCollection,
  Debounce,
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  Nullable,
  Optional,
  StringOrNumber,
} from './typings'

export namespace Utils {
  export const isUndefined = (value: Optional<JsonValue>): value is undefined => {
    return typeof value === 'undefined'
  }

  export const isString = (value: JsonValue): value is string => {
    return typeof value === 'string'
  }

  export const isNumber = (value: JsonValue): value is number => {
    return typeof value === 'number' && Number.isFinite(value)
  }

  export const isBoolean = (value: JsonValue): value is boolean => {
    return typeof value === 'boolean'
  }

  export const isNull = (value: JsonValue): value is null => {
    return value === null
  }

  export const isJsonPrimitive = (value: JsonValue): value is JsonPrimitive => {
    return isString(value) || isNumber(value) || isBoolean(value) || isNull(value)
  }

  export const isJsonObject = (value: JsonValue): value is JsonObject => {
    const isObject = typeof value === 'object' && !isNull(value)
    if (isObject) {
      const prototype = Object.getPrototypeOf(value)
      return prototype === Object.prototype || isNull(prototype)
    } else {
      return false
    }
  }

  export const isJsonArray = (value: JsonValue): value is JsonArray => {
    return Array.isArray(value)
  }

  export const isJsonValue = (value: JsonValue): value is JsonValue => {
    return isJsonPrimitive(value) || isJsonObject(value) || isJsonArray(value)
  }

  export const parse = <T extends JsonValue>(value: Nullable<string>): T => {
    if (value) {
      try {
        return JSON.parse(value)
      } catch {
        return value as T
      }
    } else {
      return value as T
    }
  }

  export const clone = <T extends JsonValue>(value: T, defy = new Array<JsonValue>()): T => {
    const exclude = defy.some((exclude) => isEqual(exclude, value))
    if (exclude) {
      return void exclude as never
    } else if (isJsonObject(value)) {
      const entries = Object.entries(value)
        .map(([key, value]) => [key, clone(value, defy)])
        .filter(([_, value]) => isJsonValue(value))
      return Object.fromEntries(entries)
    } else if (isJsonArray(value)) {
      const copy = value.map((value) => clone(value, defy))
      const result = defy.length ? copy.filter(isJsonValue) : copy
      return result as T
    } else {
      return value
    }
  }

  export const isEqual = (left: JsonValue, right: JsonValue): boolean => {
    if (isJsonObject(left) && isJsonObject(right)) {
      const leftKeys = Object.keys(left)
      const rightKeys = Object.keys(right)
      if (leftKeys.length === rightKeys.length) {
        return leftKeys.every((key) => Object.hasOwn(right, key) && isEqual(left[key], right[key]))
      } else {
        return false
      }
    } else if (isJsonArray(left) && isJsonArray(right)) {
      if (left.length === right.length) {
        return left.keys().every((index) => Object.hasOwn(left, index) === Object.hasOwn(right, index) && isEqual(left[index], right[index]))
      } else {
        return false
      }
    } else {
      return left === right
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
    let index = 0
    return path
      .split('/')
      .map((segment) => {
        return segment.startsWith(':') && index < params.length ? params.at(index++)?.toString() : segment
      })
      .join('/')
  }

  export const debounce: Debounce = (delay) => {
    return (method) => {
      let id: number
      return function (...args) {
        self.clearTimeout(id)
        id = self.setTimeout(() => method.apply(this, args), delay)
      }
    }
  }
}
