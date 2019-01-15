/*
* 物品的状态
* */
import React from "react"
import {StyleSheet, View, Text} from "react-native"
import {successColor, warringColor, fontSize14} from "../common/styles";
import {scaleSize,setSpText} from "../common/screenUtil";

/*
* 0 在线
* 1 离线
* */
const StoreStatus = (props) => (
  <View style={[styles.body, props.style]}>
    <Text style={[styles.textFontSize, styles.dot, {color: props.status === 0 ? successColor : warringColor}]}>●</Text>
    <Text
      style={[styles.textFontSize, {color: props.status === 0 ? successColor : warringColor}]}>{props.status === 0 ? '在线' : '离线'}</Text>
    <Text style={[styles.textFontSize, styles.dot, {color: props.status === 0 ? successColor : warringColor}]}>●</Text>
  </View>
)

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
  },
  dot: {
    marginHorizontal: scaleSize(10),
    color: '#7f9bdb',
  },
  textFontSize: {
    fontSize: fontSize14
  }
})

export default StoreStatus
