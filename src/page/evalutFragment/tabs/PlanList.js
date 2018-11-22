/**
 * 计划考评
 * */
import React from "react";
import {StyleSheet, View, Text, Image, FlatList, RefreshControl} from "react-native";
import {ListItem, Left, Icon, Body, Right, Thumbnail} from "native-base";
import {whiteColor} from "../../../common/styles";
import {getPlanList} from "../../../api/evaluReq";
import {scaleSize} from "../../../common/screenUtil"

export default class PlanList extends React.Component {
  componentDidMount() {
	console.log('-----------', this.props)
  }

  constructor(props) {
	super(props)
	this.state = {
	  list: [],
	  filter: props.filter,//过滤的条件
	  page: 1,//当前页码
	  refreshing: false,//是否在加载数据
	  isStatus: true,
	  isLoreTextStatus: true,
	  isLoreText: '正在加载中...',//上拉加载提示文字
	}
	this._getPlanList();
  }

  componentWillReceiveProps(nextProps) {
	if (nextProps.filter !== this.props.filter) {
	  if (nextProps.index === 0) {
		this.setState({filter: nextProps.filter})
		this._getPlanList()
	  }
	}
  }

  Refresh = () => {
	this.setState({
	  page: 1,
	  refreshing: true,
	  isLoreText: '正在加载...'
	});
	this._getPlanList(1, true)
  }

  _getPlanList = async (page = 1, isRefresh = false) => {
	/*此处请求有点小问题*/
	let result = await getPlanList(page, this.state.filter.sidx, this.state.filter.order, this.state.filter.storeCode, this.state.filter.storeName);
	if (page === 1) {
	  if (result.page.list.length) {
		this.setState({list: result.page.list});
	  } else {
		this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
	  }
	} else if (result.page.list.length) {
	  this.setState({list: this.state.list.concat(result.page.list)})
	} else {
	  this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
	}
	this.setState({isStatus: false, isLoreTextStatus: false})
	if (isRefresh) {
	  this.setState({refreshing: false})
	}
  }

  getMoreList = () => {
	//if (!this.state.isStatus && this.state.isLoreTextStatus) {
	this.setState({isStatus: true, page: this.state.page + 1})
	this._getPlanList(this.state.page + 1)
	//}
  }

  render() {
	return (
	  <View>
		<FlatList
		  data={this.state.list}
		  keyExtractor={this._keyExtractor}
		  renderItem={this._renderItem}
		  onEndReachedThreshold={0.1}//执行上啦的时候10%执行
		  onEndReached={this.getMoreList}//获取更多数据
		  ListFooterComponent={this._renderFooter}//尾部
		  refreshControl={
			<RefreshControl
			  refreshing={this.state.refreshing}
			  onRefresh={this.Refresh}
			  title="刷新中..."/>
		  }
		/>
	  </View>
	)
  }

  _keyExtractor = (item) => item.reviewId + '';

  _renderItem = ({item}) => (
	<ListItem avatar style={{backgroundColor: whiteColor}}
			  key={item.reviewId}
			  onPress={() => {
				console.log(item);
				this.props.navigate('EvalutDetails', {reviewId: item.reviewId})
			  }}
	>
	  <Left>
		<Thumbnail square
				   style={{width: scaleSize(48), height: scaleSize(48)}}
				   source={require("../../../assets/resource/evalut/icon_shop.png")}/>
	  </Left>
	  <Body>
	  <Text>{item.storeName}</Text>
	  </Body>
	  <Right>
		<Icon name="arrow-forward"/>
	  </Right>
	</ListItem>
  )

  _renderFooter = () => {
	return (
	  <View style={{
		height: 44,
		justifyContent: 'center',
		alignItems: 'center'
	  }}>
		<Text>{this.state.isLoreText}</Text>
	  </View>
	)
  }
}
