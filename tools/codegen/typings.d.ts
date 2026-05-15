export type TypeOfCodegen = 'component' | 'mocks'

export type BoilerplateFile = TypeOfCodegen | 'handlers' | 'style' | 'typings'

export type ProcessArgs = [TypeOfCodegen, ...string[]]
