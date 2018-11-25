/*
*  店铺详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, Linking, TouchableOpacity} from "react-native"
import {List, ListItem, Button, Content} from "native-base"
import Header from "../../../components/Header"
import {scaleSize} from "../../../common/screenUtil"
import {garyColor, lightGaryColor, minFontSize, whiteColor} from "../../../common/styles"
import {dialPhone, showToast} from "../../../common/util"
import StoreStatus from "../../../components/StoreStatus";
import DeployStatus from "../../../components/DeployStatus";
import {getStoreDetails, getAlarmList} from "../../../api/storeReq";

export default class ShopDetail extends React.Component {
    constructor(props) {
        super()
        this.state = {
            shopData: {},//店铺信息
            linkmanList: [],//店员信息
        }

        this._getShopDetail(props.navigation.state.params.storeId)
    }

    componentDidMount() {
        //console.log(this.props.navigation.state.params)
    }

    /*店铺详情查询*/
    _getShopDetail = async (id) => {
        let result = await getStoreDetails(id)
        console.log(result)
        this.setState({shopData: result.storeDetails, linkmanList: result.storeDetails.linkmanList})
    }
    /*报警信息获取*/
    _getAlarmList = async () => {
        let result = await getAlarmList(this.state.shopData.storeId)
        console.log(result)
        if (result.alarm.length) {
            this.props.navigation.navigate('alarmList', {
                data: result.data,
                storeName: this.props.navigation.state.params.storeName
            })
        } else {
            showToast('暂无报警信息')
        }
    }

    render() {
        const {params} = this.props.navigation.state;
        console.log('++++++', params)
        return (
            <View style={styles.container}>
                <Header isBack title={`店铺${params.storeName}详情`}/>
                <Content style={{flex: 1}}>
                    <View style={styles.list}>
                        <View style={[styles.list_item, styles.first]}>
                            <Text style={styles.color_back}>基本信息</Text>
                        </View>
                        <View style={[styles.list_item]}>
                            <Image style={styles.icon} source={require("../../../assets/resource/shop/icon_addr.png")}/>
                            <View style={styles.txt_wrap}>
                                <Text style={styles.item_txt}>地址：</Text>
                                <Text style={[styles.item_txt, {color: garyColor}]}>{this.state.shopData.address}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.goto_icon}
                                onPress={() => console.log("打开地图")}
                            >
                                <Image style={styles.goto_icon}
                                       source={require("../../../assets/resource/shop/icon_map.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.list_item]}>
                            <Image style={styles.icon}
                                   source={require("../../../assets/resource/shop/icon_phone_min.png")}/>
                            <View style={styles.txt_wrap}>
                                <Text style={styles.item_txt}>电话：</Text>
                                <Text style={[styles.item_txt, {color: garyColor}]}
                                      onPress={() => dialPhone(this.state.shopData.storeTel)}>{this.state.shopData.storeTel}</Text>
                            </View>
                        </View>
                        {
                            this.state.linkmanList.length ? this.state.linkmanList.map(item => (
                                    <View style={[styles.list_item]}>
                                        <Image style={styles.icon}
                                               source={require("../../../assets/resource/shop/icon_number.png")}/>
                                        <View style={styles.txt_wrap}>
                                            <Text style={styles.item_txt}>店员：</Text>
                                            <Text style={[styles.item_txt, {color: garyColor}]}
                                                  onPress={() => dialPhone(item.linkmanTel)}>{item.linkmanName}-{item.linkmanTel}</Text>
                                        </View>
                                    </View>
                                ))
                                :
                                <View style={[styles.list_item]}>
                                    <Image style={styles.icon}
                                           source={require("../../../assets/resource/shop/icon_number.png")}/>
                                    <View style={styles.txt_wrap}>
                                        <Text style={styles.item_txt}>店员：</Text>
                                    </View>
                                </View>
                        }
                    </View>
                    <View style={[styles.info, styles.borderTopBottom]}>
                        <View style={[styles.first, styles.title]}>
                            <Text style={styles.color_back}>考评信息</Text>
                        </View>
                        <View style={styles.figure}>

                        </View>
                    </View>
                    <View style={[styles.info_list, styles.borderTopBottom]}>
                        <Text style={styles.color_back}>视频监控</Text>
                        <StoreStatus style={{flex: 1, paddingHorizontal: scaleSize(10)}}
                                     status={this.state.videoState}/>
                        <Button bordered style={styles.more_btn}
                                onPress={() => {
                                    this.props.navigation.navigate('ShopVideo', {
                                        storeId: params.storeId,
                                        storeName: params.storeName
                                    })
                                }}>
                            <Text style={{fontSize: minFontSize}}>查看</Text>
                        </Button>
                    </View>
                    <View style={[styles.info_list, styles.borderTopBottom]}>
                        <Text style={styles.color_back}>报警联网</Text>
                        <DeployStatus style={{flex: 1, paddingHorizontal: scaleSize(10)}}
                                      status={this.state.armingState}/>
                        <Button bordered style={styles.more_btn}
                                onPress={this._getAlarmList}><Text
                            style={{fontSize: minFontSize}}>列表</Text></Button>
                    </View>
                </Content>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    borderTopBottom: {
        borderTopColor: lightGaryColor,
        borderBottomColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderBottomWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    color_back: {
        color: '#000',
    },

    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    list: {
        backgroundColor: whiteColor,
    },
    list_item: {
        marginHorizontal: scaleSize(50),
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(80),
        borderBottomColor: lightGaryColor,
        borderBottomWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    first: {
        marginHorizontal: 0,
        paddingHorizontal: scaleSize(30),
        height: scaleSize(88),
    },
    icon: {
        marginHorizontal: scaleSize(8),
        width: scaleSize(32),
        height: scaleSize(32)
    },
    txt_wrap: {
        flex: 1,
        flexDirection: 'row',
    },
    one: {
        marginLeft: scaleSize(120)
    },
    item_txt: {},
    goto_icon: {
        width: scaleSize(48),
        height: scaleSize(48)
    },

    info: {
        marginTop: scaleSize(26),
        height: scaleSize(384),
        backgroundColor: whiteColor,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleSize(80),
    },
    figure: {
        borderTopColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderStyle: 'solid',
        height: scaleSize(298),
    },

    info_list: {
        marginTop: scaleSize(24),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scaleSize(24),
        height: scaleSize(96),
        backgroundColor: whiteColor,
    },
    more_btn: {
        marginTop: scaleSize(22),
        width: scaleSize(112),
        height: scaleSize(52),
        justifyContent: 'center',
        alignItems: 'center'
    }
})
