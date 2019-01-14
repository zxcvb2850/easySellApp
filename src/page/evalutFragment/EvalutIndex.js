/*
* 考评
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList, AsyncStorage} from "react-native"
import {Content, ListItem, List, Left, Right, Icon, Button, Input} from "native-base"
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import Header from "../../components/Header"
import HeaderAttach from "../../components/HeaderAttach"
import {garyColor, mainColor, maxFontSize, minFontSize, whiteColor} from "../../common/styles"
import {DEVICE_HEIGHT, DEVICE_WIDTH, scaleSize,setSpText} from "../../common/screenUtil";
import PlanList from "./tabs/PlanList";
import Feedback from "./tabs/Feedback";
import Recording from "./tabs/Recording";
import SearchModal from "../../components/SearchModal";

export default class DynamicIndex extends React.Component {
    componentWillUnmount() {
        this.addEventTab.remove();
    }

    componentWillMount() {
        this.addEventTab = this.props.navigation.addListener('didFocus', () => {
            this.setState({index: 0})
        })
    }

    constructor() {
        super()
        this.state = {
            index: 0,
            filterText: {
                sidx: '',
                order: '',
                storeCode: '',
                storeName: '',
            },
            isOpen: false,//是否展示搜索框
            value: "",//搜索框内容
            historyList: [],
        }
    }

    allClick = () => {
        let filterText = {
            sidx: '',
            order: '',
            storeCode: '',
            storeName: '',
        }
        this.setState({filterText});
    }
    gotoNavigate = (val, data) => {
        if (val !== '') {
            this.props.navigation.navigate(val, data);
        }
    }
    onChangeTab = ({i}) => {
        this.setState({index: i})
    }
    /*打开搜索框*/
    search = async () => this.setState({isOpen: true})
    /*搜索内容*/
    searchText = async value => {
        let filterText = {
            sidx: '',
            order: '',
            storeCode: '',
            storeName: value,
        };
        this.setState({filterText, isOpen: false})
    }
    closeModal = () => this.setState({isOpen: false})

    render() {
        return (
            <View style={styles.container}>
                <Header title={"考评"}>
                    <HeaderAttach all={this.allClick} search={this.search}/>
                </Header>
                <ScrollableTabView
                    tabBarTextStyle={{paddingTop: scaleSize(20)}}
                    tabBarUnderlineStyle={{height: scaleSize(4), backgroundColor: mainColor}}
                    tabBarActiveTextColor={mainColor}
                    tabBarInactiveTextColor={garyColor}
                    initialPage={0}
                    onChangeTab={this.onChangeTab}
                    renderTabBar={() => <DefaultTabBar style={styles.tab}/>}
                >
                    <PlanList
                        tabLabel='计划考评'
                        navigate={this.gotoNavigate}
                        filter={this.state.filterText}
                        index={this.state.index}/>
                    <Feedback
                        tabLabel='例外追踪'
                        navigate={this.gotoNavigate}
                        filter={this.state.filterText}
                        index={this.state.index}/>
                    <Recording
                        tabLabel='考评记录'
                        navigate={this.gotoNavigate}
                        filter={this.state.filterText}
                        index={this.state.index}/>
                </ScrollableTabView>
                <SearchModal
                    isOpen={this.state.isOpen}
                    close={this.closeModal}
                    search={(value) => {
                        this.searchText(value)
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    tab: {
        height: scaleSize(85),
        backgroundColor: whiteColor,
    },

    modal: {
        position: 'relative',
        justifyContent: "flex-end",
        margin: 0
    },
    modal_center: {
        paddingHorizontal: scaleSize(20),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: DEVICE_HEIGHT / 2,
        width: DEVICE_WIDTH,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    modal_text_input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(140),
    },
    inputStyle: {
        paddingHorizontal: scaleSize(20),
        flex: 1,
        color: whiteColor,
        fontSize: minFontSize,
    },
    search_btn: {
        marginTop: scaleSize(30),
        justifyContent: 'center',
        alignItems: 'center',
        width: scaleSize(150),
        height: scaleSize(80),
        borderRadius: scaleSize(100),
        backgroundColor: mainColor,
    },
    search_history: {
        flex: 1,
        width: DEVICE_WIDTH,
    },
});
