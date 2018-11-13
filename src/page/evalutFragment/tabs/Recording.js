/*
* 考评记录
* */
import React from "react"
import {StyleSheet, View, Text, Image} from "react-native"


export default class Recording extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>考评</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})