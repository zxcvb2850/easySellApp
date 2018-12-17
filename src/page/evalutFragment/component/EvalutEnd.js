/**
 * 已完结的项目
 * */
import React from "react";
import {StyleSheet, View, Text, Image} from "react-native"
import {Content} from "native-base"
import Header from "../../../components/Header";
import {getHistoryDetail} from "../../../api/evaluReq"
import {backgroundColor, headerColor, lightGaryColor, whiteColor} from "../../../common/styles"
import Accordion from 'react-native-collapsible/Accordion'
import {classify} from "../../../common/util"
import commonStyle from "../../../common/commStyle"
import {scaleSize} from "../../../common/screenUtil"
import {BASE_URL} from "../../../config/config";
import CustomImage from "../../../components/CustomImage";

export default class EvalutEnd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            storeInfo: {},//店铺详情
            storeEvalut: [],//店铺考评详情
            activeSections: [],
            normal: 0,//正常个数
            other: 0,//列外个数
            not: 0,//不合适
        }
        this._getHistoryDetail()
    }

    _getHistoryDetail = async () => {
        let result = await getHistoryDetail(this.props.navigation.state.params.reviewId)
        let dest = []
        if (result.storeReview.projectList.length) {
            dest = classify(result.storeReview.projectList)
        }
        let a = 0, b = 0, c = 0
        result.storeReview.projectList.forEach(item => {
            if (item.checkResult === 2) {
                a++
            }
            if (item.checkResult === 3) {
                b++
            }
            if (item.checkResult === 4) {
                c++;
            }
        })
        this.setState({
            storeInfo: result.storeReview,
            storeEvalut: dest,
            normal: a,
            other: b,
            not: c,
        })
        console.log(dest)
    }

    _updateSections = activeSections => {
        this.setState({activeSections});
    };

    render() {
        let {params} = this.props.navigation.state
        return (
            <View style={styles.container}>
                <Header isBack title={"考评详情"}/>
                <Content style={styles.container}>
                    <View>
                        <Text>店名：{this.state.storeInfo.storeName}</Text>
                        <Text>考评时间：{this.state.storeInfo.updateTime}</Text>
                        <Text>考评人：{this.state.storeInfo.reviewer}</Text>
                        <Text>检查项目：{this.state.storeEvalut.length}</Text>
                        <Text>正常数：{this.state.normal}</Text>
                        <Text>列外数：{this.state.other}</Text>
                        <Text>不适用数：{this.state.not}</Text>
                    </View>

                    <Accordion
                        style={{backgroundColor: whiteColor}}
                        sections={this.state.storeEvalut}
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
    }

    _renderContent = (section, index, isActive, sections) => {
        console.log('++++++++++', section)
        return section.data.map((item) => (
            <View key={item.reviewProjectId}>
                <View>
                    <Text>{item.projectCode}</Text>
                    <Text>{item.projectData}</Text>
                    <Text>{item.projectRequire}</Text>
                    <View style={styles.image_wrap}>
                        {
                            item.photos && item.photos.split(',').map(v => (
                                <CustomImage
                                    key={v}
                                    style={styles.image}
                                    image={BASE_URL + v}
                                />
                            ))
                        }
                    </View>
                    {this.followList(item)}
                </View>
            </View>
        ))
    }

    followList = (item) => {
        let renderList = null;
        if (item.followList.length) {
            renderList = item.followList.map((v, i) =>
                <View key={v.followId} style={{marginLeft: scaleSize(20 * i)}}>
                    <Text>{v.createTime}</Text>
                    <Text style={styles.colofollowListr_red}>{v.followDesc}</Text>
                    <View styles={styles.image_wrap}>
                        {v.followPhotos && this.showImage(v.followPhotos)}
                    </View>
                </View>
            )
        }

        return renderList;
    };

    showImage = (value) => {
        let imgs = value.split(",");
        return imgs.map((item, index) => <CustomImage key={index} image={item} style={styles.image}/>)
    }
}

const styles = StyleSheet.create({
    color_red: {
        color: '#F00',
    },

    container: {
        flex: 1,
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
    image_wrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        margin: scaleSize(10),
        width: scaleSize(170),
        height: scaleSize(95)
    },
})
