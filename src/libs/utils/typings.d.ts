export type Indentation = 2 | 4

export type Property = string | number | boolean | null | object

export type PropertyOrList = Property | Property[]

export type ClassName = string | string[]

export interface ClassNameCollection {
  [className: string]: boolean
}
