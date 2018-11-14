/*
*  店铺详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, Linking, TouchableOpacity} from "react-native"
import {List, ListItem} from "native-base"
import Header from "../../../components/Header"
import {scaleSize} from "../../../common/screenUtil"
import {garyColor, lightGaryColor} from "../../../common/styles"
import {dialPhone} from "../../../common/util"

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
		<View style={styles.list}>
		  <View style={[styles.list_item, styles.first]}>
			<Text>基本信息</Text>
		  </View>
		  <View style={[styles.list_item]}>
			<Image style={styles.icon} source={require("../../../assets/resource/shop/icon_addr.png")}/>
			<View style={styles.txt_wrap}>
			  <Text style={styles.item_txt}>地址：</Text>
			  <Text style={[styles.item_txt, {color: garyColor}]}>深证市深蓝大道321</Text>
			</View>
			<TouchableOpacity
			  activeOpacity={0.9}
			  style={styles.goto_icon}
			  onPress={() => console.log("打开地图")}
			>
			  <Image style={styles.goto_icon} source={require("../../../assets/resource/shop/icon_map.png")}/>
			</TouchableOpacity>
		  </View>
		  <View style={[styles.list_item]}>
			<Image style={styles.icon} source={require("../../../assets/resource/shop/icon_phone_min.png")}/>
			<View style={styles.txt_wrap}>
			  <Text style={styles.item_txt}>电话：</Text>
			  <Text style={[styles.item_txt, {color: garyColor}]}
					onPress={() => dialPhone('020-63212341')}>020-63212341</Text>
			</View>
		  </View>
		  <View style={[styles.list_item]}>
			<Image style={styles.icon} source={require("../../../assets/resource/shop/icon_leader.png")}/>
			<View style={styles.txt_wrap}>
			  <Text style={styles.item_txt}>店长：</Text>
			  <Text style={[styles.item_txt, {color: garyColor}]}
					onPress={() => dialPhone(13212345678)}>张麻子-13212345678</Text>
			</View>
		  </View>
		  <View style={[styles.list_item]}>
			<Image style={styles.icon} source={require("../../../assets/resource/shop/icon_number.png")}/>
			<View style={styles.txt_wrap}>
			  <Text style={styles.item_txt}>店员：</Text>
			  <Text style={[styles.item_txt, {color: garyColor}]}
					onPress={() => dialPhone(13212345678)}>张麻子-13212345678</Text>
			</View>
		  </View>
		  <View style={[styles.list_item]}>
			<View style={[styles.txt_wrap, styles.one]}>
			  <Text style={[styles.item_txt, {color: garyColor}]}
					onPress={() => dialPhone(13212345678)}>张麻子-13212345678</Text>
			</View>
		  </View>
		</View>
		<Text>店铺详情</Text>
	  </View>
	)
  }
}

const styles = StyleSheet.create({
  container: {},
  list: {},
  list_item: {
	marginHorizontal: scaleSize(50),
	flexDirection: 'row',
	alignItems: 'center',
	height: scaleSize(80),
	borderBottomColor: lightGaryColor,
	borderBottomWidth: scaleSize(1),
	borderStyle: 'solid',
  },
  first: {
	marginHorizontal: 0,
	paddingHorizontal: scaleSize(30),
  },
  icon: {
	marginHorizontal: scaleSize(8),
	width: scaleSize(32),
	height: scaleSize(32)
  },
  txt_wrap: {
	flex: 1,
	flexDirection: 'row',
  },
  one: {
	marginLeft: scaleSize(120)
  },
  item_txt: {},
  goto_icon: {
	width: scaleSize(48),
	height: scaleSize(48)
  }
})
