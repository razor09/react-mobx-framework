import { Utils } from '../utils'
import { Nullable } from '../utils/typings'
import { StorageKey, StorageValue } from './typings'

export namespace Storage {
  export const get = <T extends StorageValue>(key: StorageKey): Nullable<T> => {
    const item = localStorage.getItem(key)
    return Utils.parse(item)
  }

  export const set = (key: StorageKey, value: StorageValue): void => {
    const item = JSON.stringify(value)
    localStorage.setItem(key, item)
  }

  export const remove = (key: StorageKey): void => {
    localStorage.removeItem(key)
  }
}
