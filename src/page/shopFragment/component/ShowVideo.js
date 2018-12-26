/*
* 监控页面
* */
import React from "react"
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StatusBar,
    BackHandler,
    DeviceEventEmitter,
    Platform
} from "react-native"
import {Button} from "native-base"
import {backgroundColor, garyColor, headerColor, whiteColor} from "../../../common/styles";
import Header from "../../../components/Header";
import {DEVICE_HEIGHT, DEVICE_WIDTH, scaleSize} from "../../../common/screenUtil";
import {getVideoDetail, getVideoList} from "../../../api/storeReq";
import Modal from "react-native-modal";
import AndroidPlayer from "../../../common/AndroidPlayer";
import IosPlayer from "../../../common/IosPlayer";
import Orientation from "react-native-orientation";
import {showToast} from "../../../common/util";

/*mobx*/
import {observer, inject} from "mobx-react";
import {action, computed} from "mobx";

@inject('store')
@observer
export default class ShowVideo extends React.Component {
    @action
    setPath(photo) {
        this.props.store.PhotoPath.setPhotoPath(photo);
    }

    @computed get getPhotoPath() {
        return this.props.store.PhotoPath.photoPath;
    }

    componentWillUnmount() {
        /*移除监听返回按钮*/
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillMount() {
        /*监听返回按钮*/
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

        DeviceEventEmitter.addListener('screenshots', (photo) => {
            showToast('----------' + photo)
            this.setState({
                isScreen: 0,
                screenImage: photo,
                isShowScreen: true
            });
        })
    }

    onBackPress = () => {
        if (this.state.isFull) {
            this.setState({isFull: false})
            Orientation.lockToPortrait()
            return true
        } else {
            return false
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            videoList: [],//视频列表
            nowVideo: {},//当前视频信息
            videoPath: "",//视频地址
            videoAddress: "",//视频地址
            videoPort: "",//视频端口
            vidoeCallid: "",//视频id
            videoResource: "",//视频资源
            videoStatus: 0,//视频状态
            isFull: false,//是否全屏
            isScreen: 0,//是否截屏
            screenImage: "",//截取的图片
            isShowScreen: false,//是否展示截图的图片
        }
        this._getVideoList(props.navigation.state.params.storeId)
        this.screenFull = this.screenFull.bind(this)
    }

    _getVideoList = async (id) => {
        let {params} = this.props.navigation.state
        let result = await getVideoList(id)
        console.log(result);
        await this.setState({
            videoList: result.video.channelList,
            nowVideo: params.videoInfo ? params.videoInfo : result.video.channelList[0]//当前是否接受到视频信息
        })
        this.videoChannel(this.state.nowVideo)
    }

    screenFull() {
        Orientation.getOrientation((err, orientation) => {
            if (orientation === "LANDSCAPE") {
                this.setState({isFull: false})
                Orientation.lockToPortrait()
            } else {
                this.setState({isFull: true})
                Orientation.lockToLandscape()
            }
        });
    }

    /*获取视频信息*/
    videoChannel = async (item) => {
        let result = await getVideoDetail(item.channelId)
        result = result.preview
        this.setState({
            videoAddress: result.address,
            videoPort: result.port,
            vidoeCallid: result.callid,
            videoResource: result.resource
        })
        if (result.address) {
            this.setState({
                videoPath: `${result.address}@port:${result.port}@callid:${result.callid}@resid:${result.resource}`
            })
        } else {
            showToast('暂无视频数据', 'error')
        }
        this.setState({nowVideo: item})
    }

    gotoEvalut = () => {
        this.props.navigation.navigate("EvalutDetails", {storeId: this.props.navigation.state.params.storeId})
    }

    submitScreen = async () => {
        if (this.state.screenImage !== "") {
            this.setPath(this.state.screenImage);
            this.gotoEvalut();
        } else {
            showToast("图片获取失败", "error");
        }
        await this.setState({isShowScreen: false})
    }

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.container}>
                {
                    this.state.isFull ?
                        <StatusBar hidden={true}/>
                        :
                        <Header hidden={this.state.isFull} isBack={true} title={"视频详情"}/>
                }
                <View style={[styles.video, {height: this.state.isFull ? DEVICE_WIDTH : scaleSize(456)}]}>
                    {/*视频播放*/}
                    <View style={[styles.video_center, {width: DEVICE_WIDTH}]}>
                        {
                            this.state.videoPath !== "" ?
                                Platform.OS === 'ios' ?
                                    <IosPlayer
                                        style={{
                                            width: this.state.isFull ? DEVICE_HEIGHT : DEVICE_WIDTH,
                                            height: this.state.isFull ? DEVICE_WIDTH : scaleSize(456)
                                        }}
                                        serverIP={this.state.videoAddress}
                                        serverPort={this.state.videoPort}
                                        callID={this.state.vidoeCallid}
                                        resID={this.state.videoResource}
                                        state='true'
                                    />
                                    :
                                    <AndroidPlayer
                                        style={{
                                            width: this.state.isFull ? DEVICE_HEIGHT : DEVICE_WIDTH,
                                            height: this.state.isFull ? DEVICE_WIDTH : scaleSize(456)
                                        }}
                                        snapshot={this.state.isScreen}
                                        path={this.state.videoPath}
                                        status={this.state.videoStatus}
                                    />
                                : null
                        }
                    </View>
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
                                    this.setState({isScreen: 100})
                                }}>
                                <Image style={styles.video_icon}
                                       source={require("../../../assets/resource/shop/icon_screen.png")}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.video_icon}
                                onPress={this.screenFull}>
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
                <Button block style={styles.footer_btn} onPress={this.gotoEvalut}>
                    <Text style={{color: whiteColor}}>进入考评</Text>
                </Button>
                {/*截屏成功团片弹出框*/}
                <Modal
                    isVisible={this.state.isShowScreen}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                    style={styles.modal}
                >
                    <View style={styles.modal_wrapper}>
                        {/*this.state.screenImage 截屏图片地址*/}
                        <Image
                            style={styles.modal_image}
                            source={{uri: this.state.screenImage}}
                        />
                        <View style={styles.modal_button}>
                            <Button
                                light
                                style={styles.modal_btn}
                                onPress={() => this.setState({isShowScreen: false})}
                            >
                                <Text>关闭</Text>
                            </Button>
                            <Button
                                light
                                style={styles.modal_btn}
                                onPress={this.submitScreen}
                            >
                                <Text>报告错误</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    _keyExtractor = (item) => item.channelId + ''

    _renderItem = ({item}) => (
        <View style={styles.video_item}>
            <Button block light
                    style={[styles.center_item, {borderColor: item.inUse ? 'rgba(0,0,0,.1)' : garyColor}]}
                    onPress={() => this.videoChannel(item)}>
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
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor,
        zIndex: 1,
    },
    video: {
        position: 'relative',
        height: scaleSize(456),
        backgroundColor: '#000',
        zIndex: 1000
    },
    video_center: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
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
        backgroundColor: 'rgba(72,123,225,0.3)',
        zIndex: 1001,
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
    },

    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal_wrapper: {
        width: scaleSize(500),
        height: scaleSize(700)
    },
    modal_image: {
        flex: 1,
        width: scaleSize(500),
        height: scaleSize(600),
    },
    modal_button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(100),
    },
    modal_btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(100),
    },
})
