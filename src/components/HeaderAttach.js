import React from "react"
import {StyleSheet, Image, Text, TouchableOpacity, View} from "react-native"
import {scaleSize} from "../common/screenUtil"
import {fontSize16, whiteColor} from "../common/styles";

const HeaderAttach = (props) => {
  return (
    <View style={styles.head_children}>
      {
        props.all ?
          <View style={styles.head_left}>
            <Text style={[styles.head_left_text, {paddingHorizontal: scaleSize(30)}]} onPress={props.all}>全部</Text>
          </View>
          : null
      }
      <View style={styles.head_right}>
        {
          props.collection ?
            <TouchableOpacity
              activeOpacity={0.9}
              style={[{paddingHorizontal: scaleSize(12)}]}
              onPress={props.collection}
            >
              {
                props.isCollect ?
                  <Image style={styles.icon}
                         source={require("../assets/resource/shop/icon_collection_search_yes.png")}/>
                  :
                  <Image style={styles.icon}
                         source={require("../assets/resource/shop/icon_collection_search_not.png")}/>
              }
            </TouchableOpacity>
            : null
        }
        {
          props.search ?
            <TouchableOpacity
              activeOpacity={0.9}
              style={[{paddingHorizontal: scaleSize(12)}]}
              onPress={props.search}
            >
              <Image style={styles.icon} source={require("../assets/resource/shop/icon_search.png")}/>
            </TouchableOpacity>
            : null
        }
        {
          props.filter ?
            <TouchableOpacity
              activeOpacity={0.9}
              style={[{paddingHorizontal: scaleSize(12)}]}
              onPress={props.filter}
            >
              <Image style={styles.icon} source={require("../assets/resource/shop/icon_filter.png")}/>
            </TouchableOpacity>
            : null
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  head_children: {
    position: 'relative',
  },
  head_left: {
    position: 'absolute',
    top: 0,
    left: scaleSize(14),
    height: scaleSize(90),
    justifyContent: 'center',
  },
  head_left_text: {
    color: whiteColor,
    fontSize: fontSize16,
  },
  head_right: {
    position: 'absolute',
    top: 0,
    right: scaleSize(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(90),
  },
  icon: {
    width: scaleSize(48),
    height: scaleSize(48),
  },
})

export default HeaderAttach;
