/*
* 监控页面
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity, FlatList} from "react-native"
import {Button} from "native-base"
import {backgroundColor, garyColor, headerColor, whiteColor} from "../../../common/styles";
import Header from "../../../components/Header";
import {scaleSize} from "../../../common/screenUtil";
import {getVideoList} from "../../../api/storeReq";

export default class ShowVideo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            videoList: [],//视频列表
            nowVideo: {},//当前视频信息
        }

        this._getVideoList(props.navigation.state.params.storeId)
    }

    _getVideoList = async (id) => {
        let {params} = this.props.navigation.state
        let result = await getVideoList(id)
        //console.log(result)
        this.setState({
            videoList: result.video.channelList,
            nowVideo: params.videoInfo ? params.videoInfo : result.video.channelList[0]//当前是否接受到视频信息
        })
    }

    _keyExtractor = (item) => item.channelId + ''
    _renderItem = ({item}) => (
        <View style={styles.video_item}>
            <Button block light
                    style={[styles.center_item, {borderColor: item.inUse ? 'rgba(0,0,0,.1)' : garyColor}]}
                    onPress={() => {
                        this.setState({nowVideo: item})
                        //console.log(item.channelId)
                    }}>
                {
                    item.inUse ?
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../../assets/resource/shop/icon_video_offine.png")}/>
                        :
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../../assets/resource/shop/icon_video_online.png")}/>
                }
                <Text style={{color: item.inUse ? garyColor : '#000'}}>{item.remark}</Text>
            </Button>
        </View>
    )


    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <Header isBack={true} title={params.name}/>
                <View style={styles.video}>
                    <View style={styles.video_wrapper}>
                        <View style={styles.video_txt_wrap}>
                            <Text style={styles.video_txt}>当前视频：</Text>
                            <Text style={styles.video_txt}>{this.state.nowVideo.remark || ''}</Text>
                        </View>
                        <View style={styles.video_options}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={[styles.video_icon, {marginHorizontal: scaleSize(30)}]}
                                onPress={() => {
                                }}>
                                <Image style={styles.video_icon}
                                       source={require("../../../assets/resource/shop/icon_screen.png")}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.video_icon}
                                onPress={() => {
                                }}>
                                <Image style={styles.video_icon}
                                       source={require("../../../assets/resource/shop/icon_full_screen.png")}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={this.state.videoList}
                    style={styles.video_list}
                    numColumns={2}
                    columnWrapperStyle={styles.video_item}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}/>
                <Button block style={styles.footer_btn}>
                    <Text style={{color: whiteColor}}>进入考评</Text>
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor,
    },
    video: {
        position: 'relative',
        height: scaleSize(456),
        backgroundColor: '#000',
    },
    video_wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: scaleSize(40),
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(80),
        backgroundColor: 'rgba(72,123,225,0.3)'
    },
    video_txt_wrap: {
        flex: 1,
        flexDirection: 'row',
    },
    video_txt: {
        color: whiteColor,
    },
    video_options: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    video_icon: {
        width: scaleSize(48),
        height: scaleSize(48),
    },

    video_list: {
        flex: 1,
    },
    video_item: {
        flex: 1,
        height: scaleSize(100),
    },
    center_item: {
        margin: scaleSize(10),
        marginVertical: scaleSize(20),
        alignSelf: 'center',
        width: scaleSize(298),
        height: scaleSize(70),
        borderStyle: 'solid',
        borderColor: garyColor,
        borderWidth: scaleSize(2),
    },

    footer_btn: {
        margin: scaleSize(40),
        borderRadius: scaleSize(10),
        backgroundColor: headerColor,
    }
})