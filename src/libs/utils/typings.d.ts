export type StringOrNumber = string | number

export type StringOrBoolean = string | boolean

export type StringOrNumberOrBoolean = StringOrNumber | StringOrBoolean

export type JsonPrimitive = Nullable<StringOrNumberOrBoolean>

export interface JsonObject extends Structure<JsonValue> {}

export type JsonPrimitiveOrJsonObject = JsonPrimitive | JsonObject

export type JsonArray = Array<JsonPrimitiveOrJsonObject> | ReadonlyArray<JsonPrimitiveOrJsonObject>

export type JsonObjectOrJsonArray = JsonObject | JsonArray

export type JsonValue = JsonPrimitiveOrJsonObject | JsonArray

export type JsonObjectKeys<T extends JsonObject> = Array<keyof T>

export type Structure<T extends JsonValue> = Record<string, T>

export type Optional<T> = T | undefined

export type Nullable<T> = T | null

export type ClassName = string | Array<string>

export type ClassNameCollection = Structure<boolean>

export type RequiredOnlyOne<T extends JsonObject, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

export type RequiredAtLeastOne<T extends JsonObject, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
