/*
* 考评记录
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList} from "react-native"
import {Separator} from "native-base"
import {scaleSize} from "../../../common/screenUtil";
import {garyColor, lightGaryColor, mainColor, whiteColor} from "../../../common/styles"

export default class Recording extends React.Component {
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
        <View style={styles.list}>
            <View style={styles.top}>
                <Text style={styles.top_txt}>当天</Text>
            </View>
            {
                item.children.map(v => (
                    <View style={styles.item} key={v.ids}>
                        <View style={styles.head}>
                            <View style={styles.line}/>
                            <Text style={styles.head_title}>南区1030店</Text>
                            {
                                item.eval > 3 ?
                                    <Image style={styles.eval_icon}
                                           source={require("../../../assets/resource/evalut/icon_you.png")}/>
                                    :
                                    <Image style={styles.eval_icon}
                                           source={require("../../../assets/resource/evalut/icon_lian.png")}/>
                            }
                        </View>
                        <View style={styles.footer}>
                            <View style={styles.center}>
                                <Text style={styles.desc}>检查35项，全部合格</Text>
                                <Text style={styles.time}>14:20:20</Text>
                            </View>
                            <Image style={{width: scaleSize(44), height: scaleSize(44)}}
                                   source={require("../../../assets/resource/common/icon_back_black.png")}/>
                        </View>
                    </View>
                ))
            }
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

    list: {
        backgroundColor: whiteColor,
        borderTopColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    item: {
        marginBottom: scaleSize(10),
        borderTopColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    top: {
        justifyContent: 'center',
        height: scaleSize(78),
        backgroundColor: '#c3d5fb',
    },
    top_txt: {
        marginLeft: scaleSize(40),
        color: mainColor,
    },
    head: {
        paddingHorizontal: scaleSize(28),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(88),
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
        width: scaleSize(48),
        height: scaleSize(48)
    },
    footer: {
        marginBottom: scaleSize(24),
        paddingHorizontal: scaleSize(30),
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(150),
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
        color: garyColor,
        fontSize: 13,
    }
})