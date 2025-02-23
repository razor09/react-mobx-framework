import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { BoilerplateFile, ValidProcessArgs } from './typings'

const boilerplateFolder = resolve('tools/boilerplate')
const appComponentsFolder = resolve('src/components/app')
const iconsComponentsFolder = resolve('src/components/icons')
const uiComponentsFolder = resolve('src/components/ui')
const mocksFolder = resolve('src/mocks/handlers')

const insertContent = (boilerplateFile: BoilerplateFile, arg: string): string => {
  const search = new RegExp('__arg__', 'g')
  return readFileSync(`${boilerplateFolder}/${boilerplateFile}.plain`, 'utf-8').replace(search, arg)
}

const isNewComponent = (arg: string): boolean => {
  return (
    !existsSync(`${appComponentsFolder}/${arg}`) &&
    !existsSync(`${iconsComponentsFolder}/${arg}`) &&
    !existsSync(`${uiComponentsFolder}/${arg}`)
  )
}

const isNewMocks = (arg: string): boolean => {
  return !existsSync(`${mocksFolder}/${arg}`)
}

const createComponent = (arg: string): void => {
  if (isNewComponent(arg)) {
    const folder = `${appComponentsFolder}/${arg}`
    mkdirSync(folder)
    writeFileSync(`${folder}/index.tsx`, insertContent('component', arg))
    writeFileSync(`${folder}/typings.d.ts`, insertContent('typings', arg))
    writeFileSync(`${folder}/style.scss`, insertContent('style', arg))
  }
}

const createMocks = (arg: string): void => {
  if (isNewMocks(arg)) {
    const folder = `${mocksFolder}/${arg}`
    mkdirSync(folder)
    writeFileSync(`${folder}/index.ts`, insertContent('handlers', arg))
    writeFileSync(`${folder}/mocks.ts`, insertContent('mocks', arg))
  }
}

const generate = (): void => {
  const [typeOfCodegen, ...args] = process.argv.filter((_, index) => index > 1) as ValidProcessArgs
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
