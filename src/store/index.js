/**
 * actions
 * */
import UserInfo from "./actions/userInfo";
import {NavIndex, NavInfo} from "./actions/navStore";
import {EvalutList, EvalutIndex} from "./actions/evalutList";
import StatusBarColor from "./actions/statusBarColor";
import PhotoPath from "./actions/photoScreen";

/*初始化mobx*/
const userInfo = "";//个人信息
const navIndex = 0;//路由
const navInfo = 0;//路由
const evalutList = [];//考评列表
const evalutIndex = null;//当前考评
const statusBar = "#FFF";//默认颜色
const photoPath = null;

class Index {
    constructor() {
        this.UserInfo = new UserInfo(userInfo, this);
        this.NavIndex = new NavIndex(navIndex, this);
        this.NavInfo = new NavInfo(navInfo, this);
        this.EvalutList = new EvalutList(evalutList, this);
        this.EvalutIndex = new EvalutIndex(evalutIndex, this);
        this.StatusBarColor = new StatusBarColor(statusBar, this);
        this.PhotoPath = new PhotoPath(photoPath, this);
    }
}

export default new Index();