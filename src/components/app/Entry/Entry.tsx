import { observer } from 'mobx-react-lite'
import { BrowserRouter } from 'react-router-dom'
import style from './Entry.scss'

export const Entry = observer(() => {
  return (
    <BrowserRouter>
      <div className={style.container}>React Mobx Template</div>
    </BrowserRouter>
  )
})
