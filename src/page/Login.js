import React from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  AsyncStorage
} from "react-native";
import {Container, Item, Input, Form, Thumbnail, Button, Label} from 'native-base';
import {scaleSize} from "../common/screenUtil";
import {mainColor, fontSize18, fontSize20, whiteColor} from "../common/styles";
import {showToast} from "../common/util";
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {login, getInfo} from "../api/HttpSend";
import Modal from "react-native-modal";

@inject('store')
@observer
export default class Login extends React.Component {
  @action
  setRouter(bool = false) {
    this.props.store.NavInfo.setRoute(bool);
  }

  @action
  setUserInfo(info) {
    this.props.store.UserInfo.setUserInfo(info);
  }

  @action
  setStatusBar(color) {
    this.props.store.StatusBarColor.setStatusBarColor(color)
  }

  componentDidMount() {
    this.setRouter();
    this.setStatusBar("#000")
  }

  constructor() {
    super()
    this.state = {
      name: '',
      pwd: '',
      isOpenSys: false,
    }
  }

  postLogin = async () => {
    if (!this.state.name.length) {
      showToast("请输入用户名");
      return;
    }
    if (!this.state.pwd.length) {
      showToast("请输入密码");
      return
    }
    let result = await login(this.state.name, this.state.pwd);
    showToast('登录成功', 'success');
    await AsyncStorage.setItem('shop_token', result.token);
    let res = await getInfo()
    this.setRouter(true);
    this.setUserInfo(res.user);
    this.setState({name: '', pwd: ''})
    this.props.navigation.navigate('TabDynamic')
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'#000'} hidden={false}/>
        <View style={styles.content}>
          <View style={{alignItems: "center"}}>
            <Image style={{width: scaleSize(236), height: scaleSize(236)}}
                   source={require('../assets/resource/login/logo.png')}/>
            <Text style={{
              color: mainColor,
              fontSize: fontSize20,
              lineHeight: fontSize18 + 10
            }}>智慧管理系统</Text>
          </View>
          <Form style={{marginTop: scaleSize(20)}}>
            <Item>
              <Thumbnail square style={{width: scaleSize(40), height: scaleSize(42)}}
                         source={require('../assets/resource/login/account_icon.png')}/>
              <Input autoCapitalize={'none'} placeholder='请输入用户名'
                     onChangeText={text => this.setState({name: text.replace(/\s/g, "")})}
                     value={this.state.name}/>
            </Item>

            <Item>
              <Thumbnail square
                         style={{width: scaleSize(40), height: scaleSize(42)}}
                         source={require('../assets/resource/login/passwd_icon.png')}/>
              <Input secureTextEntry placeholder='请输入密码'
                     onChangeText={text => this.setState({pwd: text.replace(/\s/g, "")})}
                     value={this.state.pwd}/>
            </Item>
          </Form>
          <Button primary style={styles.login_btn} onPress={this.postLogin}>
            <Text style={{fontSize: fontSize18, color: whiteColor}}>登录</Text>
          </Button>
        </View>
        <Image style={styles.footer_img} source={require("../assets/resource/login/login_footer_bg.png")}/>
        <Text
          onPress={() => {
            console.log(111)
            this.setState({isOpenSys: true})
          }}
          style={styles.sys_text}>服务器设置</Text>
        <Modal
          isVisible={this.state.isOpenSys}
          onSwipe={() => {
            this.setState({isOpenSys: false})
          }}
          onBackdropPress={() => {
            this.setState({isOpenSys: false})
          }}
          style={styles.modal}
        >
          <View style={{width: scaleSize(600), backgroundColor: '#DDD'}}>
            <View style={styles.sys_input_item}>
              <Text>服务器地址:</Text>
              <Input style={styles.sys_input}/>
            </View>
            <View style={styles.sys_input_item}>
              <Text style={styles.sys_input}>服务器端口:</Text>
              <Input/>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Button style={styles.sys_btn}><Text>取消</Text></Button>
              <Button style={styles.sys_btn}><Text>确认</Text></Button>
            </View>
          </View>
        </Modal>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: scaleSize(200)
  },
  content: {
    width: scaleSize(600),
  },
  login_btn: {
    marginTop: scaleSize(150),
    justifyContent: 'center',
    width: scaleSize(600),
  },
  footer_img: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    height: scaleSize(279),
  },
  sys_text: {
    paddingVertical: scaleSize(20),
    paddingHorizontal: scaleSize(30),
    position: 'absolute',
    bottom: 0,
    right: 0,
    textDecorationLine: 'underline',
    color: '#000',
  },

  modal: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: "center",
    margin: 0
  },
  sys_input_item: {
    paddingHorizontal: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(100),
  },
  sys_input: {
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: scaleSize(1),
    borderStyle: 'solid',
  },
  sys_btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
