import { info } from 'console'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { argv } from 'process'
import { Template } from './typings'

const template = resolve('tools/template')
const pages = resolve('src/components/pages')
const ui = resolve('src/components/ui')
const kit = resolve('src/components/kit')
const icons = resolve('src/components/icons')
const handlers = resolve('src/mocks/handlers')

const insertContent = (file: Template, arg: string): string => {
  const search = new RegExp('__arg__', 'g')
  return readFileSync(`${template}/${file}.plain`, 'utf-8').replace(search, arg)
}

const isComponentExists = (arg: string): boolean => {
  return existsSync(`${pages}/${arg}`) || existsSync(`${ui}/${arg}`) || existsSync(`${kit}/${arg}`) || existsSync(`${icons}/${arg}`)
}

const isMocksExists = (arg: string): boolean => {
  return existsSync(`${handlers}/${arg}`)
}

const createComponent = (arg: string): void => {
  if (isComponentExists(arg)) {
    info(`${arg} already exists`)
  } else {
    const folder = `${pages}/${arg}`
    mkdirSync(folder)
    writeFileSync(`${folder}/index.tsx`, insertContent('component', arg))
    writeFileSync(`${folder}/typings.d.ts`, insertContent('typings', arg))
    writeFileSync(`${folder}/style.module.scss`, insertContent('style', arg))
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
  const [_, __, type, ...args] = argv
  args.forEach((arg) => {
    switch (type) {
      case 'component':
        return createComponent(arg)
      case 'mocks':
        return createMocks(arg)
      default:
        return info('wrong argument')
    }
  })
}

generate()
