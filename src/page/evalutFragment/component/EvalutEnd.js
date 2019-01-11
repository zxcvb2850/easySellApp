/**
 * 已完结的项目
 * */
import React from "react";
import {StyleSheet, View, Text, Image} from "react-native"
import {Content, List, ListItem, Separator, Left, Right} from "native-base"
import Header from "../../../components/Header";
import {getHistoryDetail} from "../../../api/evaluReq"
import {backgroundColor, headerColor, lightGaryColor, whiteColor} from "../../../common/styles"
import Accordion from 'react-native-collapsible/Accordion'
import {classify} from "../../../common/util"
import commonStyle from "../../../common/commStyle"
import {scaleSize} from "../../../common/screenUtil"
import {BASE_URL} from "../../../config/config";
import CustomImage from "../../../components/CustomImage";

export default class EvalutEnd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      storeInfo: {},//店铺详情
      storeEvalut: [],//店铺考评详情
      activeSections: [],
      normal: 0,//正常个数
      other: 0,//列外个数
      not: 0,//不合适
    }
    this._getHistoryDetail()
  }

  _getHistoryDetail = async () => {
    let result = await getHistoryDetail(this.props.navigation.state.params.reviewId)
    let dest = []
    if (result.storeReview.projectList.length) {
      dest = classify(result.storeReview.projectList)
    }
    let a = 0, b = 0, c = 0
    result.storeReview.projectList.forEach(item => {
      if (item.checkResult === 2) {
        a++
      }
      if (item.checkResult === 3) {
        b++
      }
      if (item.checkResult === 4) {
        c++;
      }
    })
    this.setState({
      storeInfo: result.storeReview,
      storeEvalut: dest,
      normal: a,
      other: b,
      not: c,
    })
    console.log("========", result.storeReview)
    console.log(dest)
  }

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  render() {
    let {params} = this.props.navigation.state
    return (
      <View style={styles.container}>
        <Header isBack title={"考评详情"}/>
        <Content style={styles.container}>
          <List style={styles.header_desc}>
            <Separator bordered style={{height: scaleSize(120), backgroundColor: whiteColor}}>
              <Text style={[commonStyle.color_back, {fontSize: 18}]}>{this.state.storeInfo.storeName}</Text>
            </Separator>
            <ListItem style={styles.header_item}>
              <Text>检查项目：{this.state.storeEvalut.length}</Text>
            </ListItem>
            <ListItem style={styles.header_item}>
              <Text>正常数：{this.state.normal}</Text>
            </ListItem>
            <ListItem style={styles.header_item}>
              <Text>列外数：{this.state.other}</Text>
            </ListItem>
            <ListItem style={styles.header_item}>
              <Text>不适用数：{this.state.not}</Text>
            </ListItem>
            <ListItem style={{height: scaleSize(120)}}>
              <Left><Text>{this.state.storeInfo.updateTime}</Text></Left>
              <Right><Text>操作人：{this.state.storeInfo.reviewer}</Text></Right>
            </ListItem>
          </List>

          <Accordion
            style={{backgroundColor: whiteColor}}
            sections={this.state.storeEvalut}
            activeSections={this.state.activeSections}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
            underlayColor={whiteColor}
          />
        </Content>
      </View>
    )
  }

  _renderHeader = (section, index, isActive, sections) => {
    return (
      <View
        style={[styles.header, commonStyle.borderTopBottom, {
          backgroundColor: (isActive ? whiteColor : backgroundColor),
          marginBottom: isActive ? scaleSize(0) : scaleSize(20)
        }]}>
        <Text style={[commonStyle.color_back, styles.header_text]}>{section.projectType}</Text>
        <Image style={[styles.icon_show, {
          transform: [{rotate: !isActive ? '0deg' : '90deg'}]
        }]} source={require("../../../assets/resource/evalut/icon_show.png")}/>
      </View>
    );
  }

  _renderContent = (section, index, isActive, sections) => {
    return section.data.map((item) => (
      <View key={item.reviewProjectId}>
        <View>
          <ListItem style={{height: scaleSize(60)}}>
            <Text style={commonStyle.color_back}>{item.projectCode}</Text>
          </ListItem>
          {/*<ListItem><Text>{item.projectData}</Text></ListItem>*/}
          <ListItem style={{height: scaleSize(60)}}><Text>{item.projectRequire}</Text></ListItem>
          <View style={styles.image_wrap}>
            {
              item.photos && item.photos.split(',').map(v => (
                <CustomImage
                  key={v}
                  style={styles.image}
                  image={BASE_URL + v}
                />
              ))
            }
          </View>
          {/*<ListItem>
            <Left>
              <Text>{item.updateTime}</Text>
            </Left>
          </ListItem>*/}
          {this.followList(item)}
        </View>
      </View>
    ))
  }

  followList = (item) => {
    let renderList = null;
    if (item.followList.length) {
      renderList = item.followList.map((v, i) =>
        <List
          key={v.followId}
          style={{
            marginTop: scaleSize(10),
            backgroundColor: '#f5f5f5',
            marginLeft: scaleSize(20 * i > 1 ? 1 : 0)
          }}
        >
          <View style={{padding: scaleSize(20), paddingBottom: scaleSize(0)}}>
            <Text style={styles.colofollowListr_red}>{v.follower}：{v.followDesc}</Text>
            <View styles={styles.image_wrap}>
              {v.followPhotos && this.showImage(v.followPhotos)}
            </View>
          </View>
          <ListItem style={{height: scaleSize(60)}}>
            <Left>
              <Text>{v.createTime}</Text>
            </Left>
          </ListItem>
        </List>
      )
    }

    return renderList;
  };

  showImage = (value) => {
    let imgs = value.split(",");
    return imgs.map((item, index) => <CustomImage key={index} image={item} style={styles.image}/>)
  }
}

const styles = StyleSheet.create({
  color_red: {
    color: '#F00',
  },

  container: {
    flex: 1,
  },

  center: {
    flex: 1,
  },
  header: {
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(86),
  },
  header_desc: {
    marginBottom: scaleSize(20),
    backgroundColor: whiteColor,
  },
  content: {
    paddingHorizontal: scaleSize(20),
  },
  content_item: {
    padding: scaleSize(20),
    flexDirection: 'row',
    borderBottomColor: lightGaryColor,
    borderBottomWidth: scaleSize(1),
    borderStyle: 'solid',
  },
  content_desc: {
    flex: 1,
  },
  submit_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon_submit: {
    width: scaleSize(48),
    height: scaleSize(48),
  },
  icon_margin: {
    marginTop: scaleSize(10),
    marginLeft: scaleSize(20),
    marginRight: scaleSize(20),
  },
  header_text: {
    flex: 1,
    paddingLeft: scaleSize(12),
    borderLeftColor: headerColor,
    borderLeftWidth: scaleSize(4),
    borderStyle: 'solid',
    fontSize: 18
  },
  icon_show: {
    width: scaleSize(45),
    height: scaleSize(45),
  },
  image_wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    margin: scaleSize(10),
    width: scaleSize(170),
    height: scaleSize(95)
  },

  header_item: {
    paddingLeft: scaleSize(20),
    marginRight: scaleSize(20),
    height: scaleSize(80)
  },
})
