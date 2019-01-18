/*
* 考评详情
* */
import React from "react"
import {StyleSheet, View, Text, Image, TouchableOpacity, Modal, Platform} from "react-native"
import {Content, Button, ListItem} from "native-base";
import Accordion from 'react-native-collapsible/Accordion'
import Header from "../../../components/Header";
import commonStyle from "../../../common/commStyle"
import {scaleSize} from "../../../common/screenUtil";
import {
  backgroundColor,
  headerColor,
  lightGaryColor,
  whiteColor,
  fontSize20,
  fontSize14,
} from "../../../common/styles";
import {getPlanDetails, submitAll} from "../../../api/evaluReq";
import {classify, showToast} from "../../../common/util";
import {uploadImage} from "../../../api/evaluReq";
import EvalutStatus from "../../../components/EvalutStatus";

/*mobx*/
import {observer, inject} from 'mobx-react'
import {action, computed} from 'mobx'
import {getStoreEvalutList} from "../../../api/storeReq";
import ShopTitle from "../../../components/ShopTitle";

@inject("store")
@observer
export default class EvalutDetails extends React.Component {
  @action//列表
  setList(list) {
    this.props.store.EvalutList.setEvalutList(list)
  }

  @action//当前Index
  setIndex(index) {
    this.props.store.EvalutIndex.setEvalutIndex(index)
  }

  @action
  setPath(photo) {
    this.props.store.PhotoPath.setPhotoPath(photo);
  }

  @computed get getEvalutList() {
    return this.props.store.EvalutList.evalutList;
  }

  /*获取截屏保存的图片*/
  @computed get getPhotoPath() {
    return this.props.store.PhotoPath.photoPath;
  }

  async componentDidMount() {
    console.log('-------', this.getPhotoPath)
    if (Platform.OS === 'ios') {
      if (this.getPhotoPath) {
        let uri = await uploadImage(this.getPhotoPath, 'screen' + Date.now());
        console.log('截屏上传的图片', uri);
        showToast('上传成功', 'success')
        this.setPath(uri.imgUrl)
      }
    }

    if (this.props.navigation.state.params.storeId) {
      this._getStoreEvalutList(this.props.navigation.state.params.storeId);
    } else {
      this._getPlanDetails(this.props.navigation.state.params.reviewId);
    }
  }

  constructor(props) {
    super()
    this.state = {
      activeSections: [0],
      data: [],
      modalVisible: false,//确认提交全部弹窗
      reviewId: 0
    }
  }

  /*提交所有*/
  confirmReportAll = () => {
    this.setState({modalVisible: true})
  }

  /*确认提交*/
  confirmAll = async () => {
    let list = [];
    this.state.data.forEach(v => {
      v.data.forEach(_v => list.push(_v))
    })
    let result = await submitAll(list[0].reviewId);
    await this.setState({modalVisible: false});
    if (result.code !== 0) {
      showToast(result.msg, 'error')
    } else {
      showToast('提交成功', 'success')
      const {params} = this.props.navigation.state;
      params.callback();
      this.props.navigation.goBack();
    }
  }

  /*关闭提示框*/
  closeModal = () => {
    this.setState({modalVisible: false})
  }

  _getPlanDetails = async (reviewId) => {
    let result = await getPlanDetails(reviewId)
    let list = result.storeReview.projectList
    let dest = classify(list)
    this.setState({data: dest, reviewId: result.storeReview.reviewId})
  }

  _getStoreEvalutList = async (storeId) => {
    let result = await getStoreEvalutList(storeId);
    let list = result.storeReview.projectList
    let dest = classify(list)
    this.setState({data: dest, reviewId: result.storeReview.reviewId})
  }

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  gotoItem = (item) => {
    const {params} = this.props.navigation.state;
    let data = [];
    this.state.data.forEach(v => {
      v.data.forEach(_v => data.push(_v))
    })
    this.setList(data);//mobx保存当前考评的列表
    let _index = this.getEvalutList.findIndex(v => v.reviewProjectId === item.reviewProjectId);
    this.setIndex(_index);
    this.props.navigation.navigate("EvalutItem", {
      reviewId: this.state.reviewId,
      storeName: params.storeName,
      callback: (reviewId) => this._getPlanDetails(reviewId)
    })
  }

  render() {
    const {params} = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <Header isBack title={"考评"}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.icon_confirm, styles.confirm_total]}
            onPress={this.confirmReportAll}
          >
            <Image style={styles.icon_confirm}
                   source={require("../../../assets/resource/evalut/icon_confirm.png")}/>
          </TouchableOpacity>
        </Header>
        <ShopTitle title={params.storeName}/>
        <Content style={styles.center}>
          {/*手风琴动画*/}
          <Accordion
            style={{backgroundColor: whiteColor}}
            sections={this.state.data}
            activeSections={this.state.activeSections}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
            underlayColor={whiteColor}
          />
        </Content>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.5)'
          }}>
            <View style={{
              position: 'relative',
              width: scaleSize(500),
              height: scaleSize(300),
              backgroundColor: whiteColor,
              borderRadius: scaleSize(20),
            }}>
              <View style={styles.tips_text}>
                <Text style={{color: '#000'}}>确定提交全部吗!</Text>
              </View>
              <View style={styles.btn_wrapper}>
                <Button light style={styles.btn_item}
                        onPress={this.closeModal}><Text style={{color: '#000'}}>取消</Text></Button>
                <Button style={styles.btn_item} onPress={this.confirmAll}><Text
                  style={{color: whiteColor}}>确认</Text></Button>
              </View>
            </View>
          </View>
        </Modal>
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
        <Text style={styles.header_text}>{section.projectType}</Text>
        <Image style={[styles.icon_show, {
          transform: [{rotate: !isActive ? '0deg' : '90deg'}]
        }]} source={require("../../../assets/resource/evalut/icon_show.png")}/>
      </View>
    );
  };

  _renderContent = (section, index, isActive, sections) => {
    return section.data.map((item, i) => (
      <View key={item.reviewProjectId} style={[styles.content, {
        marginBottom: isActive ? scaleSize(20) : scaleSize(0)
      }]}>
        <View style={styles.content_item}>
          <Text style={{fontSize: fontSize14, marginRight: scaleSize(10)}}>{item.projectCode}</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.content_desc}
            onPress={() => this.gotoItem(item)}
          >
            <Text style={{color: '#000'}}>{item.projectData}</Text>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
              <EvalutStatus checkResult={item.checkResult}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ))
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor
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
    flex: 1,
  },
  header: {
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(86),
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
    color: '#333'
  },
  icon_show: {
    width: scaleSize(45),
    height: scaleSize(45),
  },

  tips_text: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_wrapper: {
    flexDirection: 'row',
    height: scaleSize(80),
  },
  btn_item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(80)
  }
})
