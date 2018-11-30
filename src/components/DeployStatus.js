/*
* 物品的状态
* */
import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { headerColor, successColor, warringColor } from "../common/styles";
import { scaleSize } from "../common/screenUtil";

/*
* 0 布防
* 1 撤防
* */
const DeployStatus = (props) => (
    <View style={[styles.body, props.style]}>
        <Text style={[styles.dot, { color: props.status === 0 ? successColor : warringColor }]}>●</Text>
        <Text style={{ color: props.status === 0 ? successColor : warringColor }}>{props.status === 0 ? '布防' : '撤防'}</Text>
        <Text style={[styles.dot, { color: props.status === 0 ? successColor : warringColor }]}>●</Text>
    </View>
)

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
    },
    dot: {
        marginHorizontal: scaleSize(10),
        color: '#7f9bdb',
    },
})

export default DeployStatus