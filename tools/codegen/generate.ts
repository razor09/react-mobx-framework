import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { BoilerplateFile, ProcessArgs } from './typings'

const boilerplate = resolve('tools/boilerplate')
const app = resolve('src/components/app')
const icons = resolve('src/components/icons')
const ui = resolve('src/components/ui')
const handlers = resolve('src/mocks/handlers')

const insertContent = (boilerplateFile: BoilerplateFile, arg: string): string => {
  const search = new RegExp('__arg__', 'g')
  return readFileSync(`${boilerplate}/${boilerplateFile}.plain`, 'utf-8').replace(search, arg)
}

const isNewComponent = (arg: string): boolean => {
  return !existsSync(`${app}/${arg}`) && !existsSync(`${icons}/${arg}`) && !existsSync(`${ui}/${arg}`)
}

const isNewMocks = (arg: string): boolean => {
  return !existsSync(`${handlers}/${arg}`)
}

const createComponent = (arg: string): void => {
  if (isNewComponent(arg)) {
    const folder = `${app}/${arg}`
    mkdirSync(folder)
    writeFileSync(`${folder}/index.tsx`, insertContent('component', arg))
    writeFileSync(`${folder}/typings.d.ts`, insertContent('typings', arg))
    writeFileSync(`${folder}/style.scss`, insertContent('style', arg))
  }
}

const createMocks = (arg: string): void => {
  if (isNewMocks(arg)) {
    const folder = `${handlers}/${arg}`
    mkdirSync(folder)
    writeFileSync(`${folder}/index.ts`, insertContent('handlers', arg))
    writeFileSync(`${folder}/mocks.ts`, insertContent('mocks', arg))
  }
}

const generate = (): void => {
  const [typeOfCodegen, ...args] = process.argv.filter((_, index) => index > 1) as ProcessArgs
  args.forEach((arg) => {
    switch (typeOfCodegen) {
      case 'component':
        createComponent(arg)
        break
      case 'mocks':
        createMocks(arg)
        break
    }
  })
}

generate()
