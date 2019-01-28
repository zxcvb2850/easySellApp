/*
* 导航文件
* xiaobai
* */
import React from "react";
import {Image, BackHandler} from "react-native"
import {createStackNavigator, createBottomTabNavigator, SafeAreaView} from "react-navigation"

/*路由指向的文件*/
import BootPage from "../components/BootPage"
import Login from "../page/Login"
import DynamicIndex from "../page/dynamicFragment/DynamicIndex"
import ShopIndex from "../page/shopFragment/ShopIndex"
import EvalutIndex from "../page/evalutFragment/EvalutIndex"
import MineIndex from "../page/mineFragment/MineIndex"
import ForgetPwd from "../page/mineFragment/ForgetPwd"
import ShopDetail from "../page/shopFragment/component/ShopDetail"
import AlarmList from "../page/shopFragment/component/AlarmList"
import ShowVideo from "../page/shopFragment/component/ShowVideo"
import EvalutDetails from "../page/evalutFragment/component/EvalutDetails"
import EvalutEnd from "../page/evalutFragment/component/EvalutEnd"
import EvalutItem from "../page/evalutFragment/component/EvalutItem"
import FeedList from "../page/evalutFragment/component/FeedList"
import FeedbackDetail from "../page/evalutFragment/component/FeedbackDetail"
import WebViewCommon from "../components/WebViewCommon"

import {garyColor, mainColor} from "../common/styles";
import {scaleSize} from "../common/screenUtil";
import {showToast, tabImages, tabName} from "../common/util";

/*mobx*/
import {observer, inject} from 'mobx-react'
import {action, computed} from 'mobx'

/*动态*/
const dynamicIndex = createStackNavigator({
  DynamicIndex: {screen: DynamicIndex},
}, {
  title: "动态",
  header: null,
  headerMode: 'none',
})
/*店铺*/
const shopIndex = createStackNavigator({
  ShopIndex: {screen: ShopIndex},
}, {
  header: null,
  headerMode: 'none',
})
/*考评*/
const evalutIndex = createStackNavigator({
  EvalutIndex: {screen: EvalutIndex},
}, {
  header: null,
  headerMode: 'none',
})

/*我的*/
const mineIndex = createStackNavigator({
  MineIndex: {screen: MineIndex},
}, {
  header: null,
  headerMode: 'none',
})

/*四个页签*/
const tabFragment = createBottomTabNavigator({
  TabDynamic: {screen: dynamicIndex},
  TabShop: {screen: shopIndex},
  TabEvalut: {screen: evalutIndex},
  TabMine: {screen: mineIndex},
}, {
  navigationOptions: ({navigation}) => ({
    title: tabName[navigation.state.routeName],
    tabBarIcon: ({focused, tintColor}) => {
      const {routeName} = navigation.state;
      let img = tabImages[routeName + (focused ? "Yes" : "Not")];
      return <Image style={{width: scaleSize(48), height: scaleSize(48)}} source={img}/>
    },
  }),
  lazy: true,
  removeClippedSubviews: true,
  backBehavior: false,
  tabBarOptions: {
    style: {
      height: scaleSize(100),
    },
    activeTintColor: mainColor,
    inactiveTintColor: garyColor,
    showIcon: true,
    showLabel: true,
    safeAreaInset: {bottom: 'never'}
  },
})

export const AppNavigator = createStackNavigator({
  BootPage: {screen: BootPage},
  Login: {screen: Login},
  TabFragment: {screen: tabFragment},
  ShopVideo: {screen: ShowVideo},//视频播放
  EvalutItem: {screen: EvalutItem},//在线考评
  EvalutDetails: {screen: EvalutDetails},//计划考评列表
  EvalutEnd: {screen: EvalutEnd},//考评历史详情
  FeedList: {screen: FeedList},//列外考评列表
  FeedbackDetail: {screen: FeedbackDetail},//列外考评详情
  ForgetPwd: {screen: ForgetPwd},//修改密码
  ShopDetail: {screen: ShopDetail},//店铺详情
  AlarmList: {screen: AlarmList},//报警列表
  WebViewCommon: {screen: WebViewCommon},//公用webview
}, {
  //路由参数
  header: null,
  headerMode: 'none',
  navigationOptions: {
    gesturesEnabled: false,
  }
})

@inject('store')
@observer
export default class AppNavigatorRoot extends React.Component {
  @action
  setIndex(index) {
    this.props.store.NavIndex.setRoute(index)
  }

  @action
  setPhotoPath() {
    this.props.store.PhotoPath.setPhotoPath(null);
  }

  @computed get routerIndex() {
    return this.props.store.NavIndex.navIndex
  }

  @computed get routerInfo() {
    return this.props.store.NavInfo.navInfo
  }

  @computed get getStatusBar() {
    return this.props.store.StatusBarColor.statusBarColor
  }

  componentDidMount() {
    /*监听返回按钮*/
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    /*移除监听返回按钮*/
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    let info = this.routerInfo;
    let index = this.routerIndex
    if (info ? index === 2 || index === 1 : index === 1) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        BackHandler.exitApp()
        return false
      }
      showToast('再按一次退出!', 'info', 1000);
      this.lastBackPressed = Date.now();
      return true;
    }
    this.setPhotoPath();
    return false;
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: this.getStatusBar}}>
        <AppNavigator
          onNavigationStateChange={(prevState, newState, action) => {
            this.setIndex(prevState.index)
          }}/>
      </SafeAreaView>
    )
  }
}
