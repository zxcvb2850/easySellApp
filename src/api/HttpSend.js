/**
 * 发送请求
 * */
import BaseServer from "./BaseServer"

export default {
  login(name, pwd) {
	let url = "";
	let formData = new FormData()
	formData.append("name", name)
	formData.append("password", pwd)
	return BaseServer.post(url, formData, false,)
  },
}
