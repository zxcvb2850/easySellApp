/**
 * 已完结的项目
 * */
import React from "react";
import {StyleSheet, View, Text, Image} from "react-native"
import {Content} from "native-base"
import Header from "../../../components/Header";
import {getHistoryDetail} from "../../../api/evaluReq"
import {backgroundColor, headerColor, lightGaryColor, whiteColor} from "../../../common/styles"
import Accordion from 'react-native-collapsible/Accordion'
import {classify} from "../../../common/util"
import commonStyle from "../../../common/commStyle"
import {scaleSize} from "../../../common/screenUtil"

export default class EvalutEnd extends React.Component {
  constructor(props) {
	super(props)
	this.state = {
	  storeInfo: {},//店铺详情
	  storeEvalut: [],//店铺考评详情
	  activeSections: [],
	  normal: 0,//正常个数
	  other: 0,//列外个数
	  not: 0,//不合适
	}
	this._getHistoryDetail()
  }

  _getHistoryDetail = async () => {
	let result = await getHistoryDetail(this.props.navigation.state.params.reviewId)
	console.log(result)
	let dest = []
	if (result.storeReview.projectList.length) {
	  dest = classify(result.storeReview.projectList)
	}
	let a = 0, b = 0, c = 0
	result.storeReview.projectList.forEach(item => {
	  if (item.checkResult === 2) {
		a++
	  }
	  if (item.checkResult === 3) {
		b++
	  }
	  if (item.checkResult === 4) {
		c++;
	  }
	})
	this.setState({
	  storeInfo: result.storeReview,
	  storeEvalut: dest,
	  normal: a,
	  other: b,
	  not: c,
	})
	console.log(dest)
  }

  render() {
	let {params} = this.props.navigation.state
	return (
	  <Content style={styles.container}>
		<Header isBack title={"考评详情"}/>
		<View>
		  <Text>店名：{this.state.storeInfo.storeName}</Text>
		  <Text>考评时间：{this.state.storeInfo.updateTime}</Text>
		  <Text>考评人：{this.state.storeInfo.reviewer}</Text>
		  <Text>检查项目：{this.state.storeEvalut.length}</Text>
		  <Text>正常数：{this.state.normal}</Text>
		  <Text>列外数：{this.state.other}</Text>
		  <Text>不适用数：{this.state.not}</Text>
		</View>

		<Accordion
		  style={{backgroundColor: whiteColor}}
		  sections={this.state.storeEvalut}
		  activeSections={this.state.activeSections}
		  renderHeader={this._renderHeader}
		  renderContent={this._renderContent}
		  underlayColor={whiteColor}
		/>
	  </Content>
	)
  }

  _renderHeader = (section, index, isActive, sections) => {
	console.log(section)
	return (
	  <View
		style={[styles.header, commonStyle.borderTopBottom, {
		  backgroundColor: (isActive ? whiteColor : backgroundColor),
		  marginBottom: isActive ? scaleSize(0) : scaleSize(20)
		}]}>
		<Text style={styles.header_text}>{section.projectType}</Text>
		<Image style={[styles.icon_show, {
		  transform: [{rotate: !isActive ? '0deg' : '90deg'}]
		}]} source={require("../../../assets/resource/evalut/icon_show.png")}/>
	  </View>
	);
  }

  _renderContent = (section, index, isActive, sections) => {
	console.log(section)
	return section.data.map((item, i) => (
	  <View>
		<View>
		  <Text>{item.projectCode}</Text>
		  <Text>{item.photos}</Text>
		  <Image></Image>
		</View>
	  </View>
	))
  }
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
  },

  center: {
	flex: 1,
  },
  header: {
	paddingHorizontal: scaleSize(20),
	flexDirection: 'row',
	alignItems: 'center',
	height: scaleSize(86),
  },
  content: {
	paddingHorizontal: scaleSize(20),
  },
  content_item: {
	padding: scaleSize(20),
	flexDirection: 'row',
	borderBottomColor: lightGaryColor,
	borderBottomWidth: scaleSize(1),
	borderStyle: 'solid',
  },
  content_desc: {
	flex: 1,
  },
  submit_wrap: {
	flexDirection: 'row',
	justifyContent: 'flex-end',
  },
  icon_submit: {
	width: scaleSize(48),
	height: scaleSize(48),
  },
  icon_margin: {
	marginTop: scaleSize(10),
	marginLeft: scaleSize(20),
	marginRight: scaleSize(20),
  },
  header_text: {
	flex: 1,
	paddingLeft: scaleSize(12),
	borderLeftColor: headerColor,
	borderLeftWidth: scaleSize(4),
	borderStyle: 'solid',
  },
  icon_show: {
	width: scaleSize(45),
	height: scaleSize(45),
  },
})
