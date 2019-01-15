/*
* 忘记密码
* */
import React from "react";
import {StyleSheet, View, Text, AsyncStorage} from "react-native";
import {Item, Icon, Input, Button} from "native-base";
import Header from "../../components/Header"
import {scaleSize} from "../../common/screenUtil";
import {successColor, warringColor, whiteColor} from "../../common/styles";
import {showToast} from "../../common/util";
import {resetPassword} from "../../api/HttpSend";
/*mobx*/
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Image, List} from "./MineIndex";

@inject('store')
@observer
export default class ForgetPwd extends React.Component {
  @action//修改密码则直接跳转到登录页面
  setRouter(router) {
    this.props.store.NavInfo.setRoute(router)
  }

  constructor() {
    super()
    this.state = {
      status: false,//控制图标是否展示
      inputStatus: false,//确认密码输入框的状态
      lodPassword: '',//旧密码
      newPassword: '',//新密码
      againPassword: '',//确认密码
    }
  }

  _resetPassword = async () => {
    if (!this.state.lodPassword || !this.state.newPassword || !this.state.againPassword) {
      return showToast('请完整的填写');
    }
    if (this.state.againPassword !== this.state.newPassword) {
      this.setState({
        status: true,
        inputStatus: false,
      })
      showToast('两次密码不一致');
    } else {
      //传递结果
      await resetPassword(this.state.lodPassword, this.state.newPassword)
      showToast('修改成功，你需要重新登录', 'warning');
      this.setRouter(1)
      await AsyncStorage.removeItem('shop_token');
      await AsyncStorage.removeItem('shop_info');
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={"忘记密码"} isBack/>
        <View style={styles.form}>
          <View style={styles.input_line}>
            <Text>请输入旧密码：</Text>
            <Item error={false} style={styles.input_item}>
              <Input onChangeText={val => this.setState({lodPassword: val})}/>
            </Item>
          </View>
          <View style={styles.input_line}>
            <Text>请输入新密码：</Text>
            <Item error={false} style={styles.input_item}>
              <Input onChangeText={val => {
                if (val === this.state.againPassword) {
                  this.setState({inputStatus: true})
                } else {
                  this.setState({inputStatus: false})
                }
                this.setState({newPassword: val})
              }}/>
            </Item>
          </View>
          <View style={styles.input_line}>
            <Text>请确认新密码：</Text>
            <Item error={false} style={styles.input_item}>
              <Input onChangeText={val => {
                if (val === this.state.newPassword) {
                  this.setState({inputStatus: true})
                } else {
                  this.setState({inputStatus: false})
                }
                this.setState({againPassword: val})
              }}/>
              {
                this.state.status ? this.state.inputStatus ?
                  <Icon style={{color: successColor}} name='checkmark-circle'/> :
                  <Icon style={{color: warringColor}} name='close-circle'/> : null
              }
            </Item>
          </View>
        </View>
        <Button block style={styles.confirm_btn} onPress={this._resetPassword}>
          <Text style={{marginHorizontal: scaleSize(20), color: whiteColor}}>确认</Text>
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  form: {
    padding: scaleSize(30),
  },
  input_line: {
    marginVertical: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center'
  },
  input_item: {
    flex: 1,
    height: scaleSize(70)
  },
  confirm_btn: {
    margin: scaleSize(40),
    //alignSelf: 'center',
  }
})
