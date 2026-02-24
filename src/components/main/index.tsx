import { observer } from 'mobx-react-lite'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../../store'
import style from './style.scss'

export const Entry = observer(() => {
  return (
    <BrowserRouter>
      <div className={style.container}>{store.project}</div>
    </BrowserRouter>
  )
})
