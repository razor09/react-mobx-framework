import { makeAutoObservable } from 'mobx'

class Store {
  public readonly project = 'React Mobx Framework'
}

const factory = new Store()

export const store = makeAutoObservable(factory)
