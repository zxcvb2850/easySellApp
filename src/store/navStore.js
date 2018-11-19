/**
 * 路由相关的信息
 * */
import {observable, computed, action} from 'mobx'

const navInfo = 0;

class RootStore {
    constructor() {
        this.NavInfo = new NavInfo(navInfo, this)
    }
}

//路由信息
class NavInfo {
    @observable
    navList = "";

    constructor(route) {
        this.navList = route
    }

    @action
    addRoute(route) {
        this.navList = route + 1
    }

    @action
    delRoute(route) {
        this.navList = route - 1
    }

    @action
    removeRoute() {
        this.navList = ""
    }

    @action
    setRoute(router) {
        this.navList = router
    }
}

export default new RootStore()
