import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default class Login extends React.Component {

    login = () => {
        console.log(this.props);
        this.props.navigation.navigate('Home', { name: 'abc' })
    }

    render() {
        return (
            <View>
                <Text style={{ color: '#000' }}>我是登录页面</Text>
                <Text onPress={this.login}>登录</Text>
            </View>
        )
    }
}