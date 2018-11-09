import React from "react"
import { View, Text } from "react-native";

export default class Page extends React.Component {
    render() {
        return (
            <View>
                <Text style={{ color: '#000' }} onPress={() => { this.props.navigation.push('Page') }}>page</Text>
                <Text style={{ color: '#000' }} onPress={() => { this.props.navigation.goBack() }}>返回</Text>
            </View>
        )
    }
}