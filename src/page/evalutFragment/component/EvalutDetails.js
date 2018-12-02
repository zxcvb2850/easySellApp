/*
* 考评详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Modal} from "react-native"
import {Content, Button} from "native-base";
import Accordion from 'react-native-collapsible/Accordion'
import Header from "../../../components/Header";
import commonStyle from "../../../common/commStyle"
import {scaleSize} from "../../../common/screenUtil";
import {backgroundColor, headerColor, lightGaryColor, whiteColor} from "../../../common/styles";
import {getPlanDetails, saveAll, saveSingle, uploadImage} from "../../../api/evaluReq";
import {showToast} from "../../../common/util";
import {BASE_URL} from "../../../config/config";

/*mobx*/
import {observer, inject} from 'mobx-react'
import {action, computed} from 'mobx'

@inject("store")
@observer
export default class EvalutDetails extends React.Component {
    @action//列表
    setList(list) {
        console.log('-----------------------', list);
        this.props.store.EvalutList.setEvalutList(list)
    }

    @action//当前Index
    setIndex(index) {
        this.props.store.EvalutIndex.setEvalutIndex(index)
    }

    @computed get getEvalutList() {
        return this.props.store.EvalutList.evalutList;
    }

    constructor(props) {
        super()
        this.state = {
            activeSections: [],
            data: [],
            modalVisible: false,//确认提交全部弹窗
        }
        this._getPlanDetails(props.navigation.state.params.reviewId)
    }

    /*提交报告*/
    confirmReport = async (section, bool) => {
        //console.log(section, bool)
        /*if (section.checkResult == 1) {
            if (!bool) {
                return false;
            }
        }
        if (section.checkResult == 2) {
            if (bool) {
                return false;
            }
        }*/
        let imgs = ""
        let msg = ""
        if (section.imgs.length) {
            imgs = section.imgs.join(',')
        }
        if (section.msg) {
            msg = section.msg
        }
        await saveSingle(section.reviewProjectId, section.reviewId, section.storeId, section.projectCode, section.projectType, section.projectRequire, bool, msg, imgs);
        showToast('提交成功', 'success')
        this._getPlanDetails(this.props.navigation.state.params.reviewId);
    }

    /*提交所有*/
    confirmReportAll = () => {
        this.setState({modalVisible: true})
    }

    /*确认提交*/
    confirmAll = async () => {
        let list = []
        this.state.data.forEach(item => {
            //console.log(item)
            list.push({
                reviewProjectId: item.reviewProjectId,
                reviewId: item.reviewId,
                storeId: item.storeId,
                projectCode: item.projectCode,
                projectType: item.projectType,
                projectRequire: item.projectRequire,
                checkResult: item.checkResult,
                exception: item.msg,
                photos: item.imgs.join(',')
            })
        })
        let result = await saveAll(list);
        if (result.code !== 0) {
            showToast('提交失败', 'error')
        } else {
            showToast('提交成功', 'success')
        }
        this.setState({modalVisible: false})
        this._getPlanDetails(this.props.navigation.state.params.reviewId);
    }

    /*关闭提示框*/
    closeModal = () => {
        this.setState({modalVisible: false})
    }

    _getPlanDetails = async (reviewId) => {
        let result = await getPlanDetails(reviewId)
        /*
        *checkResult
        * 1新建
        * 2完成
        * 3例外
        * 4
        * */
        console.log(result)
        let list = result.storeReview.projectList

        let map = {},
            dest = [];
        for (let i = 0; i < list.length; i++) {
            let ai = list[i];
            if (!map[ai.projectType]) {
                dest.push({
                    reviewProjectId: ai.reviewProjectId,
                    projectType: ai.projectType,
                    data: [ai]
                });
                map[ai.projectType] = ai;
            } else {
                for (let j = 0; j < dest.length; j++) {
                    let dj = dest[j];
                    if (dj.projectType === ai.projectType) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        this.setState({data: dest})
    }

    _updateSections = activeSections => {
        this.setState({activeSections});
    };

    render() {
        return (
            <View style={styles.container}>
                <Header isBack title={"考评"}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.icon_confirm, styles.confirm_total]}
                        onPress={this.confirmReportAll}
                    >
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={this.closeModal}
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,.5)'
                    }}>
                        <View style={{
                            position: 'relative',
                            width: scaleSize(500),
                            height: scaleSize(300),
                            backgroundColor: whiteColor,
                            borderRadius: scaleSize(20),
                        }}>
                            <View style={styles.tips_text}>
                                <Text style={{color: '#000'}}>确定提交全部吗!</Text>
                            </View>
                            <View style={styles.btn_wrapper}>
                                <Button light style={styles.btn_item}
                                        onPress={this.closeModal}><Text style={{color: '#000'}}>取消</Text></Button>
                                <Button style={styles.btn_item} onPress={this.confirmAll}><Text
                                    style={{color: whiteColor}}>确认</Text></Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
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
        const {params} = this.props.navigation.state
        return section.data.map((item, i) => (
            <View key={item.reviewProjectId} style={[styles.content, {
                marginBottom: isActive ? scaleSize(20) : scaleSize(0)
            }]}>
                <View style={styles.content_item}>
                    <Text style={{fontSize: 14, marginRight: scaleSize(10)}}>{item.projectCode}</Text>
                    <View style={styles.content_desc}>
                        <Text onPress={() => {
                            let data = [];
                            this.state.data.forEach(v => {
                                v.data.forEach(_v => data.push(_v))
                            })
                            this.setList(data);//mobx保存当前考评的列表
                            //console.log(this.state.data, section, index, item, i);
                            let _index = this.getEvalutList.findIndex(v => v.reviewProjectId === item.reviewProjectId);
                            this.setIndex(_index);
                            this.props.navigation.navigate("EvalutItem", {callback: () => this._getPlanDetails(params.reviewId)})
                        }}>{item.projectData}</Text>
                    </View>
                </View>
            </View>
        ))
    };
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
        padding: scaleSize(20),
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

    tips_text: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_wrapper: {
        flexDirection: 'row',
        height: scaleSize(80),
    },
    btn_item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(80)
    }
})
