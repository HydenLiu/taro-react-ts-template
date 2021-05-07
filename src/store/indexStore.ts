import { makeAutoObservable, configure, runInAction } from 'mobx'
import Request from '@/utils/request'
import api from "@/config/api";
import { IndexTypes } from '@/types/store/index.interface';

configure({ enforceActions: 'observed' })

const {} = api;

class IndexStore implements IndexTypes{
  [key: string]: any
  constructor() {
    makeAutoObservable(this);
  }

  public storeName: string = 'index'

  // 更新state
  updateState = (params: IndexTypes) => {
    for (let [key, value] of Object.entries(params)) {
      this[key] = value
    }
  }
}

export default new IndexStore()
