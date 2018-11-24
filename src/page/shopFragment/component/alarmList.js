/**
 * 报警列表
 * */
import React from "react";
import {StyleSheet, View, Text} from "react-native";
import {Content} from "native-base"
import Header from "../../../components/Header";
import {scaleSize} from "../../../common/screenUtil";
import {lightGaryColor, whiteColor} from "../../../common/styles";

const alarmList = ({navigation}) => {
    const {params} = navigation.state;
    return (
        <View style={styles.container}>
            <Header isBack title={`${params.storeName}报警列表`}/>
            <Content style={{flex: 1}}>
                {
                    params.data ? params.data.map(item => (
                        <View key={item.id} style={styles.content}>
                            <View style={styles.desc_wrap}>
                                <Text style={[styles.text, styles.left_text]}>{item.alarmTime}</Text>
                                {
                                    item.alarmCode ?
                                        <Text style={[styles.text, styles.right_text]}>报警码:{item.alarmCode}</Text>
                                        :
                                        <Text style={[styles.text, styles.right_text]}>防区号:{item.alarmCode}</Text>
                                }
                            </View>
                            <View style={styles.options}>
                                {
                                    item.alarmCode ?
                                        <Text>{item.alarmDetail}</Text>
                                        :
                                        <Text>{item.protectAddress}</Text>
                                }
                            </View>
                        </View>
                    )) : null
                }
            </Content>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        paddingHorizontal: scaleSize(30),
        height: scaleSize(130),
        borderBottomColor: lightGaryColor,
        borderBottomWidth: scaleSize(1),
        borderStyle: 'solid',
        backgroundColor: whiteColor,
    },
    desc_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(80)
    },
    text: {},
    left_text: {
        flex: 1,
    },
    right_text: {},
    options: {
        flexDirection: 'row-reverse',
        height: scaleSize(50)
    }
})

export default alarmList;

