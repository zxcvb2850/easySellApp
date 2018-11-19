/*
* 物品的状态
* */
import React from "react"
import {StyleSheet, View, Text} from "react-native"
import {headerColor, successColor, warringColor} from "../common/styles";
import {scaleSize} from "../common/screenUtil";

/*
* 0 在线
* 1 离线
* */
const StoreStatus = (props) => (
    <View style={[styles.body, props.style]}>
        <Text style={styles.dot}>●</Text>
        {
            props.status === 0 ?
                <Text style={{color: successColor}}>在线</Text>
                :
                <Text style={{color: warringColor}}>离线</Text>
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

export default StoreStatus