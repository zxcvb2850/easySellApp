/**
 * 计划考评考评每一项
 * */
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  DeviceEventEmitter,
  BackHandler,
  Platform,
} from "react-native";
import {Content, List, ListItem, Left, Body, Right, Radio, Button, Item, Input} from "native-base";
import Header from "../../../components/Header";
import {DEVICE_WIDTH, scaleSize} from "../../../common/screenUtil";
import {garyColor, lightGaryColor, whiteColor} from "../../../common/styles";
import {BASE_URL} from "../../../config/config";
import {saveSingle, uploadImage} from "../../../api/evaluReq";
import {showToast} from "../../../common/util";
import ImagePicker from "react-native-image-picker"

/*mbox*/
import {inject, observer} from "mobx-react";
import {computed, action} from "mobx";
import CustomImage from "../../../components/CustomImage";

//图片选择器参数设置
const options = {
  title: '选择图片',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '相册图片',
  maxWidth: 270,
  maxHeight: 195,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

@inject("store")
@observer
export default class EvalutItem extends React.Component {
  @action
  setList(list) {
    this.props.store.EvalutList.setEvalutList(list);
  }

  /*上一个列表的index*/
  @action
  prevEvalut() {
    this.props.store.EvalutIndex.prevEvalutIndex(this.getEvalutIndex)
  }

  /*下一个列表index*/
  @action
  nextEvalut() {
    this.props.store.EvalutIndex.nextEvalutIndex(this.getEvalutIndex)
  }

  @action
  setPhotoPath() {
    this.props.store.PhotoPath.setPhotoPath(null);
  }

  /*获取列表*/
  @computed get getEvalutList() {
    return this.props.store.EvalutList.evalutList;
  }

  /*获取截屏保存的图片*/
  @computed get getPhotoPath() {
    return this.props.store.PhotoPath.photoPath;
  }

  /*获取列表对应的index*/
  @computed get getEvalutIndex() {
    return this.props.store.EvalutIndex.evalutIndex
  }

  componentWillUnmount() {
    /*移除监听返回按钮*/
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  /*获取mobx的数据*/
  async componentDidMount() {
    /*监听返回按钮*/
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

    if (this.getPhotoPath) {
      if (Platform.OS === 'android') {
        let list = this.getEvalutList;
        let index = this.getEvalutIndex;
        let imgs = list[index].photos ? list[index].photos.split(',') : [];
        console.log('======', this.getPhotoPath)
        let uri = await uploadImage(this.getPhotoPath, 'screen' + Date.now());
        console.log('截屏上传的图片', imgs, uri);
        showToast('上传成功', 'success')
        imgs.push(uri.imgUrl)
        list[index].photos = imgs.join(',');
        await this.setList(list)
      } else {
        let list = this.getEvalutList;
        let index = this.getEvalutIndex;
        let imgs = list[index].photos ? list[index].photos.split(',') : [];
        console.log('======', this.getPhotoPath)
        imgs.push(this.getPhotoPath)
        list[index].photos = imgs.join(',');
        await this.setList(list)
      }
    }

    this.setState({
      index: this.getEvalutIndex,
      list: this.getEvalutList,
      value: this.getEvalutList[this.getEvalutIndex].exception || "",
      radio: this.getPhotoPath ? 3 : this.getEvalutList[this.getEvalutIndex].checkResult,
    })
    this._startAnimated();
  }

  onBackPress = () => {
    this.setPhotoPath();
    const {params} = this.props.navigation.state;
    params.callback(params.reviewId);
    this.props.navigation.goBack();
    return true;
  }

  constructor() {
    super()
    this.state = {
      index: 0,//当前考评
      list: [],//考评列表
      radio: 2,//单选框
      value: "",
      animatedValue: new Animated.Value(0),
    };

    this.rotateAnimated = Animated.timing(
      this.state.animatedValue,
      {
        toValue: 1,
        duration: 3000,
      }
    );
  }

  changeIndex = (type) => {
    //this.input._root.blur();
    if (type === 'prev') {
      this.prevEvalut()
    } else {
      this.nextEvalut()
    }
    this.setState({
      index: this.getEvalutIndex,
      radio: this.getEvalutList[this.getEvalutIndex].checkResult,
      value: this.getEvalutList[this.getEvalutIndex].exception || ""
    });
    this._startAnimated();
  }

  radioSelect = (type) => {
    //this.input._root.blur();
    this.setState({radio: type})
    this._startAnimated()
  }

  /*输入框发生变化*/
  _changeText = (value) => {
    this.setState({value: value})
    let list = this.getEvalutList;
    list[this.getEvalutIndex].exception = value;
    this.setList(list);
  }

  /*动画开始*/
  _startAnimated() {
    this.rotateAnimated.start();
  }

  /*上传图片*/
  choosePic = () => {
    ImagePicker.showImagePicker(options, async (response) => {

      if (response.didCancel) {
        //console.log('用户取消了选择！');
      } else if (response.error) {
        alert("ImagePicker发生错误：" + response.error);
      } else if (response.customButton) {
        alert("自定义按钮点击：" + response.customButton);
      } else {
        let list = this.state.list;
        let imgs = list[this.state.index].photos ? list[this.state.index].photos.split(',') : [];
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        let imgName = response.fileName ? response.fileName : response.uri.match(/([\w|-]+\.jpg$)/)[1];
        let uri = await uploadImage(response.uri, imgName);
        console.log(imgs, uri, response.uri);
        showToast('上传成功', 'success')
        imgs.push(uri.imgUrl)
        list[this.state.index].photos = imgs.join(',');
        this.setList(list)
      }
    });
  }
  /*删除图片*/
  deleteImage = (index) => {
    let list = this.state.list;
    let imgs = list[this.state.index].photos.split(',');
    imgs.splice(index, 1)
    list.photos = imgs;
    list[this.state.index].photos = imgs.join(',');
    this.setState({list})
  }

  /*提交报告*/
  confirmReport = async () => {
    if (this.state.radio !== 1) {
      let data = this.state.list[this.state.index];
      await saveSingle(data.reviewProjectId, data.reviewId, data.storeId, data.projectCode, data.projectType, data.projectRequire, this.state.radio, this.state.radio === 3 ? data.exception : "", this.state.radio === 3 ? data.photos : "");
      showToast('提交成功', 'success')
      let list = this.getEvalutList
      list[this.state.index] = data
      list[this.state.index].checkResult = this.state.radio
      this.setList(list)
    } else {
      showToast('请选择考评状态', 'warning')
    }
  }

  render() {
    const heightSizeFalse = this.state.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 0]
    });
    const heightSizeTrue = this.state.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, scaleSize(500), scaleSize(500)]
    });

    const {params} = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <Header isBack={this.onBackPress} title={"考评详情"}/>
        <ListItem style={{height: scaleSize(90)}}><Text style={{color: '#000', fontSize: 18}}>{params.storeName}</Text></ListItem>
        <View style={{flex: 1, paddingHorizontal: scaleSize(10)}}>
          <Content style={styles.center}>
            {this.state.list[this.state.index] && this.showHeader()}
            <Animated.View
              style={{
                marginHorizontal: scaleSize(30),
                marginVertical: scaleSize(20),
                height: this.state.radio !== 3 ? heightSizeFalse : heightSizeTrue,
                overflow: 'hidden'
              }}
            >
              <View style={styles.comment}>
                <View style={styles.image_wrap}>
                  {this.state.list[this.state.index] ? this.showImages() : null}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.image, {margin: scaleSize(10)}]}
                    onPress={this.choosePic}
                  >
                    <Image source={require("../../../assets/resource/evalut/icon_add.png")}
                           style={styles.image}/>
                  </TouchableOpacity>
                </View>
                <Item style={styles.input_wrap}>
                  <Image style={{width: scaleSize(48), height: scaleSize(48)}}
                         source={require("../../../assets/resource/evalut/icon_comment.png")}/>
                  <Input
                    ref={input => this.input = input}
                    placeholder="请输入备注"
                    editable={true}//是否可编辑
                    style={styles.inputStyle}//input框的基本样式
                    value={this.state.value}
                    onChangeText={(value) => {
                      this._changeText(value)
                    }}//输入框改变触发的函数
                  />
                </Item>
              </View>
            </Animated.View>
          </Content>
          <View style={styles.checkout_select}>
            <ListItem
              onPress={() => this.radioSelect(2)}
              selected={this.state.radio === 2}
              style={styles.select_item}
            >
              <Left>
                <Text>正常</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() => this.radioSelect(2)}
                  color={"#f0ad4e"}
                  selectedColor={"#5cb85c"}
                  selected={this.state.radio === 2}
                />
              </Right>
            </ListItem>
            <ListItem
              onPress={() => this.radioSelect(3)}
              selected={this.state.radio === 3}
              style={styles.select_item}
            >
              <Left>
                <Text>例外</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() => this.radioSelect(3)}
                  color={"#f0ad4e"}
                  selectedColor={"#5cb85c"}
                  selected={this.state.radio === 3}
                />
              </Right>
            </ListItem>
            <ListItem
              onPress={() => this.radioSelect(4)}
              selected={this.state.radio === 4}
              style={styles.select_item}
            >
              <Left>
                <Text>不适用</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() => this.radioSelect(4)}
                  color={"#f0ad4e"}
                  selectedColor={"#5cb85c"}
                  selected={this.state.radio === 4}
                />
              </Right>
            </ListItem>
          </View>
        </View>
        <View style={styles.footer}>
          {/*上一个*/}
          <View style={styles.footer_btn}>
            {
              this.state.index - 1 >= 0 ?
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.btn_image}
                  onPress={() => this.changeIndex('prev')}
                >
                  <Image style={styles.btn_image} source={require("../../../assets/resource/evalut/btn_prev.png")}/>
                </TouchableOpacity>
                : null
            }
          </View>
          {/*提交*/}
          <View style={styles.footer_btn}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.btn_image}
              onPress={this.confirmReport}
            >
              <Image style={styles.btn_image} source={require("../../../assets/resource/evalut/btn_confrim.png")}/>
            </TouchableOpacity>
          </View>
          {/*下一个*/}
          <View style={styles.footer_btn}>
            {
              this.state.index < this.state.list.length - 1 ?
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.btn_image}
                  onPress={() => this.changeIndex('next')}
                >
                  <Image style={styles.btn_image} source={require("../../../assets/resource/evalut/btn_next.png")}/>
                </TouchableOpacity>
                : null
            }
          </View>
        </View>
      </View>
    )
  }

  showHeader = () => (
    <List>
      <ListItem icon>
        <Left>
          <Image style={styles.header_icon}
                 source={require("../../../assets/resource/evalut/icon_code.png")}/>
        </Left>
        <Body>
        <Text>检查编号：{this.state.list[this.state.index].projectCode}</Text>
        </Body>
      </ListItem>
      <ListItem icon>
        <Left>
          <Image style={styles.header_icon}
                 source={require("../../../assets/resource/evalut/icon_region.png")}/>
        </Left>
        <Body>
        <Text>检查类型：{this.state.list[this.state.index].projectType}</Text>
        </Body>
      </ListItem>
      <ListItem icon>
        <Left>
          <Image style={styles.header_icon}
                 source={require("../../../assets/resource/evalut/icon_require.png")}/>
        </Left>
        <Body>
        <Text>检查要求：</Text>
        </Body>
      </ListItem>
      <View style={styles.header_desc_region}>
        <Text>{this.state.list[this.state.index].projectRequire}发生的快乐放假了开始打第三方路队看；
          房间里看撒大家理发苏打绿；客服了可是大姐夫了可是大姐夫了看见的的撒</Text>
      </View>
      <ListItem icon>
        <Left>
          <Image style={styles.header_icon}
                 source={require("../../../assets/resource/evalut/icon_consult.png")}/>
        </Left>
        <Body>
        <Text>参考要求：</Text>
        </Body>
      </ListItem>
      <View style={styles.header_desc_region}>
        <Text>{this.state.list[this.state.index].projectData}</Text>
      </View>
    </List>
  )

  showImages = () => {
    let images = this.state.list[this.state.index].photos;
    let img = null
    if (images) {
      img = images.split(",")
    }
    let show = img ? img.map((item, index) => (
      <View key={index} style={styles.image_item}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.delete_icon, {
            position: 'absolute',
            right: scaleSize(-12),
            top: scaleSize(-12),
            zIndex: 1,
          }]}
          onPress={() => this.deleteImage(index)}
        >
          <Image style={styles.delete_icon}
                 source={require("../../../assets/resource/evalut/icon_error_yes.png")}/>
        </TouchableOpacity>
        <CustomImage
          image={BASE_URL + item}
          style={styles.image}
        />
      </View>
    )) : null
    return show;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    backgroundColor: whiteColor,
  },
  details: {
    paddingHorizontal: scaleSize(10),
    flexDirection: 'row',
  },
  details_text: {
    paddingHorizontal: scaleSize(20),
    flex: 1,
  },
  comment: {
    marginTop: scaleSize(22)
  },
  image_wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image_item: {
    margin: scaleSize(10),
    position: 'relative',
    width: scaleSize(170),
    height: scaleSize(95)
  },
  image: {
    width: scaleSize(170),
    height: scaleSize(95)
  },
  input_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(100),
  },
  inputStyle: {
    paddingHorizontal: scaleSize(40),
    flex: 1,
  },
  delete_icon: {
    width: scaleSize(24),
    height: scaleSize(24),
  },

  checkout_select: {
    marginVertical: scaleSize(20),
    backgroundColor: whiteColor,
  },

  footer: {
    flexDirection: 'row',
    height: scaleSize(100),
  },
  footer_btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(80),
  },
  btn_image: {
    width: scaleSize(250),
    height: scaleSize(90)
  },
  btn_txt: {
    // width: DEVICE_WIDTH / 2,
    // textAlign: 'center',
  },
  header_icon: {
    width: scaleSize(39),
    height: scaleSize(39)
  },
  header_desc_region: {
    marginLeft: scaleSize(70),
    marginRight: scaleSize(40),
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#f5f5f5'
  },
  select_item: {
    height: scaleSize(80),
  }
})
