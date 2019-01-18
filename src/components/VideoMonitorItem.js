/**
 * 每一个视频监控样式
 * */
import React from "react";
import {StyleSheet, TouchableOpacity, View, Text, Image} from "react-native";
import {scaleSize} from "../common/screenUtil";

const VideoMonitorItem = ({status, title, customStyles, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={[styles.container, customStyles, {borderColor: status ? 'rgba(0,0,0,.1)' : '#e1e1e1'}]}
    onPress={onPress}>
    <View style={styles.video_icon_wrap}>
      {
        status ?
          <Image style={styles.video_icon}
                 source={require("../assets/resource/shop/icon_video_offine.png")}/>
          :
          <Image style={styles.video_icon}
                 source={require("../assets/resource/shop/icon_video_online.png")}/>
      }
    </View>
    <Text
      numberOfLines={1}
      style={[styles.video_icon_text, {color: status ? '#cbcbcb' : '#666'}]}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    marginBottom: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(298),
    height: scaleSize(70),
    borderStyle: 'solid',
    borderWidth: scaleSize(2),
    borderRadius: scaleSize(6),
  },
  video_icon_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: scaleSize(130),
  },
  video_icon: {
    marginRight: scaleSize(25),
    width: scaleSize(43),
    height: scaleSize(43)
  },
  video_icon_text: {
    paddingRight: scaleSize(30),
    flex: 1,
    textAlign: 'center',
  }
})

export default VideoMonitorItem;
