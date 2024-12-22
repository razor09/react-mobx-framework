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
import {
  ClassName,
  ClassNameCollection,
  MaybeNull,
  Primitive,
  Storage,
  StringOrBoolean,
  StringOrNumber,
} from './typings'

export const toInteger = (value: StringOrBoolean): MaybeNull<number> => {
  if (isString(value) && isNumberPattern(value)) return Math.round(value as never)
  else if (isBoolean(value)) return Number(value)
  else return null
}

export const toBoolean = (value: StringOrNumber): MaybeNull<boolean> => {
  if (isString(value) && isBooleanPattern(value)) return JSON.parse(value)
  else if (isNumber(value)) return Boolean(value)
  else return null
}

export const isEqual = (left: unknown, right: unknown): boolean => {
  if (isPrimitive(left) && isPrimitive(right)) {
    return left === right
  }
  if (isObject(left) && isObject(right)) {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    return isEqual(leftKeys, rightKeys) && leftKeys.every((key: never) => isEqual(left[key], right[key]))
  }
  if (isArray(left) && isArray(right)) {
    return isEqual(left.length, right.length) && left.every((value) => right.some((other) => isEqual(value, other)))
  }
  return false
}

export const rebuild = <T extends Storage>(storage: T, exceptions?: Primitive[]): T => {
  return Object.entries(storage).reduce((result, [key, value]) => {
    if (isPrimitive(value)) {
      return exceptions?.includes(value) ? { ...result } : { ...result, [key]: value }
    }
    if (isObject(value)) {
      return { ...result, [key]: rebuild(value, exceptions) }
    }
    if (isArray(value)) {
      return { ...result, [key]: value.map((item) => (isObject(item) ? rebuild(item, exceptions) : item)) }
    }
    return { ...result }
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
