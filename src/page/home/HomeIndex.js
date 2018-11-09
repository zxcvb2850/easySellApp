import React from "react"
import { View, Text } from "react-native"

export default class HomeIndex extends React.Component {
    render() {
        return (
            <View>
                <Text onPress={() => { this.props.navigation.navigate('Page') }}>page</Text>
                <Text onPress={() => { console.log(1234);this.props.navigation.navigate('Page') }}>我是首页</Text>
            </View>
        )
    }
}