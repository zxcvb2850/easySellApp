/**
 * 例外考评记录
 * */
import React from "react"
import {StyleSheet, View, Text, FlatList, RefreshControl, TouchableOpacity} from "react-native"
import {scaleSize} from "../../../common/screenUtil";
import {lightGaryColor, mainColor, fontSize15, fontSize16, fontSize17} from "../../../common/styles"
import {getExceptionList} from "../../../api/evaluReq";
import commStyle from "../../../common/commStyle";
import ShopSubTitle from "../../../components/ShopSubTitle";

export default class Feedback extends React.Component {
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
    this._exceptionList()
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.filter !== this.props.filter) {
      if (nextProps.index === 1) {
        await this.setState({filter: nextProps.filter});
        this._exceptionList();
      }
    }
    if (nextProps.index === 1) {
      this._exceptionList();
    }
  }

  _exceptionList = async (page = 1, isRefresh = false) => {
    let result = await getExceptionList(page);
    console.log(result);
    if (page === 1) {
      if (result.page.list.length) {
        this.setState({list: result.page.list});
      } else {
        this.setState({list: [], isLoreText: '没有更多数据了...', isLoreTextStatus: false})
      }
    } else if (result.page.list.length) {
      this.setState({list: this.state.list.concat(result.page.list)})
    } else {
      this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
    }
    this.setState({isStatus: false, isLoreTextStatus: false})
    if (isRefresh) {
      this.setState({refreshing: false})
      this.getMoreList();
    }
  }
  //上拉加载更多
  getMoreList = () => {
    if (!this.state.isStatus) {
      this.setState({isStatus: true, page: this.state.page + 1})
      this._exceptionList(this.state.page + 1)
    }
  }
  //下拉刷新
  Refresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      isLoreText: '正在加载...'
    });
    this._exceptionList(1, true)
  }

  gotoFeedDetail = (item, v) => {
    this.props.navigate('FeedbackDetail', {
      storeName: item.storeName,
      reviewProjectId: v.reviewProjectId,
      callback: () => {
        this._exceptionList()
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
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
              title="刷新中..."/>}
        />
      </View>
    )
  }

  _keyExtractor = (item) => item.reviewId + '';
  _renderItem = ({item}) => (
    <View style={styles.item}>
      <ShopSubTitle customStyles={{backgroundColor: '#0ff'}} title={item.storeName}/>
      <View style={styles.footer}>
        <View style={[styles.center, commStyle.borderBottomRgba]}>
          <Text style={styles.time}>考评内容：全部不合格项目({item.projectList.length}项)</Text>
          <Text style={styles.time}>处理人：{item.reviewer}</Text>
          <Text style={styles.time}>考评时间：{item.updateTime}</Text>
        </View>
      </View>
      {
        item.projectList && item.projectList.map(v =>
          <TouchableOpacity
            key={v.reviewProjectId}
            activeOpacity={0.9}
            style={[commStyle.borderBottom, styles.list_item]}
            onPress={() => {
              this.gotoFeedDetail(item, v)
            }}
          >
            <Text style={{fontSize: fontSize15}}>{v.exception}</Text>
            <Text>处理</Text>
          </TouchableOpacity>
        )
      }
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  item: {
    marginBottom: scaleSize(10),
    borderTopColor: lightGaryColor,
    borderTopWidth: scaleSize(1),
    borderStyle: 'solid',
  },
  eval_icon: {
    marginHorizontal: scaleSize(14),
    height: scaleSize(48)
  },
  footer: {
    paddingLeft: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    marginLeft: scaleSize(20),
    padding: scaleSize(16),
    flex: 1,
  },
  time: {
    fontSize: fontSize16,
  },
  list_item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(28),
  }
})
