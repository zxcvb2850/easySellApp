/*
* title公共样式
* */
import React from "react";
import {StyleSheet, TouchableOpacity, Text} from "react-native";
import {fontSize18} from "../common/styles";
import {scaleSize} from "../common/screenUtil";
import commStyle from "../common/commStyle";

const ShopTitle = ({title, children, customStyle, textStyle, handleItem}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={[styles.container, commStyle.borderBottom, customStyle]}
    onPress={handleItem}
  >
    <Text style={[styles.color_back, textStyle]}>{title}</Text>
    {children ? children : null}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  color_back: {
    color: '#333333',
    fontSize: fontSize18
  },

  container: {
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(90),
  },
})

export default ShopTitle;
