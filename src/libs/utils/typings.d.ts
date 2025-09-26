export type StringOrNumber = string | number

export type StringOrBoolean = string | boolean

export type StringOrNumberOrBoolean = StringOrNumber | StringOrBoolean

export type Primitive = Maybe<StringOrNumberOrBoolean>

export interface PlainObject extends Structure<PlainValue> {}

export type PrimitiveOrPlainObject = Primitive | PlainObject

export type PlainArray = Array<PrimitiveOrPlainObject>

export type PlainObjectOrPlainArray = PlainObject | PlainArray

export type PlainValue = PrimitiveOrPlainObject | PlainArray

export type PlainObjectKeys<T extends PlainObject> = Array<keyof T>

export type Structure<T extends PlainValue> = Record<string, T>

export type Optional<T> = T | undefined

export type Nullable<T> = T | null

export type Maybe<T> = Optional<Nullable<T>>

export type ClassName = string | string[]

export type ClassNameCollection = Structure<boolean>
