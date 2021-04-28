import { createContext } from 'react'
import { observable, action, configure } from 'mobx'

configure({ enforceActions: 'observed' })

class TabStore {
  @observable selected = 0
  @action setSelect = (current) => {
    this.selected = current
  }
}

export default createContext(new TabStore)