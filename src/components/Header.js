/*
* 封装头部导航
* */

import React from "react"
import {StyleSheet, View, Image, Text, TouchableOpacity, StatusBar} from "react-native"
import {withNavigation} from "react-navigation"
import {scaleSize} from "../common/screenUtil"
import {headerColor, whiteColor} from "../common/styles";

class Header extends React.Component {
  constructor() {
	super()
  }

  componentDidMount() {
	//console.log(this.props);
  }

  back = () => {
	console.log('++++++++++++++++++', this.props.navigation)
	this.props.navigation.goBack();
  }

  render() {
	const {backgroundColor, statusColor} = this.props;
	return (
	  <View style={[this.props.style, styles.container]}>
		<StatusBar backgroundColor={statusColor ? statusColor : headerColor}/>
		{
		  this.props.isBack ?
			<TouchableOpacity
			  activeOpacity={1}
			  onPress={this.back}
			  style={[styles.back_btn, {
				alignItems: 'center',
				justifyContent: 'center',
				paddingLeft: scaleSize(40),
				height: scaleSize(90), zIndex: 10
			  }]}>
			  <Image style={styles.back_btn} source={require("../assets/resource/common/icon_back.png")}/>
			</TouchableOpacity>
			: null
		}
		<View style={[styles.title, {backgroundColor: backgroundColor ? backgroundColor : headerColor}]}>
		  <Text style={{color: whiteColor, fontSize: scaleSize(38)}}>{this.props.title}</Text>
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
	justifyContent: 'center'
  },
  back_btn: {
	width: scaleSize(48),
	height: scaleSize(48),
  },
})

export default withNavigation(Header)
