/*
* 公用函数
* */
import Toast from "react-native-root-toast"

/*封装公共Toast*/
export function showToast(text, type = "info", duration = 2000, position = "bottom") {
    let showDuration = ""//展示时间长短
    if (duration > 2000) {
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
            showType = "#5cb85c"
            break;
        case "danger":
            showType = "#d9534f"
            break;
        case "warning":
            showType = "#f0ad4e"
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