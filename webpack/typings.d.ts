export type WebpackArgsMode = 'development' | 'production'

export type WebpackArgsName = 'mocks'

export interface WebpackArgs {
  mode: WebpackArgsMode
  name: WebpackArgsName
}
