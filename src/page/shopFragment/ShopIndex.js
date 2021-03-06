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
import {garyColor, headColor, whiteColor, fontSize20, fontSize16, fontSize17, fontSize15} from "../../common/styles"
import {Drawer, Button} from "native-base"
import HeaderAttach from "../../components/HeaderAttach"
import {scaleSize} from "../../common/screenUtil";
import {dialPhone, showToast} from "../../common/util"
import DeployStatus from "../../components/DeployStatus";
import StoreStatus from "../../components/StoreStatus";
import {getOrgList, getStoreList, isCollection, getAlarmList} from "../../api/storeReq";
import SearchModal from "../../components/SearchModal"
import VideoMonitorItem from "../../components/VideoMonitorItem";

const VIDEO_MONITOR = '视频监控';
const POLICE_TEXT = '报警联网';

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
        paddingLeft: scaleSize((item.parentId + 1) * 10),
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
        <Text style={[styles.drawer_text, {
          color: item.isSelect ? '#38A0F1' : '#4D4D4D',
          paddingLeft: item.parentId < 0 ? scaleSize(10) : 0
        }]}>{item.name}</Text>
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
        <GotoText
          customStyles={{
            borderBottomWidth: scaleSize(1)
          }}
          title={VIDEO_MONITOR}
          value={item.channelList.length > 4 ? `查看更多(${item.channelList.length - 4})` : ''}
          status={item.videoState}
          handleClick={() => {
            this.props.navigation.navigate('ShopVideo', {
              storeId: item.storeId,
              storeName: item.storeName
            })
          }}
        />
        <View style={styles.body_center}>
          {
            item.channelList.length ?
              item.channelList.map((value, index) => {
                if (index < 4) {
                  return <VideoMonitorItem
                    key={value.channelId}
                    status={value.inUse}
                    title={value.remark}
                    onPress={() => this.gotoVideo(item, value)}
                  />
                }
              })
              : <Text>暂无摄像信息</Text>
          }
        </View>
        <GotoText
          customStyles={{
            borderTopWidth: scaleSize(1),
          }}
          title={POLICE_TEXT}
          value={'信息'}
          status={item.armingState}
          handleClick={() => this._getAlarmList(item)}
        />
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

const GotoText = ({title, value, status, customStyles, handleClick}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={[styles.body_head, customStyles]}
    onPress={handleClick}
  >
    <View style={styles.body_left}>
      <Text style={{fontSize: fontSize15, color: '#4d4d4d'}}>{title}</Text>
      {
        title === VIDEO_MONITOR ?
          <StoreStatus status={Number(status)}/>
          :
          <DeployStatus status={Number(status)}/>
      }
    </View>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={{color: garyColor, fontSize: fontSize15}}>{value}</Text>
      <Image
        style={styles.more_icon}
        source={require("../../assets/resource/shop/icon_info_more.png")}/>
    </View>
  </TouchableOpacity>
)

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
    fontSize: fontSize16
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
    borderColor: '#d6d7dc',
    height: scaleSize(85),
  },
  body_left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  body_center: {
    marginVertical: scaleSize(24),
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  more_text: {
    textAlign: 'center',
    fontSize: fontSize15,
    color: '#808080'
  },
  more_icon: {
    marginHorizontal: scaleSize(14),
    marginRight: scaleSize(22),
    width: scaleSize(12),
    height: scaleSize(24)
  },

  drawer_text: {
    fontSize: fontSize20,
  },

  filter_item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(98),
  }
})
