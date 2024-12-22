export type TypeOfCodegen = 'component' | 'mocks'

export type BoilerplateFile = 'component' | 'handlers' | 'mocks' | 'style' | 'typings'

export type ValidProcessArgs = [TypeOfCodegen, ...string[]]
