export type TypeOfCodegen = 'component' | 'mocks' | 'store'

export type TypeOfFile = TypeOfCodegen | 'model' | 'style' | 'index'

export type ValidProcessArgs = [TypeOfCodegen, ...string[]]
