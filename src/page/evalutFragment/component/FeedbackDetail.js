/**
 * 列外详情
 * */
import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity, AsyncStorage, BackHandler} from "react-native";
import {Content, Button, Item,} from "native-base"
import Header from "../../../components/Header";
import TextInputZH from "../../../components/TextInputZH"
import {DEVICE_WIDTH, scaleSize} from "../../../common/screenUtil";
import {BASE_URL} from "../../../config/config";
import {showToast} from "../../../common/util";
import ImagePicker from "react-native-image-picker"
import {exceptionFollow, exceptionSave, uploadImage} from "../../../api/evaluReq";
import {garyColor} from "../../../common/styles";
import CustomImage from "../../../components/CustomImage";

/*mobx*/
import {inject, observer} from "mobx-react";
import {computed} from "mobx";

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

@inject('store')
@observer
export default class FeedbackDetail extends React.Component {
    @computed get userInfo() {
        return this.props.store.UserInfo.userInfo;
    }

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
            data: {},//列外数据
            imgs: "",//添加的图片
            value: "",
        }

        this._exceptionFollow()
    }

    _exceptionFollow = async () => {
        const {params} = this.props.navigation.state
        let result = await exceptionFollow(params.reviewProjectId);
        console.log(result);
        this.setState({data: result.storeReviewProject})
    }

    /**/
    _changeText = (value) => {
        console.log(value)
        this.setState({value})
    }

    /*上传图片*/
    choosePic = () => {
        ImagePicker.showImagePicker(options, async (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                //console.log('用户取消了选择！');
            } else if (response.error) {
                alert("ImagePicker发生错误：" + response.error);
            } else if (response.customButton) {
                alert("自定义按钮点击：" + response.customButton);
            } else {
                let imgArr = this.state.imgs;
                let imgs = imgArr ? imgArr.split(",") : []
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let uri = await uploadImage(response.uri, response.fileName);
                console.log(imgs, uri, response.uri);
                showToast('上传成功', 'success')
                imgs.push(uri.imgUrl)
                imgArr = imgs.join(",")
                this.setState({imgs: imgArr})
            }
        });
    }

    /*删除图片*/
    deleteImage = (zIndex) => {
        console.log(zIndex);
        let imgArr = this.state.imgs;
        let imgs = imgArr.split(",")
        imgs.splice(zIndex, 1)
        imgArr = imgs.join(",")
        this.setState({imgs: imgArr})
    }

    /*保存*/
    exceptionSave = async (bool) => {
        if (!bool) {
            if (this.state.value == null) {
                return showToast("请输入不合格备注", "warning")
            }
            if (this.state.imgs == null) {
                return showToast("请上传不合格图片", "warning")
            }
        }
        let userInfo = this.userInfo;
        console.log(this.state.data)
        console.log(this.state.data.reviewProjectId, this.state.data.reviewId, this.state.data.storeId, userInfo.userId, userInfo.fullname, bool ? 2 : 1, this.state.value || "", this.state.imgs || "")
        await exceptionSave(this.state.data.reviewProjectId, this.state.data.reviewId, this.state.data.storeId, userInfo.userId, userInfo.fullname, bool ? 2 : 1, this.state.value || "", this.state.imgs || "")
        showToast("保存成功", "success")
        await this.setState({value: "", imgs: ""})
        this._exceptionFollow();
    }

    render() {
        const {params} = this.props.navigation.state;

        return (
            <View style={{flex: 1}}>
                <Header isBack={this.onBackPress} title={"例外跟踪"}/>
                <View>
                    <Text>{this.state.data.projectType}</Text>
                    <Text>{this.state.data.exception}</Text>
                    <Text>{this.state.data.projectArea}</Text>
                    <Text>{this.state.data.projectCode}</Text>
                    <Text>{this.state.data.projectData}</Text>
                    <Text>{this.state.data.projectRequire}</Text>
                </View>
                <Content>
                    {this.followList()}
                    {
                        this.state.data.exceptionStatus && this.state.data.exceptionStatus !== 2 ?
                            <View>
                                <View style={styles.comment}>
                                    <View style={styles.image_wrap}>
                                        {this.showImages()}
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            style={[styles.image]}
                                            onPress={() => this.choosePic()}
                                        >
                                            <Image
                                                source={require("../../../assets/resource/evalut/icon_add.png")}
                                                style={{width: scaleSize(170), height: scaleSize(95)}}/>
                                        </TouchableOpacity>
                                    </View>
                                    <Item style={styles.input_wrap}>
                                        <Image style={{width: scaleSize(48), height: scaleSize(48)}}
                                               source={require("../../../assets/resource/evalut/icon_comment.png")}/>
                                        <TextInputZH
                                            placeholder="请输入备注"
                                            editable={true}//是否可编辑
                                            style={styles.inputStyle}//input框的基本样式
                                            value={this.state.value}
                                            onChangeText={(value) => {
                                                this._changeText(value)
                                            }}//输入框改变触发的函数
                                        />
                                    </Item>
                                </View>
                                < View style={styles.btn_wrapper}>
                                    < Button light style={styles.btn} onPress={() => {
                                        this.exceptionSave(true)
                                    }}>
                                        <Text>合格</Text>
                                    </Button>
                                    <Button light style={styles.btn} onPress={() => {
                                        this.exceptionSave(false)
                                    }}>
                                        <Text>不合格</Text>
                                    </Button>
                                </View>
                            </View>
                            : null
                    }
                </Content>
            </View>
        );
    }

    followList = () => this.state.data.followList && this.state.data.followList.map((item, index) =>
        <View key={item.followId} style={{marginLeft: scaleSize(20 * index)}}>
            <Text>{index + 1}</Text>
            <Text>{item.projectCode}</Text>
            <Text>修改时间：{item.createTime}</Text>
            <Text>操作人：{item.follower}</Text>
            <View>
                <View style={styles.image_wrap}>
                    {
                        item.followPhotos && item.followPhotos.split(",").map((v, i) => (
                            <CustomImage
                                key={i}
                                style={styles.image}
                                image={BASE_URL + v}
                            />)
                        )
                    }
                </View>
                <Text style={{color: '#F00'}}>{item.followDesc}</Text>
            </View>
        </View>
    )

    showImages = () => {
        let show = this.state.imgs ? this.state.imgs.split(",").map((v, i) => (
            <View key={i} style={styles.image_item}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.delete_icon, {
                        position: 'absolute',
                        right: scaleSize(12),
                        top: scaleSize(12),
                        zIndex: 1,
                    }]}
                    onPress={() => this.deleteImage(i)}
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