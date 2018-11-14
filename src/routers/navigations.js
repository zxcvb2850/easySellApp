/*
* 导航文件
* xiaobai
* */
import React from "react";
import {Image} from "react-native"
import {createStackNavigator, createTabNavigator, createBottomTabNavigator} from "react-navigation"

/*路由指向的文件*/
import BootPage from "../components/BootPage"
import Login from "../page/Login"
import DynamicIndex from "../page/dynamicFragment/DynamicIndex"
import ShopIndex from "../page/shopFragment/ShopIndex"
import EvalutIndex from "../page/evalutFragment/EvalutIndex"
import MineIndex from "../page/mineFragment/MineIndex"
import ForgetPwd from "../page/mineFragment/ForgetPwd"
import ShopDetail from "../page/shopFragment/component/ShopDetail"

import {garyColor, mainColor} from "../common/styles";
import {scaleSize} from "../common/screenUtil";
import {tabImages} from "../common/util";

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
  ShopDetail: {screen: ShopDetail},
}, {
  header: null,
  headerMode: 'none',
})
/*考勤*/
const evalutIndex = createStackNavigator({
  EvalutIndex: {screen: EvalutIndex},
}, {
  header: null,
  headerMode: 'none',
})

/*我的*/
const mineIndex = createStackNavigator({
  MineIndex: {screen: MineIndex},
  ForgetPwd: {screen: ForgetPwd},
}, {
  header: null,
  headerMode: 'none',
})

/*四个页签*/
const tabFragment = createBottomTabNavigator({
  TabShop: {
	screen: shopIndex,
	navigationOptions: {title: "店铺"}
  },
  TabDynamic: {
	screen: dynamicIndex,
	navigationOptions: {title: "动态"}
  },
  TabEvalut: {
	screen: evalutIndex,
	navigationOptions: {title: "考评"}
  },
  TabMine: {
	screen: mineIndex,
	navigationOptions: {title: "我的"}
  },
}, {
  navigationOptions: ({navigation}) => ({
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
	activeTintColor: mainColor,
	inactiveTintColor: garyColor,
	showIcon: true,
  }
})

export const AppNavigator = createStackNavigator({
  TabFragment: {screen: tabFragment},
  Login: {screen: Login},
  BootPage: {screen: BootPage}
}, {
  //路由参数
  header: null,
  headerMode: 'none',
  navigationOptions: {
	gesturesEnabled: false,
  }
})
