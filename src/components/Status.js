/*
* 物品的状态
* */
import React from "react"
import {StyleSheet, View, Text} from "react-native"
import {headerColor, successColor, warringColor} from "../common/styles";
import {scaleSize} from "../common/screenUtil";

/*
* 1 在线
* 2 离线
* 3 不妨
* */
const status = (props) => (
    <View style={[styles.body, props.style]}>
        <Text style={styles.dot}>●</Text>
        {
            props.status == 1 ?
                <Text style={{color: successColor}}>在线</Text>
                : props.status == '2' ?
                <Text style={{color: warringColor}}>离线</Text>
                :
                <Text style={{color: headerColor}}>布防</Text>
        }
        <Text style={styles.dot}>●</Text>
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

export default status