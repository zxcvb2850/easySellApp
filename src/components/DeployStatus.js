/*
* 物品的状态
* */
import React from "react"
import {StyleSheet, View, Text} from "react-native"
import {headerColor, successColor, warringColor, fontSize14} from "../common/styles";
import {scaleSize,setSpText} from "../common/screenUtil";

/*
* 0 布防
* 1 撤防
* */
const DeployStatus = (props) => (
  <View style={[styles.body, props.style]}>
    <Text
      style={[styles.textFontSize, styles.dot, {color: props.status === '0001' ? successColor : warringColor}]}>●</Text>
    <Text
      style={[styles.textFontSize, {color: props.status === '0001' ? successColor : warringColor}]}>{props.status === '0001' ? '布防' : '撤防'}</Text>
    <Text
      style={[styles.textFontSize, styles.dot, {color: props.status === '0001' ? successColor : warringColor}]}>●</Text>
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

export default DeployStatus
