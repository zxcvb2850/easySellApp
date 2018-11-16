/*
* 动态
* */
import React from "react"
import {StyleSheet, ImageBackground, View, Text, Image, FlatList, TouchableOpacity} from "react-native"
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import LinearGradient from 'react-native-linear-gradient';
import Header from "../../components/Header"
import {scaleSize} from "../../common/screenUtil";
import {
  backgroundColor,
  headerColor,
  itemHeadColor,
  whiteColor
} from "../../common/styles";

export default class DynamicIndex extends React.Component {
  constructor() {
	super()
	this.state = {
	  data: [{
		id: 1,
	  }, {
		id: 2
	  }, {
		id: 3
	  }, {
		id: 4
	  }, {
		id: 5
	  }, {
		id: 6
	  }, {
		id: 7
	  }],
	}
  }

  _keyExtractor = (item) => item.id + '';

  _listHeaderComponent = () => (
	<LinearGradient colors={[headerColor, itemHeadColor]} style={styles.show_data}>
	  <View style={styles.cols}>
		<AnimatedCircularProgress
		  size={80}
		  width={6}
		  fill={98}
		  rotation={0}
		  tintColor="#FFF"
		  onAnimationComplete={() => console.log('onAnimationComplete')}
		  backgroundColor="rgba(0,0,0,0.1)"
		  children={() => (
			<View>
			  <Text style={styles.gary_color}>可视</Text><Text style={styles.color_white}>98%</Text>
			</View>)}/>
		<View style={styles.desc_title}>
		  <Image style={styles.icon_min} source={require("../../assets/resource/dynamic/icon_video.png")}/>
		  <Text style={styles.gary_color}>视频总数</Text>
		</View>
		<Text style={[styles.color_white, {fontSize: 20}]}>8100</Text>
	  </View>
	  <View style={[styles.cols, styles.borderLeftRight]}>
		<AnimatedCircularProgress
		  size={80}
		  width={6}
		  fill={50}
		  rotation={0}
		  tintColor="#FFF"
		  onAnimationComplete={() => console.log('onAnimationComplete')}
		  backgroundColor="rgba(0,0,0,0.1)"
		  children={() => (
			<View>
			  <Text style={styles.gary_color}>在线</Text><Text style={styles.color_white}>50%</Text>
			</View>)}/>
		<View style={styles.desc_title}>
		  <Image style={styles.icon_min} source={require("../../assets/resource/dynamic/icon_shop.png")}/>
		  <Text style={styles.gary_color}>门店总数</Text>
		</View>
		<Text style={[styles.color_white, {fontSize: 20}]}>8100</Text>
	  </View>
	  <View style={styles.cols}>
		<AnimatedCircularProgress
		  size={80}
		  width={6}
		  fill={95}
		  rotation={0}
		  tintColor="#FFF"
		  onAnimationComplete={() => console.log('onAnimationComplete')}
		  backgroundColor="rgba(0,0,0,0.1)"
		  children={() => (
			<View>
			  <Text style={styles.gary_color}>布防</Text><Text style={styles.color_white}>95%</Text>
			</View>)}/>
		<View style={styles.desc_title}>
		  <Image style={styles.icon_min} source={require("../../assets/resource/dynamic/icon_bufan.png")}/>
		  <Text style={styles.gary_color}>布防总数</Text>
		</View>
		<Text style={[styles.color_white, {fontSize: 20}]}>8100</Text>
	  </View>
	</LinearGradient>
  )

  _renderItem = ({item}) => (
	<TouchableOpacity
	  activeOpacity={0.9}
	  style={styles.list_item}
	  onPress={() => {
		this.props.navigation.navigate('EvalutDetails')
	  }}
	>
	  <View style={styles.item_header}>
		<Text style={styles.item_title}>在线考评</Text>
		<Text style={styles.item_degree}>完成率：50%</Text>
	  </View>
	  <View style={styles.item_body}>
		<View style={styles.body_item}>
		  <Text style={styles.txt}>今日考评</Text>
		  <Text style={styles.txt}>20</Text>
		</View>
		<View style={styles.line}/>
		<View style={styles.body_item}>
		  <Text style={styles.txt}>今日计划</Text>
		  <Text style={styles.txt}>40</Text>
		</View>
		<View style={styles.line}/>
		<View style={[styles.body_item, styles.row]}>
		  <Text style={styles.txt_continue}>继续</Text>
		  <Image style={{width: scaleSize(32), height: scaleSize(32)}}
				 source={require("../../assets/resource/home/icon_continue.png")}/>
		</View>
	  </View>
	</TouchableOpacity>
  )

  render() {
	return (
	  <View style={styles.container}>
		<Header title={"碧桂园-保安部"}/>
		<FlatList
		  style={styles.list}
		  data={this.state.data}
		  extraData={this.state.data}
		  keyExtractor={this._keyExtractor}
		  ListHeaderComponent={this._listHeaderComponent}
		  renderItem={this._renderItem}/>
	  </View>
	)
  }
}

const styles = StyleSheet.create({
  color_white: {
	color: whiteColor,
  },
  gary_color: {
	color: backgroundColor,
  },
  borderLeftRight: {
	borderLeftColor: 'rgba(255,255,255,0.3)',
	borderRightColor: 'rgba(255,255,255,0.3)',
	borderLeftWidth: scaleSize(1),
	borderRightWidth: scaleSize(1),
	borderStyle: 'solid',
  },

  container: {
	flex: 1,
  },
  show_data: {
	flex: 1,
	height: scaleSize(444),
	flexDirection: 'row',
  },
  cols: {
	flex: 1,
	height: scaleSize(444),
	alignItems: 'center',
	justifyContent: 'center',
  },
  desc_title: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	height: scaleSize(70),
  },
  icon_min: {
	marginHorizontal: scaleSize(6),
	width: scaleSize(30),
	height: scaleSize(30),
  },

  list: {
	flex: 1,
  },
  list_item: {
	marginHorizontal: scaleSize(25),
	marginVertical: scaleSize(20),
	borderRadius: scaleSize(16),
	overflow: 'hidden',
  },
  item_header: {
	paddingHorizontal: scaleSize(30),
	flexDirection: 'row',
	alignItems: 'center',
	height: scaleSize(56),
	backgroundColor: itemHeadColor,
  },
  item_body: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	height: scaleSize(160),
	backgroundColor: whiteColor,
  },
  item_title: {
	flex: 1,
	color: whiteColor,
	textAlign: 'left',
  },
  item_degree: {
	flex: 1,
	color: whiteColor,
	textAlign: 'right',
  },
  body_item: {
	flex: 1,
	alignItems: 'center',
	justifyContent: 'center',
	height: scaleSize(120),
  },
  row: {
	flexDirection: 'row'
  },
  line: {
	width: scaleSize(1),
	height: scaleSize(80),
	backgroundColor: 'rgba(113, 113, 113, .3)',
  },
  txt: {
	color: '#000',
  },
  txt_continue: {
	marginRight: scaleSize(20),
  },
})
