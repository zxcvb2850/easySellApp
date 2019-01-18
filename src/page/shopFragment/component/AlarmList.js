/**
 * 报警列表
 * */
import React from "react";
import {StyleSheet, View, Text} from "react-native";
import {Content} from "native-base"
import Header from "../../../components/Header";
import {scaleSize} from "../../../common/screenUtil";
import {lightGaryColor, whiteColor, fontSize20} from "../../../common/styles";
import ShopTitle from "../../../components/ShopTitle";

const AlarmList = ({navigation}) => {
  const {params} = navigation.state;
  console.log(params)
  return (
    <View style={styles.container}>
      <Header isBack title={'报警列表'}/>
      <ShopTitle title={params.storeName}/>
      <Content style={{flex: 1}}>
        {
          params.data ? params.data.map(item => (
            <View key={item.alarmId} style={styles.content}>
              <View style={styles.desc_wrap}>
                <Text style={[styles.text, styles.left_text]}>{item.createTime}</Text>
                <Text style={[styles.text, styles.right_text]}>{item.alarmDetail}</Text>
              </View>
              <View style={styles.options}>
                {
                  item.protectAdderss ?
                    <Text>防区号：{item.protectCode}</Text>
                    :
                    <Text>操作员：{item.protectCode}</Text>
                }
              </View>
            </View>
          )) : null
        }
      </Content>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: scaleSize(30),
    height: scaleSize(130),
    borderBottomColor: lightGaryColor,
    borderBottomWidth: scaleSize(1),
    borderStyle: 'solid',
    backgroundColor: whiteColor,
  },
  desc_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(80)
  },
  text: {},
  left_text: {
    flex: 1,
  },
  right_text: {},
  options: {
    flexDirection: 'row-reverse',
    height: scaleSize(50)
  }
})

export default AlarmList;

