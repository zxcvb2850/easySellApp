/*
* 考评
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList, TextInput} from "react-native"
import {Content, ListItem, List, Left, Right, Icon, Button} from "native-base"
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import Header from "../../components/Header"
import HeaderAttach from "../../components/HeaderAttach"
import {garyColor, mainColor, whiteColor} from "../../common/styles"
import {scaleSize} from "../../common/screenUtil";
import PlanList from "./tabs/PlanList";
import Feedback from "./tabs/Feedback";
import Recording from "./tabs/Recording";
import Modal from 'react-native-modalbox'

export default class DynamicIndex extends React.Component {
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
        }
    }

    search = () => {
        this.setState({isOpen: true})
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
    searchText = () => {
        if (this.state.value !== "") {
            console.log(this.state.value)
            let filterText = {
                sidx: '',
                order: '',
                storeCode: '',
                storeName: this.state.value,
            }
            this.setState({filterText, isOpen: false});
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title={"考评"}>
                    <HeaderAttach all={this.allClick} search={this.search}/>
                </Header>
                <ScrollableTabView
                    tabBarUnderlineStyle={{height: scaleSize(2), backgroundColor: mainColor}}
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
                <Modal isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})}
                       style={[styles.modal, {backgroundColor: 'rgba(0,0,0,.3)'}]} position={"center"}>
                    <View style={styles.modal_center}>
                        <TextInput
                            placeholder="请输入店铺名称"
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
                </Modal>
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
});
