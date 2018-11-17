/*
* 整改反馈
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList} from "react-native"
import {Separator} from "native-base"
import {scaleSize} from "../../../common/screenUtil";
import {garyColor, lightGaryColor, mainColor, whiteColor} from "../../../common/styles"

export default class Feedback extends React.Component {
    constructor() {
        super()
        this.state = {
            list: [
                {id: 1, eval: 5, children: [{ids: 10}, {ids: 11}]},
                {id: 2, eval: 2, children: [{ids: 10}]},
                {id: 3, eval: 5, children: [{ids: 10}, {ids: 11}]},
                {id: 4, eval: 2, children: [{ids: 11}]}]
        }
    }

    _keyExtractor = (item) => item.id + '';
    _renderItem = ({item}) => (
        <View style={styles.item}>
            <View style={styles.head}>
                <View style={styles.line}/>
                <Text style={styles.head_title}>南区1030店</Text>
                <Text style={styles.eval_icon}>处理</Text>
            </View>
            <View style={styles.footer}>
                <View style={styles.center}>
                    <Text style={styles.desc}>考评时间：2018-10-8日</Text>
                    <Text style={styles.time}>考评内容荣：全部不合格项目(3项)</Text>
                    <Text style={styles.time}>处理人：张麻子</Text>
                    <Text style={styles.time}>完成时间：2018-10-10 11:12:23</Text>
                </View>
            </View>
        </View>
    )

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.list}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },

    item: {
        marginBottom: scaleSize(10),
        borderTopColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    head: {
        paddingHorizontal: scaleSize(28),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(88),
        backgroundColor: '#0ff',
    },
    line: {
        marginHorizontal: scaleSize(8),
        width: scaleSize(4),
        height: scaleSize(26),
        backgroundColor: mainColor,
    },
    head_title: {
        flex: 1,
    },
    eval_icon: {
        marginHorizontal: scaleSize(14),
        height: scaleSize(48)
    },
    footer: {
        marginBottom: scaleSize(24),
        padding: scaleSize(30),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: lightGaryColor,
        borderBottomColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderBottomWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    center: {
        paddingHorizontal: scaleSize(20),
        flex: 1,
    },
    desc: {
        //fontSize: 16,
    },
    time: {
        fontSize: 13,
    }
})