/*
* 导航文件
* xiaobai
* */
import React from "react";
import {Image, BackHandler} from "react-native"
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
import ShowVideo from "../page/shopFragment/component/ShowVideo"
import EvalutDetails from "../page/evalutFragment/component/EvalutDetails"

import {garyColor, mainColor} from "../common/styles";
import {scaleSize} from "../common/screenUtil";
import {showToast, tabImages} from "../common/util";

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
  ShopDetail: {screen: ShopDetail},
  ShopVideo: {screen: ShowVideo},
}, {
  header: null,
  headerMode: 'none',
})
/*考评*/
const evalutIndex = createStackNavigator({
  EvalutIndex: {screen: EvalutIndex},
  EvalutDetails: {screen: EvalutDetails},
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
  TabDynamic: {
	screen: dynamicIndex,
	navigationOptions: {title: "动态"}
  },
  TabShop: {
	screen: shopIndex,
	navigationOptions: {title: "店铺"}
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
  BootPage: {screen: BootPage},
  Login: {screen: Login},
  TabFragment: {screen: tabFragment},
}, {
  //路由参数
  header: null,
  headerMode: 'none',
  navigationOptions: {
	gesturesEnabled: false,
  }
})

export const routerRule = ['TabDynamic', 'TabShop', 'TabEvalut', 'TabMine', 'TabFragment']

@inject('store')
@observer
export default class AppNavigatorRoot extends React.Component {
  @action
  addRouter() {
	this.props.store.NavInfo.addRoute(this.routerIndex)
  }

  @action
  delRouter() {
	this.props.store.NavInfo.delRoute(this.routerIndex)
  }

  @computed get routerIndex() {
	return this.props.store.NavInfo.navList
  }

  componentDidMount() {
	BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
	BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
	console.log(this.routerIndex)
	if (this.routerIndex === 1 || this.routerIndex === 2) {
	  if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
		BackHandler.exitApp()
		return false
	  }
	  showToast('再按一次退出!', 'info', 1000);
	  this.lastBackPressed = Date.now();
	  return true;
	}
	return false;
  }

  render() {
	let isOne = true
	return (
	  <AppNavigator
		onNavigationStateChange={(prevState, newState, action) => {
		  if (action.routeName) {
			if (routerRule.indexOf(action.routeName) !== -1) {
			  if (isOne) {
				this.addRouter()
				isOne = false
			  }
			} else {
			  this.addRouter()
			}
		  }
		  if (action.type === 'Navigation/BACK') {
			this.delRouter()
		  }
		}}/>
	)
  }
}
