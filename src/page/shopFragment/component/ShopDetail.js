/*
*  店铺详情
* */
import React from "react"
import {StyleSheet, View, Text, Image} from "react-native"
import Header from "../../../components/Header"

export default class ShopDetail extends React.Component {
  constructor() {
	super()
	this.state = {
	  shopId: 0,
	}
  }

  componentDidMount() {
	console.log(this.props.navigation.state.params)
  }

  render() {
	const {params} = this.props.navigation.state;
	return (
	  <View>
		<Header isBack title={`店铺${params.shopName}详情`}/>
		<Text>店铺详情</Text>
	  </View>
	)
  }
}
