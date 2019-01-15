/**
 * 已完结的项目
 * */
import React from "react";
import {StyleSheet, View, Text, Image} from "react-native"
import {Content, List, Left, Right, ListItem} from "native-base"
import Header from "../../../components/Header";
import {getHistoryDetail} from "../../../api/evaluReq"
import {
  backgroundColor,
  headerColor,
  lightGaryColor,
  whiteColor,
  fontSize20,
  fontSize14,
  fontSize16
} from "../../../common/styles"
import Accordion from 'react-native-collapsible/Accordion'
import {classify} from "../../../common/util"
import commonStyle from "../../../common/commStyle"
import {scaleSize, setSpText} from "../../../common/screenUtil"
import {BASE_URL} from "../../../config/config";
import CustomImage from "../../../components/CustomImage";
import EvalutStatus from "../../../components/EvalutStatus";

export default class EvalutEnd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      storeInfo: {},//店铺详情
      storeEvalut: [],//店铺考评详情
      activeSections: [0],
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
  }

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  render() {
    let {params} = this.props.navigation.state
    return (
      <View style={styles.container}>
        <Header isBack title={"考评详情"}/>
        <ListItem itemDivider>
          <Text style={{fontSize: fontSize20, color: '#000'}}>{this.state.storeInfo.storeName}</Text>
        </ListItem>
        <Content style={styles.container}>
          <List style={styles.header_desc}>
            <ListItem style={styles.header_item}>
              <Text style={styles.item_text}>检查项目：{this.state.storeEvalut.length}</Text>
            </ListItem>
            <ListItem style={styles.header_item}>
              <Text style={styles.item_text}>正常数：{this.state.normal}</Text>
            </ListItem>
            <ListItem style={styles.header_item}>
              <Text style={styles.item_text}>列外数：{this.state.other}</Text>
            </ListItem>
            <ListItem style={styles.header_item}>
              <Text style={styles.item_text}>不适用数：{this.state.not}</Text>
            </ListItem>
            <View style={{
              paddingVertical: scaleSize(20),
              marginHorizontal: scaleSize(40),
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: scaleSize(120)
            }}>
              <Text style={styles.list_timer_text}>{this.state.storeInfo.updateTime}</Text>
              <Text style={styles.list_timer_text}>操作人：{this.state.storeInfo.reviewer}</Text>
            </View>
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
        <Text style={[styles.header_text]}>{section.projectType}</Text>
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
          <View style={[styles.item_title, commonStyle.borderBottom, {height: scaleSize(80)}]}>
            <Text style={[commonStyle.color_back, {fontWeight: '700'}]}>{item.projectCode}</Text>
            <EvalutStatus checkResult={item.exceptionStatus}/>
          </View>
          {/*<ListItem><Text>{item.projectData}</Text></ListItem>*/}
          <View style={[styles.item_title, commonStyle.borderBottom]}>
            <Text style={{color: '#666'}}>{item.projectRequire}</Text>
          </View>
          <ListItemDesc
            value={'例外描述'}
            desc={item.exception}
            photos={item.photos}
            timer={item.updateTime}
          />
          {this.followList(item)}
        </View>
      </View>
    ))
  }

  followList = (item) => {
    let renderList = null;
    console.log('============', item)
    if (item.followList.length) {
      renderList = item.followList.map((v, i) =>
        <ListItemDesc
          key={v.followId}
          index={i}
          value={`追踪例外${i + 1}`}
          name={v.follower}
          desc={v.followDesc}
          photos={v.followPhotos}
          timer={v.createTime}
        />
      )
    }

    return renderList;
  };
}
ListItemDesc = ({value, name, desc, photos, timer, index} = props) => (
  <View
    style={[styles.list_item_desc, {
      marginLeft: scaleSize(20 * index ? 1 : 0)
    }]}
  >
    <Text style={{
      padding: scaleSize(20 * index ? 1 : 0),
      paddingTop: scaleSize(20),
      paddingLeft: scaleSize(30),
      paddingRight: scaleSize(10),
    }}>{value}:</Text>
    <View style={styles.list_item_right}>
      <View styles={styles.image_wrap}>
        {
          photos && photos.split(',').map(v => (
            <CustomImage
              key={v}
              style={styles.image}
              image={BASE_URL + v}
            />
          ))
        }
      </View>
      <Text style={[styles.color_orange, {fontSize: fontSize16}]}>{desc}</Text>
      <View style={[styles.list_item_timer, commonStyle.borderBottom]}>
        <Text style={styles.list_timer_text}>{timer}</Text>
        <Text style={styles.list_timer_text}>{name ? name : ''}</Text>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  color_orange: {
    color: '#fe6e4b',
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
    color: '#333',
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
  item_title: {
    paddingVertical: scaleSize(20),
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list_item_desc: {
    flexDirection: 'row',
    margin: scaleSize(20),
  },
  list_item_right: {
    flex: 1,
    padding: scaleSize(20),
    borderRadius: scaleSize(16),
    backgroundColor: '#F5F5F5'
  },
  list_item_timer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: scaleSize(60),
  },
  list_timer_text: {
    color: '#808080',
    fontSize: fontSize14
  },
  item_text: {
    fontSize: fontSize16
  }
})
