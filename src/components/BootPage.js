import React from "react"
import {StyleSheet, StatusBar, View, Text, Image, AsyncStorage} from "react-native"
import {DEVICE_HEIGHT, DEVICE_WIDTH, scaleSize} from "../common/screenUtil";
import {getInfo} from "../api/HttpSend";

/*mobx*/
import {observer, inject} from 'mobx-react'
import {action, computed} from 'mobx'

@inject('store')
@observer
export default class BootPage extends React.Component {
    @action
    addRouter() {
        this.props.store.NavInfo.addRoute(this.routerIndex)
    }

    @computed get routerIndex() {
        return this.props.store.NavInfo.navList
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }

    componentDidMount() {
        //AsyncStorage.removeItem('shop_token')
        setTimeout(() => {
            this.down();
        }, 1000)
    }

    constructor(props) {
        super(props)
        this.state = {
            downTimer: 3,
        }
    }

    down = async () => {
        if (this.state.downTimer > 0) {
            this.timer = setTimeout(() => {
                this.setState({downTimer: this.state.downTimer - 1})
                this.down();
            }, 2000)
        } else {
            const token = await AsyncStorage.getItem('shop_token');
            const userInfo = await AsyncStorage.getItem('shop_info');
            console.log('-----token----', token)
            if (token !== null) {
                let result = await getInfo()
                await AsyncStorage.setItem('shop_info', JSON.stringify(result.user))
                this.addRouter()
                this.props.navigation.navigate('TabFragment');
            } else {
                this.props.navigation.navigate('Login');
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={{paddingBottom: scaleSize(500)}}>
                    <Image style={styles.logoImg} source={require("../assets/resource/login/logo.png")}/>
                    <Text style={styles.title}>易售通</Text>
                </View>
                <Text style={styles.downTimer}>{this.downTimer}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
    },
    logoImg: {
        marginVertical: scaleSize(30),
        width: scaleSize(236),
        height: scaleSize(236),
    },
    title: {
        textAlign: 'center',
        fontSize: scaleSize(32),
    },
    downTimer: {
        position: 'absolute',
        right: scaleSize(20),
        top: scaleSize(20),
    }
});
