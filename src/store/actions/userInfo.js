/**
 * 用户个人信息
 * */
import {observable, action} from "mobx";

export default class UserInfo {
    @observable
    userInfo = "";

    constructor(info) {
        this.userInfo = info;
    }

    @action
    setUserInfo(info) {
        this.userInfo = info;
    }
}