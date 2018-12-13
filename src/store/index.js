/**
 * actions
 * */
import { NavIndex, NavInfo } from "./actions/navStore";
import { EvalutList, EvalutIndex } from "./actions/evalutList"
import statusBarColor from "./actions/statusBarColor"

/*初始化mobx*/
const navIndex = 0;//路由
const navInfo = 0;//路由
const evalutList = [];//考评列表
const evalutId = null;//当前考评id
const evalutIndex = null;//当前考评
const statusBar = '#FFF';//默认颜色

class Index {
    constructor() {
        this.NavIndex = new NavIndex(navIndex, this);
        this.NavInfo = new NavInfo(navInfo, this);
        this.EvalutList = new EvalutList(evalutList, this);
        this.EvalutIndex = new EvalutIndex(evalutIndex, this);
        this.StatusBarColor = new statusBarColor(statusBar, this)
    }
}

export default new Index();