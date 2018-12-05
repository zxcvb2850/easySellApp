/*
* 店铺
* */
import React from "react"
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    TextInput,
    AsyncStorage,
    BackHandler
} from "react-native"
import Header from "../../components/Header"
import {garyColor, headColor, headerColor, mainColor, whiteColor} from "../../common/styles"
import {Drawer, Button, List, ListItem, Left, Right, Icon, Content} from "native-base"
import HeaderAttach from "../../components/HeaderAttach"
import {scaleSize} from "../../common/screenUtil";
import {dialPhone, showToast} from "../../common/util"
import DeployStatus from "../../components/DeployStatus";
import StoreStatus from "../../components/StoreStatus";
import {getOrgList, getStoreList, isCollection} from "../../api/storeReq";
import EvalutDetails from "../evalutFragment/component/EvalutDetails";
import Modal from 'react-native-modalbox'

export default class DynamicIndex extends React.Component {
    componentWillUnmount() {
        /*移除监听返回按钮*/
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillMount() {
        /*监听返回按钮*/
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    /*如果modal开启则需关闭*/
    onBackPress = () => {
        if (this.state.isOpen) {
            this.setState({isOpen: false})
            return true;
        } else {
            return false;
        }
    }

    constructor() {
        super()
        this.state = {
            list: [],
            filter: {
                sidx: '',
                order: '',
                storeCode: '',
            },
            filterList: [],//筛选列表
            page: 1,//当前页码
            refreshing: false,//上拉是否在加载数据
            isStatus: true,//下拉是否在加载数据
            isLoreTextStatus: true,
            isLoreText: '正在加载中...',//上拉加载提示文字
            isCollect: false,//是否收藏
            isOpen: false,//是否展示搜索框
            value: "",//搜索框内容
            historyList: [],
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
        let result = await getStoreList(page, this.state.filter.sidx, this.state.filter.order, this.state.filter.storeCode, this.state.value, this.state.isCollect ? 1 : 0);
        console.log(result.page.list);
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
            this.getMoreList();
        }
    }

    getMoreList = () => {
        if (!this.state.isStatus) {
            this.setState({isStatus: true, page: this.state.page + 1})
            this._getStoreList(this.state.page + 1)
        }
    }

    /*全部*/
    allClick = async () => {
        let filter = {
            sidx: '',
            order: '',
            storeCode: '',
        }
        await this.setState({filter, value: ""})
        this._getStoreList();
    }
    /*打开搜索框*/
    search = async () => {
        console.log("搜索");
        let list = await AsyncStorage.getItem('shop_store_search')
        this.setState({isOpen: true, historyList: JSON.parse(list)})
    }
    /*搜索内容*/
    searchText = async () => {
        if (this.state.value !== "") {
            let searchContent = await AsyncStorage.getItem("shop_store_search") || "[]";
            searchContent = JSON.parse(searchContent);
            let index = searchContent.findIndex(item => item === this.state.value);
            if (index !== -1) {
                searchContent.splice(index, 1)
                searchContent.unshift(this.state.value);
            } else {
                if (searchContent.length > 15) {
                    searchContent.pop();
                }
                searchContent.unshift(this.state.value);
            }
            this.setState({isOpen: false})
            this._getStoreList();
            AsyncStorage.setItem("shop_store_search", JSON.stringify(searchContent))
        }
    }
    /*删除历史的Item*/
    deleteSearchHistory = async (index) => {
        let result = await AsyncStorage.getItem("shop_store_search");
        result = JSON.parse(result);
        result.splice(index, 1);
        this.setState({historyList: result});
        AsyncStorage.setItem("shop_store_search", JSON.stringify(result));
    }

    filter = async () => {
        let result = await getOrgList()
        this.setState({filterList: result.orgList})
        this.openDrawer();
    }

    /*点赞*/
    itemIconLick = async (item, index) => {
        await isCollection(item.storeId)
        let list = this.state.list
        list[index].isCollection = !item.isCollection
        this.setState({list})
    }

    /*前往计划考评列表*/
    itemIconTrend = (item) => {
        this.props.navigation.navigate("EvalutDetails", {storeId: item.storeId})
    }

    itemIconPhone = (phoen) => {
        //console.log("打电话", phoen);
        dialPhone(phoen)
    }

    itemHeadIcon = (item) => {
        //console.log("更多");
        this.props.navigation.navigate('ShopDetail', {storeId: item.storeId, storeName: item.storeName})
    }

    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    gotoVideo = (item, val) => {
        if (!item.inUse) {
            this.props.navigation.navigate('ShopVideo', {
                videoInfo: val,//当前视频信息
                storeId: item.storeId,
                storeName: item.storeName
            });
        } else {
            showToast('视频不能播放');
        }
    }
    /*点击筛选*/
    clickFilterItem = (item) => {
        if (item.parentId > -1) {
            console.log(item.orgId)
            let filter = {
                sidx: '',
                order: '',
                storeCode: item.orgId,
            }
            this.setState({filter, value: item.name})
            setTimeout(() => {
                this._getStoreList();
                this.closeDrawer();
            })
        }
    }

    /*筛选是否收藏*/
    collectHand = async () => {
        await this.setState({isCollect: !this.state.isCollect})
        this._getStoreList();
        this.closeDrawer();
    }

    render() {
        return (
            <Drawer
                ref={(ref) => {
                    this.drawer = ref;
                }}
                side={"right"}
                openDrawerOffset={0.6}
                panCloseMask={0.6}
                content={
                    <View style={{flex: 1, backgroundColor: '#FFF'}}>
                        <View>
                            <Text onPress={this.collectHand}
                                  style={[styles.drawer_text, {color: this.state.isCollect ? mainColor : '#000'}]}>收藏</Text>
                        </View>
                        {this.filterList(this.state.filterList)}
                    </View>}
                onClose={() => this.closeDrawer()}>
                <View style={styles.container}>
                    <Header title={"店铺"} statusColor={this.state.isOpen ? garyColor : headerColor}>
                        <HeaderAttach
                            all={this.allClick}
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
                <Modal isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})}
                       style={[styles.modal, {backgroundColor: 'rgba(0,0,0,.3)'}]} position={"center"}>
                    <View style={styles.modal_center}>
                        <TextInput
                            placeholder="请输入备注"
                            placeholderTextColor={whiteColor}
                            editable={true}//是否可编辑
                            style={styles.inputStyle}//input框的基本样式
                            value={this.state.value}
                            onChangeText={(value) => {
                                this.setState({value})
                            }}//输入框改变触发的函数
                        />
                        <Button style={styles.search_btn} light onPress={this.searchText}>
                            <Icon name="search"/>
                        </Button>
                    </View>
                    <Content style={styles.search_history}>
                        <List>{this.searchHistory()}</List>
                    </Content>
                </Modal>
            </Drawer>
        )
    }

    filterList = (arr) => arr.map(item => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.clickFilterItem(item)}
            key={item.orgId} style={{marginLeft: scaleSize((item.parentId + 1) * 10)}}>
            <Text style={styles.drawer_text}>{item.name}</Text>
            {this.filterList(item.list)}
        </TouchableOpacity>
    ))

    searchHistory = () => this.state.historyList && this.state.historyList.map((item, index) => (
        <ListItem key={item} onPress={async () => {
            await this.setState({value: item})
            this.searchText();
        }}>
            <Left>
                <Text style={styles.whiteColor}>{item}</Text>
            </Left>
            <Right>
                <Icon style={{color: mainColor}} onPress={() => {
                    this.deleteSearchHistory(index)
                }} name="trash"/>
            </Right>
        </ListItem>
    ))


    _keyExtractor = (item) => item.storeId + ''

    _renderItem = ({item, index}) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.list_item}
            onPress={() => this.itemHeadIcon(item)}
        >
            <View style={styles.item_header}>
                <Text style={styles.item_head_title}>{item.storeName}</Text>
                <View style={styles.item_head_icon}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.head_icon}
                        onPress={() => this.itemIconLick(item, index)}>
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
                        onPress={() => this.itemIconTrend(item)}>
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
                        onPress={() => this.itemHeadIcon(item)}>
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
                </View>
                <View style={styles.body_center}>
                    {
                        item.channelList.length ?
                            item.channelList.map((value, index) => {
                                if (index < 4) {
                                    return <Button key={value.channelId} light
                                                   style={[styles.center_item, {borderColor: value.inUse ? 'rgba(0,0,0,.1)' : garyColor}]}
                                                   onPress={() => this.gotoVideo(item, value)}>
                                        {
                                            value.inUse ?
                                                <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                                                       source={require("../../assets/resource/shop/icon_video_offine.png")}/>
                                                :
                                                <Image style={{width: scaleSize(43), height: scaleSize(43)}}
                                                       source={require("../../assets/resource/shop/icon_video_online.png")}/>
                                        }
                                        <Text style={{color: value.inUse ? garyColor : '#000'}}>{value.remark}</Text>
                                    </Button>
                                }
                            })
                            : <Text>暂无摄像信息</Text>
                    }
                </View>
                {
                    item.channelList.length > 4 ?
                        <Text style={styles.more_text} onPress={() => {
                            this.props.navigation.navigate('ShopVideo', {
                                storeId: item.storeId,
                                storeName: item.storeName
                            })
                        }}>查看更多（{item.channelList.length - 4}）</Text>
                        : null
                }
                <View style={[styles.body_head, {
                    borderTopColor: garyColor,
                    borderTopWidth: scaleSize(1),
                }]}>
                    <View style={styles.body_left}>
                        <Text>通道信息</Text>
                        <DeployStatus status={Number(item.armingState)}/>
                    </View>
                    <Text style={{color: garyColor}}>信息 ></Text>
                </View>
            </View>
        </TouchableOpacity>
    )

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
    whiteColor: {
        color: whiteColor
    },

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
    more_text: {
        height: scaleSize(60),
        textAlign: 'center',
    },
    center_item: {
        margin: scaleSize(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: scaleSize(298),
        height: scaleSize(70),
        borderStyle: 'solid',
        borderWidth: scaleSize(2),
    },
    body_footer: {},

    modal_center: {
        marginVertical: scaleSize(20),
        paddingHorizontal: scaleSize(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputStyle: {
        flex: 1,
        color: whiteColor,
        fontSize: 18,
    },
    search_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: scaleSize(150),
        height: scaleSize(80),
        borderRadius: scaleSize(100),
        backgroundColor: mainColor,
    },
    search_history: {
        flex: 1,
    },
    drawer_text: {
        fontSize: 18,
        paddingHorizontal: scaleSize(20),
    }
})
