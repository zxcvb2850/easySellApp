/*
* 店铺
* */
import React from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native"
import Header from "../../components/Header"
import {garyColor, headColor, whiteColor, maxFontSize} from "../../common/styles"
import {Drawer, Button} from "native-base"
import HeaderAttach from "../../components/HeaderAttach"
import {scaleSize} from "../../common/screenUtil";
import {dialPhone, showToast} from "../../common/util"
import DeployStatus from "../../components/DeployStatus";
import StoreStatus from "../../components/StoreStatus";
import {getOrgList, getStoreList, isCollection, getAlarmList} from "../../api/storeReq";
import SearchModal from "../../components/SearchModal"

export default class DynamicIndex extends React.Component {
  componentWillUnmount() {
    this.addEventTab.remove();
  }

  componentWillMount() {
    /*监听当前tab是否是自己*/
    this.addEventTab = this.props.navigation.addListener('didFocus', () => {
      this._getStoreList()
    })
  }

  constructor() {
    super()
    this.state = {
      list: [],
      filter: {
        sidx: '',
        order: '',
        storeCode: '',
      },
      filterList: [],//筛选列表
      page: 1,//当前页码
      refreshing: false,//上拉是否在加载数据
      isStatus: true,//下拉是否在加载数据
      isLoreTextStatus: true,
      isLoreText: '正在加载中...',//上拉加载提示文字
      isCollect: false,//是否收藏
      isOpen: false,//是否展示搜索框
      value: "",//搜索框内容
      historyList: [],
      isLoading: false,//数据加载中
    }
  }

  Refresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      isLoreText: '正在加载...'
    });
    this._getStoreList(1, true)
  }

  _getStoreList = async (page = 1, isRefresh = false) => {
    await this.setState({isLoading: true})
    let result = await getStoreList(page, this.state.filter.sidx, this.state.filter.order, this.state.filter.storeCode, this.state.value, this.state.isCollect ? 1 : 0);
    if (page === 1) {
      if (result.page.list.length) {
        this.setState({list: result.page.list});
      } else {
        this.setState({isLoreText: '没有更多数据了...', list: [], isLoreTextStatus: false})
      }
    } else if (result.page.list.length) {
      this.setState({list: this.state.list.concat(result.page.list)})
    } else {
      this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
    }
    this.setState({isStatus: false, isLoreTextStatus: false, isLoading: false})
    if (isRefresh) {
      this.setState({refreshing: false})
      this.getMoreList();
    }
  }

  getMoreList = () => {
    if (!this.state.isStatus) {
      this.setState({isStatus: true, page: this.state.page + 1})
      this._getStoreList(this.state.page + 1)
    }
  }

  /*全部*/
  allClick = async () => {
    const list = this.state.filterList
    resetSelect(list)
    let filter = {
      sidx: '',
      order: '',
      storeCode: '',
    }
    await this.setState({filter, value: "", filterList: list, isCollect: false})
    this._getStoreList();

    function resetSelect(arr) {
      arr.forEach((v, i) => {
        arr[i].isSelect = false
        v.list.length && resetSelect(v.list)
      })
    }
  }
  /*是否收藏*/
  collection = async () => {
    await this.setState({isCollect: !this.state.isCollect})
    this._getStoreList();
  }
  /*打开搜索框*/
  search = () => this.setState({isOpen: true})
  /*搜索内容*/
  searchText = async value => {
    await this.setState({value, isOpen: false});
    this._getStoreList();
  }
  /*关闭搜索框*/
  closeModal = () => this.setState({isOpen: false})

  filter = async () => {
    if (!this.state.filterList.length) {
      let result = await getOrgList()
      console.log(result.orgList)
      this.setState({filterList: result.orgList})
    }

    this.openDrawer();
  }

  /*点赞*/
  itemIconLick = async (item, index) => {
    await isCollection(item.storeId)
    let list = this.state.list
    list[index].isCollection = !item.isCollection
    this.setState({list})
  }

  /*前往计划考评列表*/
  itemIconTrend = (item) => {
    this.props.navigation.navigate("EvalutDetails", {storeId: item.storeId})
  }

  itemHeadIcon = (item) => {
    this.props.navigation.navigate('ShopDetail', {storeId: item.storeId, storeName: item.storeName})
  }

  /*关闭筛选列表*/
  closeDrawer = () => {
    this.drawer._root.close()
  };

  /*打开筛选列表*/
  openDrawer = () => {
    this.drawer._root.open()
  };
  /*点击筛选*/
  clickFilterItem = (item) => {
    if (item.parentId > -1) {
      let list = this.state.filterList;
      isSelect(list)
      let filter = {
        sidx: '',
        order: '',
        storeCode: item.orgId,
      }
      this.setState({filter, value: item.name})
      setTimeout(() => {
        this._getStoreList();
        this.closeDrawer();
      })
    }

    function isSelect(arr) {
      arr.forEach((v, i) => {
        arr[i].isSelect = false
        if (v.orgId === item.orgId) {
          arr[i].isSelect = true
        } else {
          v.list.length && isSelect(v.list)
        }
      })
    }
  }
  /*筛选是否收藏*/
  collectHand = async () => {
    await this.setState({isCollect: !this.state.isCollect})
    this._getStoreList();
    this.closeDrawer();
  }

  /*前往视频*/
  gotoVideo = (item, val) => {
    if (!item.inUse) {
      this.props.navigation.navigate('ShopVideo', {
        videoInfo: val,//当前视频信息
        storeId: item.storeId,
        storeName: item.storeName
      });
    } else {
      showToast('视频不能播放');
    }
  }

  /*报警信息获取*/
  _getAlarmList = async (item) => {
    let result = await getAlarmList(item.storeId)
    console.log(result, item)
    console.log(result)
    if (result.alarm.length) {
      this.props.navigation.navigate('AlarmList', {
        data: result.alarm,
        storeName: item.storeName
      })
    } else {
      showToast('暂无报警信息')
    }
  }

  render() {
    return (
      <Drawer
        ref={(ref) => {
          this.drawer = ref;
        }}
        side={"right"}
        openDrawerOffset={0.5}
        panCloseMask={0.5}
        content={
          <View style={{flex: 1, backgroundColor: '#FFF'}}>
            {this.filterList(this.state.filterList)}
          </View>}
        onClose={() => this.closeDrawer()}>
        <View style={styles.container}>
          <Header title={"店铺"}>
            <HeaderAttach
              all={this.allClick}
              collection={this.collection}
              isCollect={this.state.isCollect}
              search={this.search}
              filter={this.filter}/>
          </Header>
          <FlatList
            style={styles.list}
            data={this.state.list}
            extraData={this.state}
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
        <SearchModal
          isOpen={this.state.isOpen}
          close={this.closeModal}
          search={(value) => {
            this.searchText(value)
          }}
        />
        {/*<LoadModal status={this.state.isLoading}/>*/}
      </Drawer>
    )
  }

  filterList = (arr) => arr.map(item => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => this.clickFilterItem(item)}
      key={item.orgId}
      style={{
        paddingLeft: item.parentId < 0 ? scaleSize(10) : scaleSize((item.parentId + 1) * 10),
        backgroundColor: item.isSelect ? '#D0E8FE' : '#FFF',
      }}
    >
      <View style={[styles.filter_item, {
        borderBottomColor: item.orgId === 0 ? '#d6d7dc' : 'transparent',
        borderBottomWidth: scaleSize(2),
        borderStyle: 'solid',
      }]}>
        {
          item.orgId > 0 ?
            <Image
              style={{marginHorizontal: scaleSize(26), width: scaleSize(36), height: scaleSize(33)}}
              source={require("../../assets/resource/shop/icon_region.png")}/>
            : null
        }
        <Text style={[styles.drawer_text, {color: item.isSelect ? '#38A0F1' : '#4D4D4D',}]}>{item.name}</Text>
      </View>
      {this.filterList(item.list)}
    </TouchableOpacity>
  ))

  _keyExtractor = (item) => item.storeId + ''

  _renderItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.list_item}
      onPress={() => this.itemHeadIcon(item)}
    >
      <View style={styles.item_header}>
        <Text style={styles.item_head_title}>{item.storeName}</Text>
        <View style={styles.item_head_icon}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.head_icon}
            onPress={() => this.itemIconLick(item, index)}>
            {
              item.isCollection ?
                <Image style={styles.icon}
                       source={require("../../assets/resource/shop/icon_collection_yes.png")}/>
                : <Image style={styles.icon}
                         source={require("../../assets/resource/shop/icon_collection_not.png")}/>
            }
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.head_icon}
            onPress={() => this.itemIconTrend(item)}>
            <Image style={styles.icon} source={require("../../assets/resource/shop/icon_trend.png")}/>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.head_icon}
            onPress={() => dialPhone(item.storeTel)}>
            <Image style={styles.icon} source={require("../../assets/resource/shop/icon_phone.png")}/>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.head_icon}
            onPress={() => this.itemHeadIcon(item)}>
            <Image style={styles.icon} source={require("../../assets/resource/shop/icon_more.png")}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.item_body}>
        <View style={[styles.body_head, {
          borderBottomColor: garyColor,
          borderBottomWidth: scaleSize(1)
        }]}>
          <View style={styles.body_left}>
            <Text>视频监控</Text>
            <StoreStatus status={Number(item.videoState)}/>
          </View>
          <View style={styles.body_right}>
            {
              item.channelList.length > 4 ?
                <Text style={styles.more_text} onPress={() => {
                  this.props.navigation.navigate('ShopVideo', {
                    storeId: item.storeId,
                    storeName: item.storeName
                  })
                }}>查看更多（{item.channelList.length - 4}）</Text>
                : null
            }
          </View>
        </View>
        <View style={styles.body_center}>
          {
            item.channelList.length ?
              item.channelList.map((value, index) => {
                if (index < 4) {
                  return <Button key={value.channelId} light
                                 style={[styles.center_item, {borderColor: value.inUse ? 'rgba(0,0,0,.1)' : garyColor}]}
                                 onPress={() => this.gotoVideo(item, value)}>
                    {
                      value.inUse ?
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../assets/resource/shop/icon_video_offine.png")}/>
                        :
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../assets/resource/shop/icon_video_online.png")}/>
                    }
                    <Text style={{color: value.inUse ? garyColor : '#000'}}>{value.remark}</Text>
                  </Button>
                }
              })
              : <Text>暂无摄像信息</Text>
          }
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.body_head, {
            borderTopColor: garyColor,
            borderTopWidth: scaleSize(1),
          }]}
          onPress={() => this._getAlarmList(item)}
        >
          <View style={styles.body_left}>
            <Text>报警联网</Text>
            <DeployStatus status={Number(item.armingState)}/>
          </View>
          <Text style={{color: garyColor}}>信息 ></Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
  whiteColor: {
    color: whiteColor
  },

  container: {
    flex: 1,
  },

  icon: {
    width: scaleSize(48),
    height: scaleSize(48),
  },
  list: {
    flex: 1,
  },
  list_item: {
    marginHorizontal: scaleSize(22),
    marginVertical: scaleSize(12),
    borderRadius: scaleSize(16),
    overflow: 'hidden',
  },
  item_header: {
    paddingHorizontal: scaleSize(26),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: headColor,
    height: scaleSize(72),
  },
  item_head_title: {
    color: whiteColor,
  },
  item_head_icon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  head_icon: {
    marginHorizontal: scaleSize(15),
  },
  item_body: {
    paddingHorizontal: scaleSize(14),
    backgroundColor: whiteColor,
  },
  body_head: {
    paddingVertical: scaleSize(24),
    flexDirection: 'row',
    borderStyle: 'solid',
  },
  body_left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  body_center: {
    marginVertical: scaleSize(10),
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  more_text: {
    textAlign: 'center',
  },
  center_item: {
    margin: scaleSize(10),
    marginVertical: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(298),
    height: scaleSize(70),
    borderStyle: 'solid',
    borderWidth: scaleSize(2),
  },
  body_footer: {},

  drawer_text: {
    fontSize: maxFontSize,
  },

  filter_item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(98),
  }
})
