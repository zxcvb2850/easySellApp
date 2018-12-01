/**
 * 计划考评考评每一项
 * */
import React from "react";
import {StyleSheet, View, Text} from "react-native";
import {Content, ListItem, Left, Right, Radio, Button} from "native-base";

/*mbox*/
import {inject, observer} from "mobx-react";
import {computed, action} from "mobx";
import Header from "../../../components/Header";
import {DEVICE_WIDTH, scaleSize} from "../../../common/screenUtil";
import {garyColor} from "../../../common/styles";

@inject("store")
@observer
export default class EvalutItem extends React.Component {
    @computed get getEvalutList() {
        return this.props.store.EvalutList.evalutList;
    }

    @computed get getEvalutIndex() {
        return this.props.store.EvalutIndex.evalutIndex
    }

    @action
    prevEvalut() {
        this.props.store.EvalutIndex.prevEvalutIndex(this.getEvalutIndex)
    }

    @action
    nextEvalut() {
        this.props.store.EvalutIndex.nextEvalutIndex(this.getEvalutIndex)
    }

    componentDidMount() {
        this.setState({
            index: this.getEvalutIndex,
            list: this.getEvalutList,
        })
        console.log(this.getEvalutList[this.getEvalutIndex])
    }

    constructor() {
        super()
        this.state = {
            index: 0,//当前考评
            list: [],//考评列表
            radio: true,//单选框
        };
    }

    changeIndex = (type) => {
        if (type === 'prev') {
            this.prevEvalut()
        } else {
            this.nextEvalut()
        }
        this.setState({index: this.getEvalutIndex, radio: true});
    }

    radioSelect = () => {
        this.setState({radio: !this.state.radio})
    }

    render() {
        return (
            <View style={styles.container}>
                <Header isBack title={"考评详情"}/>
                <Content>
                    <View style={styles.center}>
                        {
                            this.state.list[this.state.index] ?
                                <View>
                                    <Text>{this.state.list[this.state.index].projectCode}</Text>
                                    <Text>{this.state.list[this.state.index].projectType}</Text>
                                    <Text>{this.state.list[this.state.index].projectData}</Text>
                                    <Text>{this.state.list[this.state.index].projectRequire}</Text>
                                    <Text>{this.state.list[this.state.index].projectArea}</Text>
                                </View>
                                : null
                        }
                    </View>
                    <View>
                        <ListItem onPress={this.radioSelect} selected={this.state.radio}>
                            <Left>
                                <Text>合格</Text>
                            </Left>
                            <Right>
                                <Radio
                                    color={"#f0ad4e"}
                                    selectedColor={"#5cb85c"}
                                    selected={this.state.radio}
                                />
                            </Right>
                        </ListItem>
                        <ListItem onPress={this.radioSelect} selected={!this.state.radio}>
                            <Left>
                                <Text>不合格</Text>
                            </Left>
                            <Right>
                                <Radio
                                    color={"#f0ad4e"}
                                    selectedColor={"#5cb85c"}
                                    selected={!this.state.radio}
                                />
                            </Right>
                        </ListItem>
                    </View>
                </Content>
                <View style={styles.footer}>
                    <View style={styles.footer_btn}>
                        {
                            this.state.index - 1 >= 0 ?
                                <Button light style={styles.btn}
                                        onPress={() => this.changeIndex('prev')}><Text>上一个</Text></Button>
                                : null
                        }
                    </View>
                    <View style={styles.footer_btn}>
                        <Button style={styles.btn}
                                onPress={() => {
                                    console.log('提交')
                                }}><Text style={{color: '#FFF'}}>提交</Text></Button>
                    </View>
                    <View style={styles.footer_btn}>
                        {
                            this.state.index < this.state.list.length - 1 ?
                                <Button light style={styles.btn}
                                        onPress={() => this.changeIndex('next')}><Text>下一个</Text></Button>
                                : null
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    center: {
        flex: 1,
    },

    footer: {
        flexDirection: 'row',
        height: scaleSize(100),
    },
    footer_btn: {
        flex: 1,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: garyColor,
        borderWidth: scaleSize(1),
        borderStyle: 'solid',
        width: DEVICE_WIDTH / 3,
    },
    btn_txt: {
        // width: DEVICE_WIDTH / 2,
        // textAlign: 'center',
    }
})