/**
 * 已完结的项目
 * */
import React from "react";
import {StyleSheet, View, Text, Image} from "react-native"
import Header from "../../../components/Header";

export default class EvalutEnd extends React.Component {
    render() {
        let {params} = this.props.navigation.state
        return (
            <View style={styles.container}>
                <Header isBack title={params.storeName}/>
                <Text>{params.reviewerId}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})