/*
* 我的首页
* */

import React from "react"
import {StyleSheet, View, Text, Image, ImageBackground} from "react-native"
import {ListItem, Left, Body, Right, Button} from "native-base"
import Header from "../../components/Header"
import {scaleSize} from "../../common/screenUtil"
import {garyColor, mainColor, maxFontSize, whiteColor} from "../../common/styles"

const MineIndex = (props) => (
    <View style={styles.container}>
        <Header title={"我的"}/>
        <ImageBackground
            style={styles.header_bg}>
            <View style={[styles.avatar_border]}>
                <Image style={styles.avatar}
                       source={require("../../assets/resource/common/avatar.png")}/>
            </View>
        </ImageBackground>
        <ListItem>
            <Left>
                <Text style={{color: garyColor}}>昵称</Text>
            </Left>
            <Body>
            <Text style={{color: "#000", fontSize: maxFontSize}}>张麻子</Text>
            </Body>
        </ListItem>
        <ListItem onPress={() => props.navigation.navigate('ForgetPwd')}>
            <Left>
                <Text style={{color: garyColor}}>修改密码</Text>
            </Left>
            <Right>
                <Image style={{width: scaleSize(48), height: scaleSize(48)}}
                       source={require("../../assets/resource/common/icon_back_black.png")}/>
            </Right>
        </ListItem>
        <Button style={styles.logout_btn} onPress={() => {
            console.log("我是注销登录")
        }}>
            <Image style={{width: scaleSize(36), height: scaleSize(36)}}
                   source={require("../../assets/resource/mine/icon_logout.png")}/>
            <Text style={{marginHorizontal: scaleSize(20), color: whiteColor}}>注销登录</Text>
        </Button>
    </View>
)

export default MineIndex;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header_bg: {
        alignItems: 'center',
        justifyContent: 'center',
        width: scaleSize(750),
        height: scaleSize(470),
    },
    avatar: {
        width: scaleSize(245),
        height: scaleSize(245),
    },
    avatar_border: {
        borderStyle: 'solid',
        borderWidth: scaleSize(4),
        borderColor: mainColor,
        borderRadius: scaleSize(245),
    },
    logout_btn: {
        marginLeft: scaleSize(250),
        marginTop: scaleSize(130),
        paddingVertical: scaleSize(6),
        paddingHorizontal: scaleSize(60),
        backgroundColor: '#F30000'
    },
})