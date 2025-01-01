import { createRoot } from 'react-dom/client'
import { Entry } from '../components/app/Entry'
import '../theme/global.scss'

if (isMocksOn) require('../mocks/browser')

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Entry />)
