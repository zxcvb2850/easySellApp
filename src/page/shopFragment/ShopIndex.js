/*
* 店铺
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity, FlatList} from "react-native"
import Header from "../../components/Header"
import {garyColor, headColor, lightGaryColor, successColor, warringColor, whiteColor} from "../../common/styles"
import {Drawer, Button, Icon, Content} from "native-base"
import HeaderAttach from "../../components/HeaderAttach"
import {scaleSize} from "../../common/screenUtil";
import {showToast} from "../../common/util"
import Status from "../../components/Status";
import {getStoreList} from "../../api/evaluReq";

export default class DynamicIndex extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}]
        }

        this._getStoreList();
    }

    _getStoreList = async () => {
        let reult = await getStoreList();
        console.log('------------', reult);
    }

    allClick = () => {
        //console.log("全部");
    }

    search = () => {
        //console.log("搜索");
    }

    filter = () => {
        //console.log("筛选");
        this.openDrawer();
    }

    itemHeadIcon = () => {
        //console.log("icon");
    }

    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    gotoVideo = (val) => {
        if (val) {
            this.props.navigation.navigate('ShopVideo', {name: '1030店铺'});
        } else {
            showToast('视频不能播放');
        }
    }
    _keyExtractor = (item) => item.id + ''

    _renderItem = ({item}) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.list_item}
            onPress={() => {
                this.props.navigation.navigate('ShopDetail', {shopId: item.id, shopName: '1030'})
            }}
        >
            <View style={styles.item_header}>
                <Text style={styles.item_head_title}>南区1030店</Text>
                <View style={styles.item_head_icon}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={this.itemHeadIcon}>
                        <Image style={styles.icon}
                               source={require("../../assets/resource/shop/icon_collection_not.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={this.itemHeadIcon}>
                        <Image style={styles.icon} source={require("../../assets/resource/shop/icon_trend.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={this.itemHeadIcon}>
                        <Image style={styles.icon} source={require("../../assets/resource/shop/icon_phone.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={this.itemHeadIcon}>
                        <Image style={styles.icon} source={require("../../assets/resource/shop/icon_more.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.item_body}>
                <View style={[styles.body_head, {
                    borderBottomColor: garyColor,
                    borderBottomWidth: scaleSize(1)
                }]}>
                    <View style={styles.body_left}>
                        <Text>视频监控</Text>
                        <Status status={2}/>
                    </View>
                    <Text style={{color: garyColor}} onPress={() => {
                        //console.log("更多监控")
                    }}>更多(15) ></Text>
                </View>
                <View style={styles.body_center}>
                    <Button light style={styles.center_item} onPress={() => this.gotoVideo(1)}>
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../assets/resource/shop/icon_video_online.png")}/>
                        <Text>收银台</Text>
                    </Button>
                    <Button light style={[styles.center_item, {borderColor: 'rgba(0,0,0,.1)'}]}
                            onPress={() => this.gotoVideo(0)}>
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../assets/resource/shop/icon_video_online.png")}/>
                        <Text>收银台</Text>
                    </Button>
                    <Button light style={styles.center_item} onPress={() => this.gotoVideo(1)}>
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../assets/resource/shop/icon_video_online.png")}/>
                        <Text>收银台</Text>
                    </Button>
                    <Button light style={styles.center_item} onPress={() => this.gotoVideo(1)}>
                        <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                               source={require("../../assets/resource/shop/icon_video_online.png")}/>
                        <Text>收银台</Text>
                    </Button>
                </View>
                <View style={[styles.body_head, {
                    borderTopColor: garyColor,
                    borderTopWidth: scaleSize(1),
                }]}>
                    <View style={styles.body_left}>
                        <Text>视频监控</Text>
                        <Status status={1}/>
                    </View>
                    <Text style={{color: garyColor}}>信息 ></Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    render() {
        return (
            <Drawer
                ref={(ref) => {
                    this.drawer = ref;
                }}
                side={"right"}
                openDrawerOffset={0.6}
                panCloseMask={0.6}
                content={<View style={{flex: 1, backgroundColor: '#FFF'}}><Text>122112222121</Text></View>}
                onClose={() => this.closeDrawer()}>
                <View style={styles.container}>
                    <Header title={"店铺"}>
                        <HeaderAttach
                            search={this.search}
                            filter={this.filter}/>
                    </Header>
                    <FlatList
                        style={styles.list}
                        data={this.state.data}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}/>
                </View>
            </Drawer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    icon: {
        width: scaleSize(48),
        height: scaleSize(48),
    },
    list: {
        paddingHorizontal: scaleSize(22),
        flex: 1,
    },
    list_item: {
        marginVertical: scaleSize(12),
        borderRadius: scaleSize(16),
        overflow: 'hidden',
    },
    item_header: {
        paddingHorizontal: scaleSize(26),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: headColor,
        height: scaleSize(72),
    },
    item_head_title: {
        color: whiteColor,
    },
    item_head_icon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    head_icon: {
        marginHorizontal: scaleSize(10),
    },
    item_body: {
        paddingHorizontal: scaleSize(14),
        backgroundColor: whiteColor,
    },
    body_head: {
        paddingVertical: scaleSize(24),
        flexDirection: 'row',
        borderStyle: 'solid',
    },
    body_left: {
        flex: 1,
        flexDirection: 'row',
    },
    body_center: {
        marginVertical: scaleSize(10),
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    center_item: {
        margin: scaleSize(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: scaleSize(298),
        height: scaleSize(70),
        borderStyle: 'solid',
        borderColor: garyColor,
        borderWidth: scaleSize(2),
    },
    body_footer: {},
})
