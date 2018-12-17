/*
* 搜索弹窗
* */

import React from "react";
import {StyleSheet, View, Image, Text, AsyncStorage} from "react-native";
import {Button, Content, Icon, Left, List, ListItem, Right, Item, Input} from "native-base";
import Modal from "react-native-modal";
import {mainColor, whiteColor} from "../common/styles";
import {DEVICE_HEIGHT, DEVICE_WIDTH, scaleSize} from "../common/screenUtil";

class SearchModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            historyList: []
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen) {
            let list = await AsyncStorage.getItem('shop_store_search');
            console.log(list);
            this.setState({historyList: JSON.parse(list)})
        }
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
            AsyncStorage.setItem("shop_store_search", JSON.stringify(searchContent))
            this.props.search(this.state.value)
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

    render() {
        return (
            <Modal isVisible={this.props.isOpen}
                   onSwipe={this.props.close}
                   onBackdropPress={this.props.close}
                   animationIn="zoomInDown"
                   animationOut="zoomOutUp"
                   animationInTiming={300}
                   animationOutTiming={300}
                   style={styles.modal}
            >
                <View style={styles.modal_center}>
                    <View style={styles.modal_text_input}>
                        <Item style={{flex: 1}}>
                            <Input
                                placeholder="请输入搜索内容"
                                placeholderTextColor={whiteColor}
                                editable={true}//是否可编辑
                                style={styles.inputStyle}//input框的基本样式
                                value={this.state.value}
                                onChangeText={(value) => {
                                    this.setState({value})
                                }}//输入框改变触发的函数
                            />
                        </Item>
                        <Button style={styles.search_btn} light onPress={this.searchText}>
                            <Icon name="search"/>
                        </Button>
                    </View>
                    <Content style={styles.search_history}>
                        <List>{this.searchHistory()}</List>
                    </Content>
                </View>
            </Modal>
        )
    }

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
}

const styles = StyleSheet.create({
    whiteColor: {
        color: whiteColor
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
        fontSize: 18,
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
})

export default SearchModal;