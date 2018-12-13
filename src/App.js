import React from "react"
import { Root } from "native-base"
import AppNavigatorRoot from "./routers/navigations"
import { SafeAreaView } from "react-navigation"
// 全局注册并注入mobx，其他地方都可以使用store
import { Provider } from 'mobx-react';
// 获取store实例
import store from './store/';

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Root>
					<AppNavigatorRoot />
				</Root>
			</Provider>
		)
	}
}
