/*
* 整改反馈
* */
import React from "react"
import {StyleSheet, View, Text, Image, FlatList, RefreshControl} from "react-native"
import {Separator} from "native-base"
import {scaleSize} from "../../../common/screenUtil";
import {garyColor, lightGaryColor, mainColor, whiteColor} from "../../../common/styles"
import {exceptionList} from "../../../api/evaluReq";

export default class Feedback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [
                {id: 1, eval: 5, children: [{ids: 10}, {ids: 11}]},
                {id: 2, eval: 2, children: [{ids: 10}]},
                {id: 3, eval: 5, children: [{ids: 10}, {ids: 11}]},
                {id: 4, eval: 2, children: [{ids: 11}]}],
            filter: props.filter,//过滤的条件
            page: 1,//当前页码
            refreshing: false,//是否在加载数据
            isStatus: true,
            isLoreTextStatus: true,
            isLoreText: '正在加载中...',//上拉加载提示文字
        }
        this._exceptionList()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filter !== this.props.filter) {
            if (nextProps.index === 1) {
                this.setState({filter: nextProps.filter})
                this._getPlanList()
            }
        }
    }

    _exceptionList = async (page = 1) => {
        /*此处请求有点小问题*/
        let result = await exceptionList(page, this.state.filter.sidx, this.state.filter.order, this.state.filter.storeCode, this.state.filter.storeName);
        console.log(result);
        if (page === 1) {
            if (result.page.list.length) {
                this.setState({list: result.page.list});
            } else {
                this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
            }
        } else if (result.page.list.length) {
            this.setState({list: this.state.list.concat(result.page.list)})
        } else {
            this.setState({isLoreText: '没有更多数据了...', isLoreTextStatus: false})
        }
        this.setState({isStatus: false, isLoreTextStatus: false})
        if (isRefresh) {
            this.setState({refreshing: false})
        }
    }
    //上拉加载更多
    getMoreList = () => {
        if (!this.state.isStatus && this.state.isLoreTextStatus) {
            this.setState({isStatus: true, page: this.state.page + 1})
            this._exceptionList(this.state.page + 1)
        }
    }
    //下拉刷新
    Refresh = () => {
        this.setState({
            page: 1,
            refreshing: true,
            isLoreText: '正在加载...'
        });
        this._exceptionList(1, true)
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.list}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.1}//执行上啦的时候10%执行
                    onEndReached={this.getMoreList}//获取更多数据
                    ListFooterComponent={this._renderFooter}//尾部
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.Refresh}
                            title="刷新中..."/>}
                />
            </View>
        )
    }

    _keyExtractor = (item) => item.id + '';
    _renderItem = ({item}) => (
        <View style={styles.item}>
            <View style={styles.head}>
                <View style={styles.line}/>
                <Text style={styles.head_title}>南区1030店</Text>
                <Text style={styles.eval_icon}>处理</Text>
            </View>
            <View style={styles.footer}>
                <View style={styles.center}>
                    <Text style={styles.desc}>考评时间：2018-10-8日</Text>
                    <Text style={styles.time}>考评内容荣：全部不合格项目(3项)</Text>
                    <Text style={styles.time}>处理人：张麻子</Text>
                    <Text style={styles.time}>完成时间：2018-10-10 11:12:23</Text>
                </View>
            </View>
        </View>
    )
    _renderFooter = () => {
        return (
            <View style={{
                height: 44,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>{this.state.isLoreText}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },

    item: {
        marginBottom: scaleSize(10),
        borderTopColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    head: {
        paddingHorizontal: scaleSize(28),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(88),
        backgroundColor: '#0ff',
    },
    line: {
        marginHorizontal: scaleSize(8),
        width: scaleSize(4),
        height: scaleSize(26),
        backgroundColor: mainColor,
    },
    head_title: {
        flex: 1,
    },
    eval_icon: {
        marginHorizontal: scaleSize(14),
        height: scaleSize(48)
    },
    footer: {
        marginBottom: scaleSize(24),
        padding: scaleSize(30),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: lightGaryColor,
        borderBottomColor: lightGaryColor,
        borderTopWidth: scaleSize(1),
        borderBottomWidth: scaleSize(1),
        borderStyle: 'solid',
    },
    center: {
        paddingHorizontal: scaleSize(20),
        flex: 1,
    },
    desc: {
        //fontSize: 16,
    },
    time: {
        fontSize: 13,
    }
})