/*
* 考评
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList} from "react-native"
import {Drawer} from "native-base"
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import Header from "../../components/Header"
import HeaderAttach from "../../components/HeaderAttach"
import {garyColor, mainColor, whiteColor} from "../../common/styles"
import {scaleSize} from "../../common/screenUtil";
import PlanList from "./tabs/PlanList";
import Feedback from "./tabs/Feedback";
import Recording from "./tabs/Recording";

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
            }
        }
    }

    search = () => {
    }
    filter = () => {
        this.drawer._root.open()
    }
    closeDrawer = () => {
        this.drawer._root.close()
    };
    gotoNavigate = (val, data) => {
        if (val !== '') {
            this.props.navigation.navigate(val, data);
        }
    }
    onChangeTab = ({i}) => {
        this.setState({index: i})
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
                content={<View style={{flex: 1, backgroundColor: '#FFF'}}><Text>122112222121</Text></View>}
                onClose={() => this.closeDrawer()}>
                <View style={styles.container}>
                    <Header title={"考评"}>
                        <HeaderAttach search={this.search} filter={this.filter}/>
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
                </View>
            </Drawer>
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
});
