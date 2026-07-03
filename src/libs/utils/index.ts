import { ClassName, ClassNameCollection, JsonArray, JsonObject, JsonPrimitive, JsonValue, StringOrNumber } from './typings'

export namespace Utils {
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
    return typeof value === 'object' && !isNull(value) && value.constructor === Object
  }

  export const isJsonArray = (value: JsonValue): value is JsonArray => {
    return Array.isArray(value)
  }

  export const isJsonValue = (value: JsonValue): value is JsonValue => {
    return isJsonPrimitive(value) || isJsonObject(value) || isJsonArray(value)
  }

  export const parse = <T extends JsonValue>(value: JsonValue): T => {
    if (isString(value)) {
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
    } else {
      if (isJsonObject(value)) {
        return Object.entries(value).reduce((result, [key, value]) => {
          const copy = clone(value, defy)
          return isJsonValue(copy) ? { ...result, [key]: copy } : result
        }, {}) as T
      } else if (isJsonArray(value)) {
        return value.map((value) => clone(value, defy)).filter(isJsonValue) as T
      } else {
        return value
      }
    }
  }

  export const isEqual = (left: JsonValue, right: JsonValue): boolean => {
    if (isJsonObject(left) && isJsonObject(right)) {
      const leftKeys = Object.keys(left)
      const rightKeys = Object.keys(right)
      return isEqual(leftKeys, rightKeys) && leftKeys.every((key) => isEqual(left[key], right[key]))
    } else if (isJsonArray(left) && isJsonArray(right)) {
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

  export const debounce = (delay?: number): Function => {
    return (method: Function): Function => {
      let timeout: NodeJS.Timeout
      return function (this: Function, ...params: []): void {
        clearTimeout(timeout)
        timeout = setTimeout(() => method.apply(this, params), delay)
      }
    }
  }
}
