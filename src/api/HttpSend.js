/**
 * 发送请求
 * */
import {AsyncStorage} from "react-native";
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

//修改密码
export async function resetPassword(password, newPassword) {
    let userInfo = await AsyncStorage.getItem('shop_info');
    let url = '/app/user/password';
    let data = {
        form: {
            "newPassword": newPassword,
            "password": password
        },
        user: JSON.parse(userInfo)
    }
    console.log(data);
    return BaseServer.post(url, data);
}
