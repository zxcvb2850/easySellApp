/**
 * 列外详情
 * */
import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity, TextInput, AsyncStorage, BackHandler} from "react-native";
import {Content, Button} from "native-base"
import Header from "../../../components/Header";
import {DEVICE_WIDTH, scaleSize} from "../../../common/screenUtil";
import {BASE_URL} from "../../../config/config";
import {showToast} from "../../../common/util";
import ImagePicker from "react-native-image-picker"
import {exceptionSave, uploadImage} from "../../../api/evaluReq";
import {garyColor} from "../../../common/styles";

//图片选择器参数设置
const options = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '图片库',
    cameraType: 'back',
    mediaType: 'photo',
    maxWidth: 270,
    maxHeight: 195,
    videoQuality: 'high',
    storageOptions: {
        skipBackup: true,
    }
};

export default class FeedbackDetail extends React.Component {
    componentWillUnmount() {
        /*移除监听返回按钮*/
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillMount() {
        /*监听返回按钮*/
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
        const {params} = this.props.navigation.state;
        params.callback(true);
        this.props.navigation.goBack();
        return true;
    }

    constructor(props) {
        super(props)
        this.state = {
            imgs: [],//添加的图片
            value: [],
        }
    }

    /**/
    _changeText = (value, index) => {
        console.log(value, index)
        let val = this.state.value;
        val[index] = value;
        this.setState({value: val})
    }

    /*上传图片*/
    choosePic = (index) => {
        ImagePicker.showImagePicker(options, async (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                //console.log('用户取消了选择！');
            }
            else if (response.error) {
                alert("ImagePicker发生错误：" + response.error);
            }
            else if (response.customButton) {
                alert("自定义按钮点击：" + response.customButton);
            }
            else {
                let imgArr = this.state.imgs;
                let imgs = imgArr[index] ? imgArr[index].split(",") : []
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let uri = await uploadImage(response.uri, response.fileName);
                console.log(imgs, uri, response.uri);
                showToast('上传成功', 'success')
                imgs.push(uri.imgUrl)
                imgArr[index] = imgs.join(",")
                this.setState({imgs: imgArr})
            }
        });
    }

    /*删除图片*/
    deleteImage = (index, zIndex) => {
        console.log(index, zIndex);
        let imgArr = this.state.imgs;
        let imgs = imgArr[index].split(",")
        imgs.splice(zIndex, 1)
        imgArr[index] = imgs.join(",")
        this.setState({imgs: imgArr})
    }

    /*保存*/
    exceptionSave = async (index, bool) => {
        if (!bool) {
            if (this.state.value[index] == null) {
                return showToast("请输入不合格备注", "warning")
            }
            if (this.state.imgs[index] == null) {
                return showToast("请上传不合格图片", "warning")
            }
        }
        const {params} = this.props.navigation.state;
        let userInfo = await AsyncStorage.getItem('shop_info');
        let data = params.list[index]
        userInfo = JSON.parse(userInfo);
        console.log(data.reviewProjectId, data.reviewId, data.storeId, userInfo.userId, userInfo.fullname, bool ? 2 : 1, this.state.value[index] || "", this.state.imgs[index] || "")
        await exceptionSave(data.reviewProjectId, data.reviewId, data.storeId, userInfo.userId, userInfo.fullname, bool ? 2 : 1, this.state.value[index] || "", this.state.imgs[index] || "")
        showToast("保存成功", "success")
    }

    render() {
        const {params} = this.props.navigation.state;

        return (
            <View style={{flex: 1}}>
                <Header isBack={this.onBackPress} title={"例外跟踪"}/>
                <Content style={styles.container}>
                    <Text style={styles.title}>店铺名称：{params.storeName}</Text>
                    <View style={styles.content}>
                        {
                            params.list.length ?
                                params.list.map((item, index) => (
                                    <View key={item.reviewProjectId}>
                                        <View>
                                            <Text>{item.projectCode}</Text>
                                            <View>
                                                <Text>{item.projectData}</Text>
                                                <Text>{item.projectRequire}</Text>
                                                <View style={styles.image_wrap}>
                                                    {
                                                        item.photos && item.photos.split(",").map((v, i) => (
                                                            <Image key={i} style={styles.image}
                                                                   source={{uri: BASE_URL + v}}/>)
                                                        )
                                                    }
                                                </View>
                                                <Text style={{color: '#F00'}}>{item.exception}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.comment}>
                                            <View style={styles.image_wrap}>
                                                {this.showImages(index)}
                                                <TouchableOpacity
                                                    activeOpacity={0.9}
                                                    style={[styles.image]}
                                                    onPress={() => this.choosePic(index)}
                                                >
                                                    <Image
                                                        source={require("../../../assets/resource/evalut/icon_add.png")}
                                                        style={{width: scaleSize(170), height: scaleSize(95)}}/>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.input_wrap}>
                                                <TextInput
                                                    placeholder="请输入备注"
                                                    editable={true}//是否可编辑
                                                    style={styles.inputStyle}//input框的基本样式
                                                    value={this.state.value[index]}
                                                    onChangeText={(value) => {
                                                        this._changeText(value, index)
                                                    }}//输入框改变触发的函数
                                                />
                                                <Image style={{width: scaleSize(48), height: scaleSize(48)}}
                                                       source={require("../../../assets/resource/evalut/icon_comment.png")}/>
                                            </View>
                                        </View>
                                        <View style={styles.btn_wrapper}>
                                            <Button light style={styles.btn} onPress={() => {
                                                this.exceptionSave(index, true)
                                            }}>
                                                <Text>合格</Text>
                                            </Button>
                                            <Button light style={styles.btn} onPress={() => {
                                                this.exceptionSave(index, false)
                                            }}>
                                                <Text>不合格</Text>
                                            </Button>
                                        </View>
                                    </View>
                                ))
                                : null
                        }
                    </View>
                </Content>
            </View>
        )
    }

    showImages = (index) => {
        let show = this.state.imgs[index] ? this.state.imgs[index].split(",").map((v, i) => (
            <View key={i} style={styles.image_item}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.delete_icon, {
                        position: 'absolute',
                        right: scaleSize(12),
                        top: scaleSize(12),
                        zIndex: 1,
                    }]}
                    onPress={() => this.deleteImage(index, i)}
                >
                    <Image style={styles.delete_icon}
                           source={require("../../../assets/resource/evalut/icon_error_yes.png")}/>
                </TouchableOpacity>
                <Image source={{uri: BASE_URL + v}} style={styles.image}/>
            </View>
        )) : null
        return show;
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scaleSize(20),
        flex: 1,
    },

    title: {
        fontSize: 18,
    },
    content: {},
    image_wrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        margin: scaleSize(20),
        width: scaleSize(170),
        height: scaleSize(95)
    },
    comment: {
        marginTop: scaleSize(22)
    },
    input_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(100),
    },
    inputStyle: {
        paddingHorizontal: scaleSize(40),
        flex: 1,
    },
    delete_icon: {
        width: scaleSize(24),
        height: scaleSize(24),
    },

    btn_wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn: {
        marginHorizontal: scaleSize(20),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: garyColor,
        borderWidth: scaleSize(1),
        borderStyle: 'solid',
        width: scaleSize(200),
    },
})