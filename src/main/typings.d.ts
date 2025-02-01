declare module '*.scss' {
  const style: {
    [key: string]: string
  }
  export default style
}

declare const isMocksOn: boolean

declare const baseUrl: string
