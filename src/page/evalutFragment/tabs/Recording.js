/*
* 考评记录
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList, RefreshControl, TouchableOpacity} from "react-native"
import {Separator} from "native-base"
import {scaleSize,setSpText} from "../../../common/screenUtil";
import {
  garyColor,
  lightGaryColor,
  mainColor,
  whiteColor,
  fontSize20,
  fontSize16,
  fontSize18,
  fontSize17, fontSize14
} from "../../../common/styles"
import {getStoreHistory} from "../../../api/evaluReq";
import EvalutEnd from "../component/EvalutEnd";
import {timerify} from "../../../common/util";

export default class Recording extends React.Component {
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
    this._getStoreHistory()
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.filter !== this.props.filter) {
      if (nextProps.index === 2) {
        await this.setState({filter: nextProps.filter})
        this._getStoreHistory()
      }
    }
    if (nextProps.index === 2) {
      this._getStoreHistory();
    }
  }

  //获取列表
  _getStoreHistory = async (page = 1, isRefresh = false) => {
    /*此处请求有点小问题*/
    let result = await getStoreHistory(page, this.state.filter.sidx, this.state.filter.order, this.state.filter.storeCode, this.state.filter.storeName);
    console.log(result);
    if (page === 1) {
      if (result.page.list.length) {
        this.setState({list: timerify(result.page.list)});
      } else {
        this.setState({isLoreText: '没有更多数据了...', list: [], isLoreTextStatus: false})
      }
    } else if (result.page.list.length) {
      this.setState({list: this.state.list.concat(timerify(result.page.list))})
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
      this._getStoreHistory(this.state.page + 1)
    }
  }
  //下拉刷新
  Refresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      isLoreText: '正在加载...'
    });
    this._getStoreHistory(1, true)
  }

  evaluateImage = (type) => {
    let img = ''
    switch (type) {
      case '优':
        img = require("../../../assets/resource/evalut/icon_you.png")
        break;
      case '中':
        img = require("../../../assets/resource/evalut/icon_zhong.png")
        break;
      case '良':
        img = require("../../../assets/resource/evalut/icon_lian.png")
        break;
      case '差':
        img = require("../../../assets/resource/evalut/icon_cha.png")
        break;
      default:
        img = ''
    }
    return img
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.list}
          keyExtractor={this._keyExtractor}
          onEndReachedThreshold={0.1}//执行上啦的时候10%执行
          onEndReached={this.getMoreList}//获取更多数据
          ListFooterComponent={this._renderFooter}//尾部
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

  _keyExtractor = (item, index) => index + '';
  _renderItem = ({item}) => (
    <View style={styles.list}>
      <View style={styles.top}>
        <Text style={styles.top_txt}>{item.planTime}</Text>
      </View>
      {
        item.data.length && item.data.map(v => (
          <View key={v.reviewId} style={styles.item}>
            <View style={styles.head}>
              <View style={styles.line}/>
              <Text style={styles.head_title}>{v.storeName}</Text>
              <Image style={styles.eval_icon} source={this.evaluateImage(v.reviewLevel)}/>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.footer}
              onPress={() => {
                this.props.navigate('EvalutEnd', {storeName: v.storeName, reviewId: v.reviewId})
              }}>
              <View style={styles.center}>
                <Text
                  style={styles.desc}>检查{v.totalNum}项,{v.normalNum}项合格，{v.qualifiedRate * 100}%合格率</Text>
                <Text style={styles.time}>14:20:20</Text>
              </View>
              <Image style={{width: scaleSize(44), height: scaleSize(44)}}
                     source={require("../../../assets/resource/common/icon_back_black.png")}/>
            </TouchableOpacity>
          </View>
        ))
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

  list: {
    backgroundColor: whiteColor,
    borderTopColor: lightGaryColor,
    borderTopWidth: scaleSize(1),
    borderStyle: 'solid',
  },
  item: {
    marginBottom: scaleSize(6),
    borderTopColor: lightGaryColor,
    borderTopWidth: scaleSize(1),
    borderStyle: 'solid',
  },
  top: {
    justifyContent: 'center',
    height: scaleSize(78),
    backgroundColor: '#f5f5f5',
  },
  top_txt: {
    marginLeft: scaleSize(40),
    fontSize: fontSize18,
    color: '#000',
  },
  head: {
    paddingHorizontal: scaleSize(28),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(88),
  },
  line: {
    marginHorizontal: scaleSize(8),
    width: scaleSize(4),
    height: scaleSize(26),
    backgroundColor: mainColor,
  },
  head_title: {
    flex: 1,
    fontSize: fontSize17,
    color: '#000',
  },
  eval_icon: {
    marginHorizontal: scaleSize(14),
    width: scaleSize(48),
    height: scaleSize(48)
  },
  footer: {
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(150),
    borderTopColor: lightGaryColor,
    borderBottomColor: lightGaryColor,
    borderTopWidth: scaleSize(1),
    borderBottomWidth: scaleSize(1),
    borderStyle: 'solid',
  },
  center: {
    paddingHorizontal: scaleSize(20),
    flex: 1,
  },
  desc: {
    fontSize: fontSize16,
    color: '#252525'
  },
  time: {
    color: garyColor,
    fontSize: fontSize14,
  }
})
