/*
* 考评详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native"
import {Content, Accordion} from "native-base"
import Header from "../../../components/Header";
import {scaleSize} from "../../../common/screenUtil";

export default class EvalutDetails extends React.Component {
    _renderHeader = ({title, expanded}) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    padding: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#A9DAD6"
                }}
            >
                <Text style={{fontWeight: "600"}}>
                    {" "}{title}
                </Text>
                {expanded
                    ?
                    <Image style={styles.icon_show} source={require("../../../assets/resource/evalut/icon_show.png")}/>
                    :
                    <Image style={[styles.icon_show, {}]}
                           source={require("../../../assets/resource/evalut/icon_confirm.png")}/>}
            </View>
        );
    }

    _renderContent = ({content}) => {
        return (
            <Text
                style={{backgroundColor: "#e3f1f1", padding: 10, fontStyle: "italic"}}
            >
                {content}
            </Text>
        );
    }

    render() {
        const dataArray = [
            {title: "First Element", content: "Lorem ipsum dolor sit amet"},
            {title: "Second Element", content: "Lorem ipsum dolor sit amet"},
            {title: "Third Element", content: "Lorem ipsum dolor sit amet"}
        ];
        return (
            <View style={styles.container}>
                <Header isBack title={"考评"}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.icon_confirm, styles.confirm_total]}>
                        <Image style={styles.icon_confirm}
                               source={require("../../../assets/resource/evalut/icon_confirm.png")}/>
                    </TouchableOpacity>
                </Header>
                <View style={styles.center}>
                    <Content padder>
                        <Accordion
                            dataArray={dataArray}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                        />
                    </Content>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    confirm_total: {
        position: 'absolute',
        right: scaleSize(30),
        top: scaleSize((90 - 44) / 2),
        height: scaleSize(90),
    },
    icon_confirm: {
        width: scaleSize(44),
        height: scaleSize(44),
    },

    center: {
        width: scaleSize(600),
        height: scaleSize(600),
        backgroundColor: '#F00',
    },
    icon_show: {
        width: scaleSize(45),
        height: scaleSize(45),
    }
})