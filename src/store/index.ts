import { makeAutoObservable } from 'mobx'

class Store {}

const factory = new Store()

export const store = makeAutoObservable(factory)
