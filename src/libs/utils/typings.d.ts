export type StringOrNumber = string | number

export type StringOrBoolean = string | boolean

export type StringOrNumberOrBoolean = StringOrNumber | boolean

export type Primitive = Maybe<StringOrNumberOrBoolean>

export type PlainObject<T = unknown> = Record<string, T>

export type PlainObjectOrArray<T = unknown, R = unknown> = PlainObject<T> | Array<R>

export type Optional<T> = T | undefined

export type Nullable<T> = T | null

export type Maybe<T> = Optional<Nullable<T>>

export type NullableProperties<T> = Record<keyof T, Nullable<T[keyof T]>>

export type ClassName = string | string[]

export type ClassNameCollection = Record<string, boolean>
