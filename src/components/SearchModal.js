/*
* 搜索弹窗
* */

import React from "react";
import {StyleSheet, View, Image, Text, AsyncStorage, Platform, TouchableOpacity} from "react-native";
import {Button, Content, Icon, Left, List, ListItem, Right, Item, Input} from "native-base";
import Modal from "react-native-modal";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {whiteColor} from "../common/styles";
import {DEVICE_HEIGHT, DEVICE_WIDTH, scaleSize} from "../common/screenUtil";
import {showToast} from "../common/util";
import commonStyle from "../common/commStyle";

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
    console.log(this.state.value)
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
    } else {
      showToast('请输入搜索内容')
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
             style={styles.modal}
      >
        <View style={styles.modal_center}>
          <View style={[styles.modal_text_input, commonStyle.borderBottom]}>
            <View style={styles.modal_input_box}>
              <Input
                placeholder="请输入搜索内容"
                placeholderTextColor={'#a3a3a3'}
                editable={true}//是否可编辑
                style={styles.input_style}//input框的基本样式
                value={this.state.value}
                onChangeText={(value) => {
                  this.setState({value})
                }}//输入框改变触发的函数
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.search_btn}
              onPress={this.searchText}
            >
              <Image
                style={{width: scaleSize(84), height: scaleSize(84)}}
                source={require("../assets/resource/common/icon_search.png")}
              />
            </TouchableOpacity>
          </View>
          <Content style={styles.search_history}>
            <List>{this.searchHistory()}</List>
          </Content>
          {Platform.OS === 'ios' && <KeyboardSpacer/>}
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
        <Text style={{color: '#666', fontSize: 18}}>{item}</Text>
      </Left>
      <Right>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.item_close, {padding: scaleSize(20)}]}
          onPress={() => {
            this.deleteSearchHistory(index)
          }}
        >
          <Image
            style={styles.item_close}
            source={require("../assets/resource/shop/icon_close.png")}/>
        </TouchableOpacity>
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
    backgroundColor: whiteColor,
  },
  modal_text_input: {
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(140),
  },
  modal_input_box: {
    //marginVertical: scaleSize(26),
    //marginHorizontal: scaleSize(62),
    height: scaleSize(84),
    //flex: 1,
  },
  input_style: {
    //paddingHorizontal: scaleSize(20),
    //flex: 1,
    color: '#000',
    fontSize: 14,
    width: scaleSize(535),
    height: scaleSize(64),
    borderStyle: 'solid',
    borderColor: '#e1e1e1',
    borderWidth: scaleSize(2),
    backgroundColor: '#fcfcfc',
  },
  search_btn: {
    // marginTop: scaleSize(30),
    marginLeft: scaleSize(26),
    width: scaleSize(84),
    height: scaleSize(84),
  },
  search_history: {
    flex: 1,
    width: DEVICE_WIDTH,
  },
  item_close: {
    width: scaleSize(21),
    height: scaleSize(21)
  }
})

export default SearchModal;
