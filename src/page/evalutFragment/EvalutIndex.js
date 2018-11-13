/*
* 考评
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList} from "react-native"
import {Drawer, Content, ListItem, Left, Body, Right, Icon} from "native-base"
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import Header from "../../components/Header"
import HeaderAttach from "../../components/HeaderAttach"
import {garyColor, mainColor, whiteColor} from "../../common/styles"
import {scaleSize} from "../../common/screenUtil";
import Feedback from "./tabs/Feedback";


export default class DynamicIndex extends React.Component {
    constructor() {
        super()
        this.state = {
            list: [
                {id: 1, name: '南区1030店'},
                {id: 2, name: '南区1031店'},
                {id: 3, name: '南区1032店'},
                {id: 4, name: '南区1033店'},
                {id: 5, name: '南区1034店'},
                {id: 6, name: '南区1035店'},
                {id: 7, name: '南区1035店'},
                {id: 8, name: '南区1035店'},
                {id: 9, name: '南区1035店'},
                {id: 10, name: '南区1035店'},
                {id: 11, name: '南区1035店'},
                {id: 12, name: '南区1035店'},
                {id: 13, name: '南区1035店'},
                {id: 14, name: '南区1035店'},
                {id: 15, name: '南区1035店'},
                {id: 16, name: '南区1035店'},
                {id: 17, name: '南区1035店'},
                {id: 18, name: '南区1035店'},
                {id: 19, name: '南区1035店'},
                {id: 20, name: '南区1035店'},
            ],
            tabTitles: ['首页', '我的'],
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
    _keyExtractor = (item) => item.id + '';
    _renderItem = ({item}) => (
        <ListItem icon style={{backgroundColor: whiteColor}}
                  key={item.id}
                  onPress={() => {
                      console.log(item.id)
                  }}
        >
            <Left>
                <Icon name="plane"/>
            </Left>
            <Body>
            <Text>{item.name}</Text>
            </Body>
            <Right>
                <Icon name="arrow-forward"/>
            </Right>
        </ListItem>
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
                    <Header title={"考评"}>
                        <HeaderAttach search={this.search} filter={this.filter}/>
                    </Header>
                    <ScrollableTabView
                        tabBarUnderlineStyle={{height: scaleSize(2), backgroundColor: mainColor}}
                        tabBarActiveTextColor={mainColor}
                        tabBarInactiveTextColor={garyColor}
                        initialPage={1}
                        renderTabBar={() => <DefaultTabBar style={styles.tab}/>}
                    >
                        <FlatList
                            tabLabel='计划考评(20)'
                            data={this.state.list}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                        />
                        <Feedback tabLabel='整改反馈(2)'/>
                        <Text style={styles.textStyle} tabLabel='考评记录'>project</Text>
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
