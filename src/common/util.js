/*
* 公用函数
* */
import {Linking} from "react-native"
import Toast from "react-native-root-toast"
import {dangerColor, successColor, warringColor} from "./styles"

/*封装公共Toast*/
export function showToast(text, type = "info", duration = 2000, position = "bottom") {
  let showDuration = ""//展示时间长短
  if (duration > 1500) {
	showDuration = Toast.durations.LONG
  } else {
	showDuration = Toast.durations.SHORT
  }
  let showPosition = ""//展示位置
  switch (position) {
	case "top":
	  showPosition = Toast.positions.TOP
	  break;
	case "center":
	  showPosition = Toast.positions.CENTER
	  break;
	case "bottom":
	  showPosition = Toast.positions.BOTTOM
	  break;
	default:
	  showPosition = Toast.positions.BOTTOM
  }
  let showType = ""//展示背景颜色
  switch (type) {
	case "info":
	  showType = "#000"
	  break;
	case "success":
	  showType = successColor
	  break;
	case "danger":
	case "error":
	  showType = dangerColor
	  break;
	case "warning":
	  showType = warringColor
	  break;
	default:
	  showType = "#f4f4f4"
  }
  Toast.show(text, {
	backgroundColor: showType,
	duration: showDuration,
	position: showPosition
  })
}

/*返回当前Tab的图片*/
export const tabImages = {
  TabDynamicYes: require("../assets/resource/tabs/dynamic_yes.png"),
  TabDynamicNot: require("../assets/resource/tabs/dynamic_not.png"),
  TabShopYes: require("../assets/resource/tabs/shop_yes.png"),
  TabShopNot: require("../assets/resource/tabs/shop_not.png"),
  TabEvalutYes: require("../assets/resource/tabs/evalut_yes.png"),
  TabEvalutNot: require("../assets/resource/tabs/evalut_not.png"),
  TabMineYes: require("../assets/resource/tabs/mine_yes.png"),
  TabMineNot: require("../assets/resource/tabs/mine_not.png"),
}

/*拨打电话*/
export function dialPhone(phone) {
  return Linking.openURL(`tel:${phone.toString()}`)
}

/*对象转为get传参带&的url*/
export function objChangeUrl(obj) {
  if (typeof obj !== 'object' || Array.isArray(obj)) return;

  let arr = [];
  for (let i in obj) {
	if (obj[i] != null && obj[i] !== '') {
	  arr.push(`${i}=${obj[i]}`)
	}
  }
  return arr.join('&');
}

/*相同的type分类*/
export function classify(arr) {
  let map = {},
	dest = [];
  for (let i = 0; i < arr.length; i++) {
	let ai = arr[i];
	if (!map[ai.projectType]) {
	  dest.push({
		reviewProjectId: ai.reviewProjectId,
		projectType: ai.projectType,
		data: [ai]
	  });
	  map[ai.projectType] = ai;
	} else {
	  for (let j = 0; j < dest.length; j++) {
		let dj = dest[j];
		if (dj.projectType === ai.projectType) {
		  dj.data.push(ai);
		  break;
		}
	  }
	}
  }
  return dest
}
