import React from "react";
import {StyleSheet, Text} from "react-native";
import {checkResult} from "../common/util";
import {scaleSize} from "../common/screenUtil";
import {fontSize16} from "../common/styles";

const EvalutStatus = (props) => (
  <Text
    style={[styles.status_color, {
      color: checkResult(props.checkResult).color,
      borderColor: checkResult(props.checkResult).color,
    }]}
  >{checkResult(props.checkResult).str}</Text>
)

const styles = StyleSheet.create({
  status_color: {
    paddingVertical: scaleSize(6),
    width: scaleSize(120),
    borderStyle: 'solid',
    borderWidth: scaleSize(2),
    borderRadius: scaleSize(6),
    fontSize: fontSize16,
    textAlign: 'center'
  }
})

export default EvalutStatus
