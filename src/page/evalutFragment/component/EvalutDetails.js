/*
* 考评详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native"
import Accordion from 'react-native-collapsible/Accordion'
import Header from "../../../components/Header";
import commonStyle from "../../../common/commStyle"
import {scaleSize} from "../../../common/screenUtil";
import {backgroundColor, headerColor, lightGaryColor, whiteColor} from "../../../common/styles";

export default class EvalutDetails extends React.Component {
    constructor() {
        super()
        this.state = {
            activeSections: [],
            data: [
                {
                    title: '日常巡逻',
                    content: 'Lorem ipsum...'
                },
                {
                    title: '新店筹建',
                    content: 'Lorem ipsum...'
                }
            ]
        }
    }

    _renderHeader = (section, index, isActive, sections) => {
        return (
            <View
                style={[styles.header, commonStyle.borderTopBottom, {
                    backgroundColor: (isActive ? whiteColor : backgroundColor),
                    marginBottom: isActive ? scaleSize(0) : scaleSize(20)
                }]}>
                <Text style={styles.header_text}>{section.title}</Text>
                <Image style={[styles.icon_show, {
                    transform: [{rotate: !isActive ? '0deg' : '90deg'}]
                }]} source={require("../../../assets/resource/evalut/icon_show.png")}/>
            </View>
        );
    };

    _renderContent = (section, index, isActive, sections) => {
        return (
            <View style={[styles.content, {
                marginBottom: isActive ? scaleSize(20) : scaleSize(0)
            }]}>
                <View style={styles.content_item}>
                    <Text style={{fontSize: 14, marginRight: scaleSize(10)}}>001</Text>
                    <View style={styles.content_desc}>
                        <Text>员工及促销人员的私人物品，如手袋、钱包必须放在个人储物柜内。</Text>
                    </View>
                </View>
                <View style={styles.submit_wrap}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.icon_submit, styles.icon_margin]}
                        onPress={() => {
                        }}>
                        <Image style={styles.icon_submit}
                               source={require("../../../assets/resource/evalut/icon_confirm_yes.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.icon_submit, styles.icon_margin]}
                        onPress={() => {
                        }}>
                        <Image style={styles.icon_submit}
                               source={require("../../../assets/resource/evalut/icon_error_not.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    _updateSections = activeSections => {
        this.setState({activeSections});
    };

    render() {
        return (
            <View style={styles.container}>
                <Header isBack title={"考评"}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.icon_confirm, styles.confirm_total]}>
                        <Image style={styles.icon_confirm}
                               source={require("../../../assets/resource/evalut/icon_confirm.png")}/>
                    </TouchableOpacity>
                </Header>
                <View style={styles.center}>
                    {/*手风琴动画*/}
                    <Accordion
                        style={{backgroundColor: whiteColor}}
                        sections={this.state.data}
                        activeSections={this.state.activeSections}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        onChange={this._updateSections}
                        underlayColor={whiteColor}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor
    },

    confirm_total: {
        position: 'absolute',
        right: scaleSize(30),
        top: scaleSize((90 - 44) / 2),
        height: scaleSize(90),
    },
    icon_confirm: {
        width: scaleSize(44),
        height: scaleSize(44),
    },

    center: {
        flex: 1,
    },
    header: {
        paddingHorizontal: scaleSize(20),
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(86),
    },
    content: {
        paddingHorizontal: scaleSize(20),
    },
    content_item: {
        flexDirection: 'row',
        borderBottomColor: lightGaryColor,
        borderBottomWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    content_desc: {
        flex: 1,
    },
    submit_wrap: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    icon_submit: {
        width: scaleSize(48),
        height: scaleSize(48),
    },
    icon_margin: {
        marginTop: scaleSize(10),
        marginLeft: scaleSize(20),
        marginRight: scaleSize(20),
    },
    header_text: {
        flex: 1,
        paddingLeft: scaleSize(12),
        borderLeftColor: headerColor,
        borderLeftWidth: scaleSize(4),
        borderStyle: 'solid',
    },
    icon_show: {
        width: scaleSize(45),
        height: scaleSize(45),
    }
})