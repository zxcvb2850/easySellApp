/*
*  店铺详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native"
import {Content} from "native-base"
import Header from "../../../components/Header"
import {scaleSize} from "../../../common/screenUtil"
import {
  garyColor,
  lightGaryColor,
  whiteColor,
  fontSize20,
  fontSize17,
  successColor,
  mainColor, dangerColor
} from "../../../common/styles"
import {dialPhone, showToast, timerSplice} from "../../../common/util"
import StoreStatus from "../../../components/StoreStatus";
import DeployStatus from "../../../components/DeployStatus";
import {getStoreDetails, getAlarmList} from "../../../api/storeReq";
import ShopTitle from "../../../components/ShopTitle";
import commStyle from "../../../common/commStyle";

export default class ShopDetail extends React.Component {
  constructor(props) {
    super()
    this.state = {
      shopData: {},//店铺信息
      linkmanList: [],//店员信息
      reviewList: [],//考评信息
    }

    this._getShopDetail(props.navigation.state.params.storeId)
  }

  /*店铺详情查询*/
  _getShopDetail = async (id) => {
    let result = await getStoreDetails(id)
    console.log('========', result)
    this.setState({
      shopData: result.storeDetails,
      linkmanList: result.storeDetails.linkmanList,
      reviewList: result.storeDetails.reviewList
    })
  }

  /*报警信息获取*/
  _getAlarmList = async () => {
    let result = await getAlarmList(this.state.shopData.storeId)
    console.log(result)
    if (result.alarm.length) {
      this.props.navigation.navigate('AlarmList', {
        data: result.alarm,
        storeName: this.props.navigation.state.params.storeName
      })
    } else {
      showToast('暂无报警信息')
    }
  }

  /*点击table每行*/
  clickTableItem = (item) => {
    console.log(item);
    if (item.reviewStatus === 3) {
      this.props.navigation.navigate("EvalutEnd", {
        reviewId: item.reviewId
      })
    } else {
      this.props.navigation.navigate("EvalutDetails", {
        storeName: this.state.shopData.storeName,
        reviewId: item.reviewId
      })
    }
  }

  render() {
    const {params} = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <Header isBack title={`店铺详情`}/>
        <Content style={{flex: 1}}>
          <View style={styles.list}>
            <ShopTitle
              title={params.storeName}
              customStyle={commStyle.borderBottom}/>
            <View style={[styles.list_item]}>
              <Image style={styles.icon} source={require("../../../assets/resource/shop/icon_addr.png")}/>
              <View style={styles.txt_wrap}>
                <Text style={styles.item_txt}>地址：</Text>
                <Text style={[styles.item_txt, {color: garyColor}]}>{this.state.shopData.address}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.goto_icon}
                onPress={() => {
                  Linking.canOpenURL('androidamap://route?sid=BGVIS1&slat=39.98871&slon=116.43234&sname=对外经贸大学&did=BGVIS2&dlat=40.055878&dlon=116.307854&dname=北京&dev=0&m=0&t=2').then(supported => {
                    if (supported) {
                      Linking.openURL('androidamap://route?sid=BGVIS1&slat=39.98871&slon=116.43234&sname=对外经贸大学&did=BGVIS2&dlat=40.055878&dlon=116.307854&dname=北京&dev=0&m=0&t=2');
                    } else {
                      //console.log('无法打开该URI: ');
                      showToast('打开地址失败')
                    }
                  })
                }}
              >
                <Image style={styles.goto_icon}
                       source={require("../../../assets/resource/shop/icon_map.png")}/>
              </TouchableOpacity>
            </View>
            <View style={[styles.list_item]}>
              <Image style={styles.icon}
                     source={require("../../../assets/resource/shop/icon_phone_min.png")}/>
              <View style={styles.txt_wrap}>
                <Text style={styles.item_txt}>电话：</Text>
                <Text style={[styles.item_txt, {color: garyColor}]}
                      onPress={() => dialPhone(this.state.shopData.storeTel)}>{this.state.shopData.storeTel}</Text>
              </View>
            </View>
            {
              this.state.linkmanList.length ? this.state.linkmanList.map(item => (
                  <View style={[styles.list_item]} key={item.storeLinkmanId}>
                    {
                      item.position === '店员' ?
                        <Image style={styles.icon}
                               source={require("../../../assets/resource/shop/icon_number.png")}/>
                        :
                        <Image style={styles.icon}
                               source={require("../../../assets/resource/shop/icon_leader.png")}/>
                    }
                    <View style={styles.txt_wrap}>
                      <Text style={styles.item_txt}>{item.position}：</Text>
                      <Text style={[styles.item_txt, {color: garyColor}]}
                            onPress={() => dialPhone(item.linkmanTel)}>{item.linkmanName}-{item.linkmanTel}</Text>
                    </View>
                  </View>
                ))
                :
                <View style={[styles.list_item]}>
                  <Image style={styles.icon}
                         source={require("../../../assets/resource/shop/icon_number.png")}/>
                  <View style={styles.txt_wrap}>
                    <Text style={styles.item_txt}>店员：</Text>
                  </View>
                </View>
            }
          </View>
          <View style={[styles.info, styles.borderTopBottom]}>
            {/*<View style={[styles.first, styles.title]}>
              <Text style={styles.color_back}>考评信息</Text>
            </View>*/}
            <ShopTitle title={'考评信息'}/>
            <View style={styles.table_wrapper}>
              <View style={[styles.table_item, commStyle.borderBottom, styles.table_header]}>
                <Text style={styles.table_td}>考评进展</Text>
                <Text style={styles.table_td}>合格率</Text>
                <Text style={styles.table_td}>等级</Text>
                <Text style={styles.table_td}>考评状态</Text>
                <Text style={[{width: scaleSize(200)}]}>更新时间</Text>
              </View>
              {this.state.reviewList && this.tableItem(this.state.reviewList)}
            </View>
          </View>
          {/*<TouchableOpacity
            activeOpacity={0.9}
            style={[styles.info_list, styles.borderTopBottom]}
            onPress={() => {
              this.props.navigation.navigate('ShopVideo', {
                storeId: params.storeId,
                storeName: params.storeName
              })
            }}
          >
            <Text style={styles.color_back}>视频监控</Text>
            <StoreStatus style={{flex: 1, paddingHorizontal: scaleSize(10)}}
                         status={this.state.videoState}/>
            <Image
              style={{width: scaleSize(48), height: scaleSize(48)}}
              source={require("../../../assets/resource/shop/icon_look.png")}
            />
          </TouchableOpacity>*/}
          <ShopTitle
            title={"视频监控"}
            customStyle={[styles.info_list, commStyle.borderTopBottom]}
            handleItem={() => {
              this.props.navigation.navigate('ShopVideo', {
                storeId: params.storeId,
                storeName: params.storeName
              })
            }}
          >
            <StoreStatus style={{flex: 1, paddingHorizontal: scaleSize(10)}}
                         status={this.state.videoState}/>
            <Image
              style={{width: scaleSize(48), height: scaleSize(48)}}
              source={require("../../../assets/resource/shop/icon_look.png")}
            />
          </ShopTitle>
          <ShopTitle
            title={"报警联网"}
            customStyle={[styles.info_list, commStyle.borderTopBottom, {marginBottom: scaleSize(24)}]}
            handleItem={this._getAlarmList}
          >
            <DeployStatus style={{flex: 1, paddingHorizontal: scaleSize(10)}}
                          status={this.state.armingState}/>
            <Image
              style={{width: scaleSize(39), height: scaleSize(39)}}
              source={require("../../../assets/resource/shop/icon_list.png")}
            />
          </ShopTitle>
        </Content>
      </View>
    )
  }

  tableItem = () => (
    this.state.reviewList.map(item => (
      <TouchableOpacity
        key={item.reviewId}
        activeOpacity={0.9}
        onPress={() => this.clickTableItem(item)}
        style={[styles.table_item, commStyle.borderBottom, styles.table_item_last]}>
        <Text style={styles.table_td}>{item.reviewRate * 100}%</Text>
        <Text style={styles.table_td}>{item.qualifiedRate * 100}%</Text>
        <Text style={styles.table_td}>{item.reviewLevel}</Text>
        <Text style={[styles.table_td, {
          color: item.reviewStatus === 1 ? mainColor : item.reviewStatus === 2 ? dangerColor : successColor
        }]}>
          {item.reviewStatus === 1 ? "待考评" : item.reviewStatus === 2 ? "待提交" : "已完结"}
        </Text>
        <Text numberOfLines={1} style={[{width: scaleSize(200)}]}>{timerSplice(item.updateTime)}</Text>
      </TouchableOpacity>
    ))

  )
}

const styles = StyleSheet.create({
  borderTopBottom: {
    borderTopColor: lightGaryColor,
    borderBottomColor: lightGaryColor,
    borderTopWidth: scaleSize(1),
    borderBottomWidth: scaleSize(1),
    borderStyle: 'solid',
  },
  color_back: {
    color: '#000',
    fontSize: fontSize17,
  },

  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  list: {
    backgroundColor: whiteColor,
  },
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
    height: scaleSize(88),
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
  },

  info: {
    marginTop: scaleSize(26),
    backgroundColor: whiteColor,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(86),
  },
  /*表格样式*/
  table_wrapper: {
    paddingVertical: scaleSize(20),
    marginHorizontal: scaleSize(30),
  },
  table_header: {
    height: scaleSize(80),
  },
  table_item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(88),
  },
  table_item_last: {
    borderBottomWidth: scaleSize(1),
  },
  table_td: {
    flex: 1,
  },

  info_list: {
    marginTop: scaleSize(24),
    backgroundColor: whiteColor,
  },
})
