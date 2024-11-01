export type WebpackArgsMode = 'development' | 'production'

export type WebpackArgsType = 'mocks'

export interface WebpackArgs {
  mode: WebpackArgsMode
  name: WebpackArgsType
}
