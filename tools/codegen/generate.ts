import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { TypeOfFile, ValidProcessArgs } from './typings'

const boilerplateFolder = resolve('tools/boilerplate')
const appComponentsFolder = resolve('src/components/app')
const iconsComponentsFolder = resolve('src/components/icons')
const uiComponentsFolder = resolve('src/components/ui')
const mocksFolder = resolve('src/mocks')
const storeFolder = resolve('src/store')

const insertContent = (typeOfFile: TypeOfFile, file: string): string => {
  return readFileSync(`${boilerplateFolder}/${typeOfFile}`).toString().replace(/name/g, file)
}

const isNewComponent = (file: string): boolean => {
  return (
    !existsSync(`${appComponentsFolder}/${file}`) &&
    !existsSync(`${iconsComponentsFolder}/${file}`) &&
    !existsSync(`${uiComponentsFolder}/${file}`)
  )
}

const isNewMocks = (file: string): boolean => {
  return !existsSync(`${mocksFolder}/${file}`)
}

const isNewStore = (file: string): boolean => {
  return !existsSync(`${storeFolder}/${file}`)
}

const createComponent = (file: string): void => {
  if (isNewComponent(file)) {
    const folder = `${appComponentsFolder}/${file}`
    mkdirSync(folder)
    writeFileSync(`${folder}/${file}.tsx`, insertContent('component', file))
    writeFileSync(`${folder}/${file}.d.ts`, insertContent('model', file))
    writeFileSync(`${folder}/${file}.scss`, insertContent('style', file))
    writeFileSync(`${folder}/index.ts`, insertContent('index', file))
  }
}

const createMocks = (file: string): void => {
  if (isNewMocks(file)) {
    writeFileSync(`${mocksFolder}/${file}.ts`, insertContent('mocks', file))
  }
}

const createStore = (file: string): void => {
  if (isNewStore(file)) {
    writeFileSync(`${storeFolder}/${file}.ts`, insertContent('store', file))
  }
}

const generate = (): void => {
  const [typeOfCodegen, ...files] = process.argv.filter((_, index) => index > 1) as ValidProcessArgs
  files.forEach((file) => {
    switch (typeOfCodegen) {
      case 'component':
        createComponent(file)
        break
      case 'mocks':
        createMocks(file)
        break
      case 'store':
        createStore(file)
        break
    }
  })
}

generate()
