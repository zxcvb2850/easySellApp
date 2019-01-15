/*
* 列外考评列表
* */
import React from "react";
import {StyleSheet, Text, BackHandler} from "react-native";
import {Content, List, ListItem, Left} from "native-base";
import Header from "../../../components/Header";

export default class FeedList extends React.Component {
    componentWillUnmount() {
        /*移除监听返回按钮*/
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillMount() {
        /*监听返回按钮*/
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
        const {params} = this.props.navigation.state;
        params.callback(true);
        this.props.navigation.goBack();
        return true;
    }

    gotoFeedDetails = (item) => {
        const {params} = this.props.navigation.state;
        console.log(item, params);
        this.props.navigation.navigate('FeedbackDetail', {
            storeName: params.storeName,
            reviewProjectId: item.reviewProjectId,
            callback: () => {
                console.log('callback');
                //this._exceptionList()
            }
        })
    }

    render() {
        const {params} = this.props.navigation.state;
        return (
            <Content styles={styles.container}>
                <Header isBack={this.onBackPress} title={"列外考评列表"}/>
                <ListItem>
                    <Text>店铺名称：{params.storeName}</Text>
                </ListItem>
                <List>
                    {
                        params.list.length && params.list.map(item =>
                            <ListItem
                                key={item.reviewProjectId}
                                onPress={() => {
                                    this.gotoFeedDetails(item)
                                }}
                            >
                                <Left>
                                    <Text>{item.projectType}</Text>
                                </Left>
                            </ListItem>
                        )
                    }
                </List>
            </Content>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});