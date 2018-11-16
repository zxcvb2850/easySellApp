import {observable, computed, action} from 'mobx'
import navInfo from "./navInfo"

/**
 * 根store
 * OneInfo OneInfo数据
 * TwoInfo TwoInfo数据
 */
class RootStore {
  constructor() {
	this.NavInfo = new NavInfo(navInfo, this)
  }
}

//路由信息
class NavInfo {
  @observable
  navList = "";

  constructor(route, store) {
	this.navList = route
	this.rootStore = store
  }

  @action
  setRoute(route) {
	this.navList = route
  }

  @action
  removeRoute() {
	this.navList = ""
  }
}

export default new RootStore()
