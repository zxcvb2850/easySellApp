/*
* 导航文件
* xiaobai
* */

import React from "react"
import {createStackNavigator, TabNavigator} from "react-navigation"

/*路由指向的文件*/
import BootPage from "../components/BootPage"
import Login from "../page/Login"

export const AppNavigator = createStackNavigator({
    Login: {screen: Login},
    BootPage: {screen: BootPage},
}, {
    //路由参数
    header: null,
    headerMode: 'none'
})