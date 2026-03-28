import { createRoot } from 'react-dom/client'
import { Entry } from '../components/main'
import '../theme/global.scss'

if (isMocksOn) await import('../mocks/browser')

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)
  root.render(<Entry />)
}
