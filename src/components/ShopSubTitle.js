/**
 * 副标题
 * */
import React from "react";
import {StyleSheet, View, Text} from "react-native";
import {scaleSize} from "../common/screenUtil";
import {fontSize18} from "../common/styles";

const ShopSubTitle = ({title, children, customStyles}) => (
  <View style={[styles.container, customStyles]}>
    <View style={styles.line}/>
    <Text style={styles.head_title}>{title}</Text>
    {children ? children : null}
  </View>
)

const styles = StyleSheet.create({
  container: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(88),
  },
  line: {
    marginHorizontal: scaleSize(8),
    width: scaleSize(4),
    height: scaleSize(26),
    backgroundColor: '#3898f1',
  },
  head_title: {
    flex: 1,
    fontSize: fontSize18,
    color: '#333333',
  }
})

export default ShopSubTitle;
