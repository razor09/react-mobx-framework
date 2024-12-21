export type StringOrNumber = string | number

export type StringOrBoolean = string | boolean

export type StringOrNumberOrBoolean = StringOrNumber | boolean

export type UndefinedOrNull = undefined | null

export type Primitive = StringOrNumberOrBoolean | UndefinedOrNull

export type Property = Primitive | object

export type MaybeNull<T> = T | null

export type MaybeUndefined<T> = T | undefined

export type MaybeNotExist<T> = T | UndefinedOrNull

export type ClassName = string | string[]

export interface ClassNameCollection {
  [key: string]: boolean
}
