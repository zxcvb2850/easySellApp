/*
* 公用webview
* */
import React from "react";
import {View, WebView} from "react-native";
import Header from "./Header";
import {whiteColor} from "../common/styles";

const WebViewCommon = (props) => {
  const {params} = props.navigation.state
  return (
    <View style={{flex: 1, backgroundColor: whiteColor}}>
      <Header title={params.title}/>
      <WebView source={{uri: params.url}}/>
    </View>
  )
}

export default WebViewCommon;
