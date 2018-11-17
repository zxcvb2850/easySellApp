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
import ShowVideo from "../page/shopFragment/component/ShowVideo"
import EvalutDetails from "../page/evalutFragment/component/EvalutDetails"

import {garyColor, mainColor} from "../common/styles";
import {scaleSize} from "../common/screenUtil";
import {tabImages} from "../common/util";

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
    TabFragment: {screen: tabFragment},
    BootPage: {screen: BootPage},
    Login: {screen: Login}
}, {
    //路由参数
    header: null,
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false,
    }
})

export const routerRule = ['Login', 'TabDynamic', 'TabShop', 'TabEvalut', 'TabMine', 'TabFragment']

@inject('store')
@observer
export default class AppNavigatorRoot extends React.Component {
    @action
    setRouter(route) {
        this.props.store.NavInfo.setRoute(route)
    }

    render() {
        return (
            <AppNavigator
                onNavigationStateChange={(prevState, newState, action) => {
                    console.log('-----------', action)
                    if (action.routeName) {
                        this.setRouter(action.routeName)
                    } else {
                        console.log("监听到放回", action.key)
                        if (action.type === 'Navigation/COMPLETE_TRANSITION' && action.key !== "StackRouterRoot" && routerRule.indexOf(action.key) !== -1) {
                            this.setRouter(action.key)
                        }
                    }
                }}/>
        )
    }
}
