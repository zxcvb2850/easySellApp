/*
* 考评详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity, TextInput} from "react-native"
import {Content} from "native-base";
import Accordion from 'react-native-collapsible/Accordion'
import Header from "../../../components/Header";
import commonStyle from "../../../common/commStyle"
import {scaleSize} from "../../../common/screenUtil";
import {backgroundColor, headerColor, lightGaryColor, whiteColor} from "../../../common/styles";
import {getPlanDetails} from "../../../api/evaluReq";


//图片选择器参数设置
const options = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '图片库',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class EvalutDetails extends React.Component {
    constructor(props) {
        super()
        this.state = {
            activeSections: [],
            data: [],
            showValue: '',
            avatarSource: null,//图片地址
        }
        this._getPlanDetails(props.navigation.state.params.reviewId)
    }

    choosePic = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('用户取消了选择！');
            }
            else if (response.error) {
                alert("ImagePicker发生错误：" + response.error);
            }
            else if (response.customButton) {
                alert("自定义按钮点击：" + response.customButton);
            }
            else {
                let source = {uri: response.uri};
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    avatarSource: source
                });
            }
        });
    }

    _onChangeText(inputData) {
        console.log("输入的内容", inputData);
        //把获取到的内容，设置给showValue
        this.setState({showValue: inputData});
    }

    _getPlanDetails = async (reviewId) => {
        let result = await getPlanDetails(reviewId)
        console.log(result);
        this.setState({data: result.storeReview.projectList})
    }

    _renderHeader = (section, index, isActive, sections) => {
        return (
            <View
                style={[styles.header, commonStyle.borderTopBottom, {
                    backgroundColor: (isActive ? whiteColor : backgroundColor),
                    marginBottom: isActive ? scaleSize(0) : scaleSize(20)
                }]}>
                <Text style={styles.header_text}>{section.projectType}</Text>
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
                    <Text style={{fontSize: 14, marginRight: scaleSize(10)}}>{section.projectCode}</Text>
                    <View style={styles.content_desc}>
                        <Text>{section.projectData}</Text>
                    </View>
                </View>
                <View style={styles.comment}>
                    <View>
                        <Text style={styles.item} onPress={this.choosePic}>选择照片</Text>
                        <Image source={this.state.avatarSource} style={styles.image}/>
                    </View>
                    <View style={styles.input_wrap}>
                        <TextInput
                            placeholder="请输入用户名"
                            editable={true}//是否可编辑
                            style={styles.inputStyle}//input框的基本样式
                            onChangeText={this._onChangeText}//输入框改变触发的函数
                        />
                        <Image style={{width: scaleSize(48), height: scaleSize(48)}}
                               source={require("../../../assets/resource/evalut/icon_comment.png")}/>
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
                <Content style={styles.center}>
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
                </Content>
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
    },

    comment: {},
    input_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(100),
    },
    inputStyle: {
        paddingHorizontal: scaleSize(40),
        flex: 1,
    }
})