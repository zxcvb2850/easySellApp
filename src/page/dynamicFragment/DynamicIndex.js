/*
* 动态
* */
import React from "react"
import {
  StyleSheet,
  ImageBackground,
  RefreshControl,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  AsyncStorage
} from "react-native"
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import LinearGradient from 'react-native-linear-gradient';
import Header from "../../components/Header"
import {scaleSize} from "../../common/screenUtil";
import {
  backgroundColor, garyColor,
  headerColor,
  itemHeadColor, warringColor,
  whiteColor
} from "../../common/styles";
import {storeStat} from "../../api/storeReq";
import {exceptionList, reviewPlanStat, reviewRecordStat} from "../../api/evaluReq";

export default class DynamicIndex extends React.Component {
  componentDidMount() {
  }

  constructor() {
	super()
	this.state = {
	  data: [],
	  arming: {
		rate: 0,
		total: 0
	  },//布防总数
	  store: {
		rate: 0,
		total: 0
	  },//门店总数
	  video: {
		rate: 0,
		total: 0,
	  },//视频总数
	  reviewRecord: {},//考评报表
	  reviewPlan: {},//在线考评
	  page: 1,//当前页码
	  refreshing: false,//是否在加载数据
	  isStatus: true,
	  isLoreTextStatus: true,
	  isLoreText: '正在加载中...',//上拉加载提示文字
	}
	this._storeStat();
	this._reviewRecordStat()
	this._reviewPlanStat()
  }

  _storeStat = async () => {
	let result = await storeStat()
	this.setState({arming: result.arming, store: result.store, video: result.video, refreshing: false})
  }

  _reviewRecordStat = async (page = 1, isRefresh = false) => {
	let result = await reviewRecordStat(page);
	console.log('--------------', result);
	this.setState({reviewRecord: result})
  }

  _reviewPlanStat = async () => {
	let result = await reviewPlanStat()
	this.setState({reviewPlan: result.reviewPlan})
  }

  //下拉刷新
  Refresh = () => {
	this.setState({
	  page: 1,
	  refreshing: true,
	  isLoreText: '正在加载...'
	});
	this._storeStat();
	this._reviewRecordStat();
  }

  render() {
	return (
	  <View style={styles.container}>
		<Header title={"碧桂园-保安部"}/>
		<FlatList
		  style={styles.list}
		  data={this.state.data}
		  extraData={this.state}
		  keyExtractor={this._keyExtractor}
		  ListHeaderComponent={this._listHeaderComponent}
		  renderItem={this._renderItem}
		  refreshControl={
			<RefreshControl
			  refreshing={this.state.refreshing}
			  onRefresh={this.Refresh}
			  title="刷新中..."/>}
		/>
	  </View>
	)
  }

  _keyExtractor = (item) => item.id + '';

  _listHeaderComponent = () => (
	<View>
	  <LinearGradient colors={[headerColor, itemHeadColor]} style={styles.show_data}>
		<View style={styles.cols}>
		  <AnimatedCircularProgress
			size={80}
			width={6}
			fill={this.state.video.rate * 100}
			rotation={0}
			tintColor="#FFF"
			onAnimationComplete={() => console.log('onAnimationComplete')}
			backgroundColor="rgba(0,0,0,0.1)"
			children={() => (
			  <View>
				<Text style={styles.gary_color}>可视</Text><Text
				style={styles.color_white}>{this.state.video.rate * 100}%</Text>
			  </View>)}/>
		  <View style={styles.desc_title}>
			<Image style={styles.icon_min}
				   source={require("../../assets/resource/dynamic/icon_video.png")}/>
			<Text style={styles.gary_color}>视频总数</Text>
		  </View>
		  <Text onPress={() => {
			this.setState({text: 50})
		  }} style={[styles.color_white, {fontSize: 20}]}>{this.state.video.total}</Text>
		</View>
		<View style={[styles.cols, styles.borderLeftRight]}>
		  <AnimatedCircularProgress
			size={80}
			width={6}
			fill={this.state.store.rate * 100}
			rotation={0}
			tintColor="#FFF"
			onAnimationComplete={() => console.log('onAnimationComplete')}
			backgroundColor="rgba(0,0,0,0.1)"
			children={() => (
			  <View>
				<Text style={styles.gary_color}>在线</Text><Text
				style={styles.color_white}>{this.state.store.rate * 100}%</Text>
			  </View>)}/>
		  <View style={styles.desc_title}>
			<Image style={styles.icon_min} source={require("../../assets/resource/dynamic/icon_shop.png")}/>
			<Text style={styles.gary_color}>门店总数</Text>
		  </View>
		  <Text style={[styles.color_white, {fontSize: 20}]}>{this.state.store.total}</Text>
		</View>
		<View style={styles.cols}>
		  <AnimatedCircularProgress
			size={80}
			width={6}
			fill={this.state.arming.rate * 100}
			rotation={0}
			tintColor="#FFF"
			onAnimationComplete={() => console.log('onAnimationComplete')}
			backgroundColor="rgba(0,0,0,0.1)"
			children={() => (
			  <View>
				<Text style={styles.gary_color}>布防</Text><Text
				style={styles.color_white}>{this.state.arming.rate * 100}%</Text>
			  </View>)}/>
		  <View style={styles.desc_title}>
			<Image style={styles.icon_min}
				   source={require("../../assets/resource/dynamic/icon_bufan.png")}/>
			<Text style={styles.gary_color}>布防总数</Text>
		  </View>
		  <Text style={[styles.color_white, {fontSize: 20}]}>{this.state.arming.total}</Text>
		</View>
	  </LinearGradient>
	  <TouchableOpacity
		activeOpacity={0.9}
		style={styles.list_item}
		onPress={() => {
		  //this.props.navigation.navigate('EvalutDetails')
		}}
	  >
		<View style={styles.item_header}>
		  <Text style={styles.item_title}>在线考评</Text>
		  <Text style={styles.item_degree}>完成率：{this.state.reviewPlan.rate}%</Text>
		</View>
		<View style={styles.item_body}>
		  <View style={styles.body_item}>
			<Text style={styles.txt}>今日考评</Text>
			<Text style={styles.txt}>{this.state.reviewPlan.today}</Text>
		  </View>
		  <View style={styles.line}/>
		  <View style={styles.body_item}>
			<Text style={styles.txt}>计划考评</Text>
			<Text style={styles.txt}>{this.state.reviewPlan.plan}</Text>
		  </View>
		  <View style={styles.line}/>
		  <View style={[styles.body_item, styles.row]}>
			<Text style={styles.txt_continue}>继续</Text>
			<Image style={{width: scaleSize(32), height: scaleSize(32)}}
				   source={require("../../assets/resource/home/icon_continue.png")}/>
		  </View>
		</View>
	  </TouchableOpacity>
	  <TouchableOpacity
		activeOpacity={0.9}
		style={styles.list_item}
		onPress={() => {
		  //this.props.navigation.navigate('EvalutDetails')
		}}
	  >
		<View style={[styles.item_header, {backgroundColor: warringColor}]}>
		  <Text style={styles.item_title}>考评报表</Text>
		  <Text style={styles.item_degree}>完成总数：{this.state.reviewRecord.recordTotal}</Text>
		</View>
		{
		  this.state.reviewRecord.reviewRecord ?
			<View style={styles.item_body}>
			  <View style={styles.body_item}>
				<Text style={styles.txt}>优>>{this.state.reviewRecord.reviewRecord.excellent.rule}</Text>
				<Text style={styles.txt}>{this.state.reviewRecord.reviewRecord.excellent.total}</Text>
			  </View>
			  <View style={styles.line}/>
			  <View style={[styles.body_item]}>
				<Text style={styles.txt}>良>>{this.state.reviewRecord.reviewRecord.good.rule}</Text>
				<Text style={styles.txt}>{this.state.reviewRecord.reviewRecord.good.total}</Text>
			  </View>
			  <View style={styles.line}/>
			  <View style={[styles.body_item]}>
				<Text style={styles.txt}>中>>{this.state.reviewRecord.reviewRecord.medium.rule}</Text>
				<Text style={styles.txt}>{this.state.reviewRecord.reviewRecord.medium.total}</Text>
			  </View>
			  <View style={styles.line}/>
			  <View style={styles.body_item}>
				<Text style={styles.txt}>差>>{this.state.reviewRecord.reviewRecord.bad.rule}</Text>
				<Text style={styles.txt}>{this.state.reviewRecord.reviewRecord.bad.total}</Text>
			  </View>
			</View>
			: null
		}
	  </TouchableOpacity>
	</View>
  )

  _renderItem = ({item}) => (
	<View>
	  <Text>1</Text>
	</View>
  )
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
