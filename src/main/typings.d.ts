declare module '*.scss' {
  const style: Record<string, string>
  export default style
}

declare const isMocksOn: boolean

declare const baseUrl: string
