export type TypeOfCodegen = 'component' | 'mocks'

export type BoilerplateFile = 'component' | 'handlers' | 'mocks' | 'style' | 'typings'

export type ProcessArgs = [TypeOfCodegen, ...string[]]
