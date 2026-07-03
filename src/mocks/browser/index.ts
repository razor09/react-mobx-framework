import { setupWorker } from 'msw/browser'

const worker = setupWorker()

worker.start({
  onUnhandledRequest: 'bypass',
})
