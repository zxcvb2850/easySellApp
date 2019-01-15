/*
* 封装头部导航
* */

import React from "react"
import {StyleSheet, View, Image, Text, TouchableOpacity, StatusBar} from "react-native"
import {withNavigation} from "react-navigation"
import {scaleSize} from "../common/screenUtil"
import {fontSize20, headerColor, whiteColor} from "../common/styles";

/*mobx*/
import {observer, inject} from 'mobx-react'
import {action, computed} from 'mobx'
import commStyle from "../common/commStyle";

@inject('store')
@observer
class Header extends React.Component {
  @action
  setStatusBar(color) {
    this.props.store.StatusBarColor.setStatusBarColor(color)
  }

  @action
  setPhotoPath() {
    this.props.store.PhotoPath.setPhotoPath(null);
  }

  @computed get getStatusBar() {
    return this.props.store.StatusBarColor.statusBarColor
  }

  back = () => {
    this.setPhotoPath();
    this.props.navigation.goBack();
  }

  render() {
    const {backgroundColor, statusColor, hidden} = this.props;
    let color = statusColor ? statusColor : headerColor;
    this.setStatusBar(color);

    return (
      <View style={[this.props.style, styles.container, commStyle.borderBottom]}>
        <StatusBar backgroundColor={this.getStatusBar} hidden={hidden ? true : false}/>
        {
          this.props.isBack ?
            <TouchableOpacity
              activeOpacity={1}
              onPress={typeof this.props.isBack === 'function' ? this.props.isBack : this.back}
              style={[styles.back_btn, {
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: scaleSize(40),
                height: scaleSize(90), zIndex: 10
              }]}>
              <Image style={styles.back_btn} source={require("../assets/resource/common/icon_back.png")}/>
            </TouchableOpacity>
            : null
        }
        <View
          style={[styles.title, commStyle.borderBottomRgba, {backgroundColor: backgroundColor ? backgroundColor : headerColor}]}>
          <Text style={{color: whiteColor, fontSize: fontSize20}}>{this.props.title}</Text>
        </View>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: scaleSize(90),
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: scaleSize(90),
    alignItems: 'center',
    justifyContent: 'center',
  },
  back_btn: {
    width: scaleSize(48),
    height: scaleSize(48),
  },
})

export default withNavigation(Header)
