import { info } from 'console'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { argv } from 'process'
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

const isComponentExists = (arg: string): boolean => {
  return existsSync(`${app}/${arg}`) || existsSync(`${icons}/${arg}`) || existsSync(`${ui}/${arg}`)
}

const isMocksExists = (arg: string): boolean => {
  return existsSync(`${handlers}/${arg}`)
}

const createComponent = (arg: string): void => {
  if (isComponentExists(arg)) {
    info(`${arg} already exists`)
  } else {
    const folder = `${app}/${arg}`
    mkdirSync(folder)
    writeFileSync(`${folder}/index.tsx`, insertContent('component', arg))
    writeFileSync(`${folder}/typings.d.ts`, insertContent('typings', arg))
    writeFileSync(`${folder}/style.scss`, insertContent('style', arg))
  }
}

const createMocks = (arg: string): void => {
  if (isMocksExists(arg)) {
    info(`${arg} already exists`)
  } else {
    const folder = `${handlers}/${arg}`
    mkdirSync(folder)
    writeFileSync(`${folder}/index.ts`, insertContent('handlers', arg))
    writeFileSync(`${folder}/mocks.ts`, insertContent('mocks', arg))
  }
}

const generate = (): void => {
  const [typeOfCodegen, ...args] = argv.slice(2) as ProcessArgs
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
