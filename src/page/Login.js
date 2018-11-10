import React from "react";
import {StyleSheet, StatusBar, TouchableHighlight, View, Text,Image} from "react-native";
import {scaleSize} from "../common/screenUtil";

export default class Login extends React.Component {

    constructor() {
        super()
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Image style={{width: scaleSize(236), height: scaleSize(236)}}
                           source={require('../assets/resource/login/logo.png')}/>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})