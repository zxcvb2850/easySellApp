/**
 * 引导页
 * */
import React from "react"
import {StyleSheet, StatusBar, View, Text, Image, ImageBackground, AsyncStorage} from "react-native"
import SplashScreen from "react-native-splash-screen";
import {DEVICE_WIDTH, scaleSize} from "../common/screenUtil";
import {getInfo} from "../api/HttpSend";
import {showToast} from "../common/util"

/*mobx*/
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {fontSize20, whiteColor} from "../common/styles";

@inject('store')
@observer
export default class BootPage extends React.Component {
  @action
  setUserInfo(info) {
    this.props.store.UserInfo.setUserInfo(info);
  }

  @action
  setStatusBar(color) {
    this.props.store.StatusBarColor.setStatusBarColor(color)
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
    this.downCount && clearInterval(this.downCount)
  }

  componentDidMount() {
    SplashScreen.hide();
    //AsyncStorage.removeItem('shop_token')
    this.setStatusBar('#ebf6fc')
    this.downCount = setTimeout(() => {
      this.down();
    }, 1000)
  }

  constructor(props) {
    super(props)
    this.state = {
      downTimer: 2,
    }
  }

  down = async () => {
    if (this.state.downTimer > 0) {
      this.timer = setTimeout(() => {
        this.setState({downTimer: this.state.downTimer - 1})
        this.down();
      }, 1000)
    } else {
      const token = await AsyncStorage.getItem('shop_token');
      console.log('-----token----', token)
      SplashScreen.hide();
      if (token !== null) {
        let result = await getInfo(true)
        if (result.code === 401) {
          showToast('登录过期，请重新登陆', 'warning')
          this.props.navigation.navigate('Login');
        } else {
          this.setUserInfo(result.user);
          this.props.navigation.navigate('TabFragment');
        }
      } else {
        this.props.navigation.navigate('Login');
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>
        <Image
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: DEVICE_WIDTH,
            height: scaleSize(1056),
          }}
          source={require("../assets/resource/start_up_bg.png")}/>
        <Image
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: DEVICE_WIDTH,
            height: scaleSize(278),
          }}
          source={require("../assets/resource/start_up_foot_bg.png")}
        />
        <View style={styles.down_box}>
          <Text style={styles.downTimer}>{this.state.downTimer}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebf6fc'
  },
  down_box: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: scaleSize(20),
    top: scaleSize(20),
    width: scaleSize(100),
    height: scaleSize(100),
    backgroundColor: 'orange',
    borderRadius: scaleSize(100),
  },
  downTimer: {
    fontSize: fontSize20,
    color: whiteColor
  }
});
