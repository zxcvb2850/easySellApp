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

	back = () => {
		this.props.navigation.goBack();
	}

	render() {
		const {left, children, right, backgroundColor, statusColor} = this.props;
		return (
			<View style={[this.props.style, styles.container]}>
				<StatusBar backgroundColor={statusColor ? statusColor : headerColor}/>
				{
					this.props.isBack ?
						<TouchableOpacity
							activeOpacity={1}
							onPress={this.back}
							style={[styles.back_btn, {paddingLeft: scaleSize(20), zIndex: 10}]}>
							<Image style={styles.back_btn} source={require("../assets/resource/common/icon_back.png")}/>
						</TouchableOpacity>
						: null
				}
				<View style={[styles.title, {backgroundColor: backgroundColor ? backgroundColor : headerColor}]}>
					<Text style={{color: whiteColor, fontSize: scaleSize(38)}}>{this.props.title}</Text>
				</View>
				{
					left ?
						<View style={styles.left}>
							{left}
						</View>
						: null
				}
				{
					right ?
						<View style={styles.right}>
							{right}
						</View>
						: null
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		justifyContent: 'center',
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
	left: {
		position: 'absolute',
		left: 0,
	},
	right: {
		position: 'absolute',
		right: 0,
	}
})

export default withNavigation(Header)
