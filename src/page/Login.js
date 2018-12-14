import React from "react";
import {
    StyleSheet,
    StatusBar,
    TouchableHighlight,
    View,
    Text,
    Image,
    TouchableOpacity,
    BackHandler,
    AsyncStorage
} from "react-native";
import {Container, Item, Input, Form, Label, Thumbnail, Button} from 'native-base';
import {scaleSize} from "../common/screenUtil";
import {mainColor, mainFontSize, maxFontSize, whiteColor} from "../common/styles";
import {showToast} from "../common/util";
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {login, getData, getInfo} from "../api/HttpSend";

@inject('store')
@observer
export default class Login extends React.Component {
    @action
    setRouter(bool = false) {
        this.props.store.NavInfo.setRoute(bool);
    }

    @action
    setUserInfo(info) {
        this.props.store.UserInfo.setUserInfo(info);
    }

    componentDidMount() {
        this.setRouter();
    }

    constructor() {
        super()
        this.state = {
            name: '',
            pwd: '',
        }
    }

    postLogin = async () => {
        if (!this.state.name.length) {
            showToast("请输入用户名");
            return;
        }
        if (!this.state.pwd.length) {
            showToast("请输入密码");
            return
        }
        let result = await login(this.state.name, this.state.pwd);
        showToast('登录成功', 'success');
        await AsyncStorage.setItem('shop_token', result.token);
        let res = await getInfo()
        this.setRouter(true);
        this.setUserInfo(res.user);
        this.setState({name: '', pwd: ''})
        this.props.navigation.navigate('TabDynamic')
    }

    render() {
        return (
            <Container style={styles.container}>
                <StatusBar backgroundColor={'#000'} hidden={false}/>
                <View style={styles.content}>
                    <View style={{alignItems: "center"}}>
                        <Image style={{width: scaleSize(236), height: scaleSize(236)}}
                               source={require('../assets/resource/login/logo.png')}/>
                        <Text style={{
                            color: mainColor,
                            fontSize: maxFontSize,
                            lineHeight: mainFontSize + 10
                        }}>智慧管理系统</Text>
                    </View>
                    <Form style={{marginTop: scaleSize(20)}}>
                        <Item>
                            <Thumbnail square style={{width: scaleSize(40), height: scaleSize(42)}}
                                       source={require('../assets/resource/login/account_icon.png')}/>
                            <Input autoCapitalize={'none'} placeholder='请输入用户名'
                                   onChangeText={text => this.setState({name: text.replace(/\s/g, "")})}
                                   value={this.state.name}/>
                        </Item>

                        <Item>
                            <Thumbnail square
                                       style={{width: scaleSize(40), height: scaleSize(42)}}
                                       source={require('../assets/resource/login/passwd_icon.png')}/>
                            <Input secureTextEntry placeholder='请输入密码'
                                   onChangeText={text => this.setState({pwd: text.replace(/\s/g, "")})}
                                   value={this.state.pwd}/>
                        </Item>
                        {/*<Item floatingLabel>

			  <Label>
				<Text>用户名</Text>
			  </Label>
			  <Input autoCapitalize={'none'}
					 onChangeText={text => this.setState({name: text.replace(/\s/g, "")})}
					 value={this.state.name}/>
			</Item>*/}
                        {/*<Item floatingLabel>
			  <Thumbnail square
						 style={{borderRadius: 'none', width: scaleSize(40), height: scaleSize(42)}}
						 source={require('../assets/resource/login/passwd_icon.png')}/>
			  <Label>
				<Text>密 码</Text>
			  </Label>
			  <Input secureTextEntry
					 onChangeText={text => this.setState({pwd: text.replace(/\s/g, "")})}
					 value={this.state.pwd}/>
			</Item>*/}
                    </Form>
                    <Button primary style={styles.login_btn} onPress={this.postLogin}>
                        <Text style={{fontSize: mainFontSize, color: whiteColor}}>登录</Text>
                    </Button>
                </View>
                <Image style={styles.footer_img} source={require("../assets/resource/login/login_footer_bg.png")}/>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: scaleSize(200)
    },
    content: {
        width: scaleSize(600),
    },
    login_btn: {
        marginTop: scaleSize(150),
        justifyContent: 'center',
        width: scaleSize(600),
    },
    footer_img: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        height: scaleSize(279),
    }
})
