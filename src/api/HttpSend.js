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
export function getInfo(bool = false) {
  console.log('*********', bool)
  let url = "/app/user/info";
  return BaseServer.get(url, {}, bool)
}

//登出
export function postLogout() {
  let url = "/app/user/logout";
  return BaseServer.post(url)
}

//修改密码
export async function resetPassword(password, newPassword) {
  let url = '/app/user/password';
  let data = {
	"newPassword": newPassword,
	"password": password
  }
  return BaseServer.post(url, data);
}
