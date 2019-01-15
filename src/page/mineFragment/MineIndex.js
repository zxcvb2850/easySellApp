/*
* 我的首页
* */

import React from "react"
import {StyleSheet, View, Text, Image, ImageBackground, AsyncStorage} from "react-native"
import {List, ListItem, Left, Body, Right, Button} from "native-base"
import Header from "../../components/Header"
import {scaleSize} from "../../common/screenUtil"
import {garyColor, mainColor, fontSize20, whiteColor, headerColor} from "../../common/styles"
import {postLogout} from "../../api/HttpSend";
import {showToast} from "../../common/util";

/*mobx*/
import {observer, inject} from 'mobx-react'
import {action, computed} from 'mobx'

@inject('store')
@observer
export default class MineIndex extends React.Component {
  @action
  setRouter() {
    this.props.store.NavInfo.setRoute(true);
  }

  /*获取个人信息*/
  @computed get userInfo() {
    return this.props.store.UserInfo.userInfo;
  }

  /*退出登陆*/
  logout = async () => {
    await postLogout();
    this.setRouter();
    await AsyncStorage.removeItem('shop_token')
    await AsyncStorage.removeItem('shop_info')
    this.props.navigation.navigate("Login");
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={"我的"}/>
        <ImageBackground
          source={require("../../assets/resource/mine/mine_bg.png")}
          style={styles.header_bg}>
          <View style={[styles.avatar_border]}>
            <Image style={styles.avatar}
                   source={require("../../assets/resource/common/avatar.png")}/>
          </View>
        </ImageBackground>
        <List style={{marginTop: scaleSize(20)}}>
          <ListItem>
            <Left>
              <Text style={{color: garyColor}}>昵称</Text>
            </Left>
            <Body>
            <Text style={{color: "#000", fontSize: fontSize20}}>{this.userInfo.fullname}</Text>
            </Body>
          </ListItem>
          <ListItem onPress={() => this.props.navigation.navigate('ForgetPwd')}>
            <Left>
              <Text style={{color: garyColor}}>修改密码</Text>
            </Left>
            <Right>
              <Image style={{width: scaleSize(48), height: scaleSize(48)}}
                     source={require("../../assets/resource/common/icon_back_black.png")}/>
            </Right>
          </ListItem>
        </List>
        <Button block style={styles.logout_btn} onPress={this.logout}>
          <Image style={{width: scaleSize(36), height: scaleSize(36)}}
                 source={require("../../assets/resource/mine/icon_logout.png")}/>
          <Text style={{marginHorizontal: scaleSize(20), color: whiteColor}}>注销登录</Text>
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: whiteColor,
  },
  header_bg: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: scaleSize(750),
    height: scaleSize(470),
  },
  avatar: {
    width: scaleSize(245),
    height: scaleSize(245),
  },
  avatar_border: {
    borderStyle: 'solid',
    borderWidth: scaleSize(4),
    borderColor: mainColor,
    borderRadius: scaleSize(245),
  },
  logout_btn: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    margin: scaleSize(40),
    borderRadius: scaleSize(10),
    backgroundColor: '#F30000',
  },
})
