/*
* 公用样式函数
* */
import {StyleSheet} from "react-native"
import {scaleSize} from "./screenUtil";
import {lightGaryColor} from "./styles";

export default StyleSheet.create({
    borderTopBottom: {
        borderTopColor: lightGaryColor,
        borderBottomColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderBottomWidth: scaleSize(1),
        borderStyle: 'solid',
    }
})