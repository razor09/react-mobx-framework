import { ClassName, ClassNameCollection, Indentation, PropertyOrList } from './typings'

export const isString = (propertyOrList: PropertyOrList): propertyOrList is string => {
  return typeof propertyOrList === 'string'
}

export const stringify = (value: PropertyOrList, space?: Indentation): string => {
  return JSON.stringify(value, space && null, space)
}

export const generateClassName = (className: ClassName, classNameCollection?: ClassNameCollection): string => {
  const result = isString(className) ? className : className.join(' ')
  if (classNameCollection) {
    return Object.keys(classNameCollection).reduce((value, className) => {
      return classNameCollection[className] ? value.concat(className) : value
    }, result)
  } else {
    return result
  }
}
