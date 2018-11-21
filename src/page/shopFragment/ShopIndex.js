/*
* 店铺
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity, FlatList, RefreshControl} from "react-native"
import Header from "../../components/Header"
import {garyColor, headColor, whiteColor} from "../../common/styles"
import {Drawer, Button, Icon, Content} from "native-base"
import HeaderAttach from "../../components/HeaderAttach"
import {scaleSize} from "../../common/screenUtil";
import {showToast} from "../../common/util"
import DeployStatus from "../../components/DeployStatus";
import StoreStatus from "../../components/StoreStatus";
import {getStoreList} from "../../api/storeReq";

export default class DynamicIndex extends React.Component {
    constructor() {
        super()
        this.state = {
            list: [],
            filter: {
                sidx: '',
                order: '',
                storeCode: '',
                storeName: '',
            },
            page: 1,//当前页码
            refreshing: false,//是否在加载数据
            isStatus: true,
            isLoreTextStatus: true,
            isLoreText: '正在加载中...',//上拉加载提示文字
        }

        this._getStoreList();
    }

    Refresh = () => {
        this.setState({
            page: 1,
            refreshing: true,
            isLoreText: '正在加载...'
        });
        this._getStoreList(1, true)
    }

    _getStoreList = async (page = 1, isRefresh = false) => {
        let result = await getStoreList(page, this.state.filter.sidx, this.state.filter.order, this.state.filter.storeCode, this.state.filter.storeName);
        if (page === 1) {
            if (result.page.list.length) {
                this.setState({list: result.page.list});
            } else {
                this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
            }
        } else if (result.page.list.length) {
            this.setState({list: this.state.list.concat(result.page.list)})
        } else {
            this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
        }
        this.setState({isStatus: false, isLoreTextStatus: false})
        if (isRefresh) {
            this.setState({refreshing: false})
        }
    }

    getMoreList = () => {
        if (!this.state.isStatus && this.state.isLoreTextStatus) {
            this.setState({isStatus: true, page: this.state.page + 1})
            this._getStoreList(this.state.page + 1)
        }
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

    itemIconLick = () => {
        console.log("点赞");
    }
    itemIconTrend = () => {
        console.log("趋势");
    }
    itemIconPhone = () => {
        console.log("打电话");
    }
    itemHeadIcon = () => {
        console.log("点赞");
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
    _keyExtractor = (item) => item.storeId + ''

    _renderItem = ({item}) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.list_item}
            onPress={() => {
                this.props.navigation.navigate('ShopDetail', {storeId: item.storeId})
            }}
        >
            <View style={styles.item_header}>
                <Text style={styles.item_head_title}>{item.storeName}</Text>
                <View style={styles.item_head_icon}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={this.itemIconLick}>
                        {
                            item.isCollection ?
                                <Image style={styles.icon}
                                       source={require("../../assets/resource/shop/icon_collection_yes.png")}/>
                                : <Image style={styles.icon}
                                         source={require("../../assets/resource/shop/icon_collection_not.png")}/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={this.itemIconTrend}>
                        <Image style={styles.icon} source={require("../../assets/resource/shop/icon_trend.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={() => this.itemIconPhone(item.storeTel)}>
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
                        <StoreStatus status={Number(item.videoState)}/>
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
                        <DeployStatus status={Number(item.armingState)}/>
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
                        data={this.state.list}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0.1}//执行上啦的时候10%执行
                        onEndReached={this.getMoreList}//获取更多数据
                        ListFooterComponent={this._renderFooter}//尾部
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.Refresh}
                                title="刷新中..."/>
                        }
                    />
                </View>
            </Drawer>
        )
    }

    _renderFooter = () => {
        return (
            <View style={{
                height: 44,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>{this.state.isLoreText}</Text>
            </View>
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
        flex: 1,
    },
    list_item: {
        marginHorizontal: scaleSize(22),
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