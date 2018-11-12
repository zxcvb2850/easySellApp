/*
* 店铺
* */
import React from "react"
import {StyleSheet, View, Text, Image} from "react-native"
import Header from "../../components/Header"

export default class DynamicIndex extends React.Component {
	headerLeft = () => (
		<View>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		<Text>全部</Text>
		</View>
	)
	headerRight = () => (
		<Text>搜索</Text>
	);

	render() {
		return (
			<View>
				<Header title={"店铺"} left={this.headerLeft} right={this.headerRight}/>
				<Text>店铺页签</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	}
})
