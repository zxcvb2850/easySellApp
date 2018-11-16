/**
 * 发送请求
 * */
import BaseServer from "./BaseServer"

//登录
export function login(username, password) {
    let url = "/app/user/login";
    let data = {username, password}
    return BaseServer.post(url, data)
}

//获取个人信息
export function getInfo() {
    let url = "/app/user/info";
    return BaseServer.get(url)
}

//登出
export function postLogout() {
    let url = "/app/user/logout";
    return BaseServer.post(url)
}
