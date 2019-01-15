/**
 * 列外详情
 * */
import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity, BackHandler} from "react-native";
import {Content, List, ListItem, Left, Right, Item, Input} from "native-base"
import Header from "../../../components/Header";
import {scaleSize, setSpText} from "../../../common/screenUtil";
import commonStyle from "../../../common/commStyle"
import {BASE_URL} from "../../../config/config";
import {showToast} from "../../../common/util";
import ImagePicker from "react-native-image-picker"
import {exceptionFollow, exceptionSave, uploadImage} from "../../../api/evaluReq";
import {dangerColor, fontSize14, fontSize16, fontSize18, fontSize20, whiteColor} from "../../../common/styles";
import CustomImage from "../../../components/CustomImage";

/*mobx*/
import {inject, observer} from "mobx-react";
import {computed} from "mobx";

//图片选择器参数设置
const options = {
  title: '选择图片',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '图片库',
  cameraType: 'back',
  mediaType: 'photo',
  maxWidth: 270,
  maxHeight: 195,
  videoQuality: 'high',
  storageOptions: {
    skipBackup: true,
  }
};

@inject('store')
@observer
export default class FeedbackDetail extends React.Component {
  @computed get userInfo() {
    return this.props.store.UserInfo.userInfo;
  }

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

  constructor(props) {
    super(props)
    this.state = {
      data: {},//列外数据
      imgs: "",//添加的图片
      value: "",
    }

    this._exceptionFollow()
  }

  _exceptionFollow = async () => {
    const {params} = this.props.navigation.state
    let result = await exceptionFollow(params.reviewProjectId);
    console.log(result);
    this.setState({data: result.storeReviewProject})
  }

  /**/
  _changeText = (value) => {
    console.log(value)
    this.setState({value})
  }

  /*上传图片*/
  choosePic = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        //console.log('用户取消了选择！');
      } else if (response.error) {
        alert("ImagePicker发生错误：" + response.error);
      } else if (response.customButton) {
        alert("自定义按钮点击：" + response.customButton);
      } else {
        let imgArr = this.state.imgs;
        let imgs = imgArr ? imgArr.split(",") : []
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        let uri = await uploadImage(response.uri, response.fileName);
        console.log(imgs, uri, response.uri);
        showToast('上传成功', 'success')
        imgs.push(uri.imgUrl)
        imgArr = imgs.join(",")
        this.setState({imgs: imgArr})
      }
    });
  }

  /*删除图片*/
  deleteImage = (zIndex) => {
    console.log(zIndex);
    let imgArr = this.state.imgs;
    let imgs = imgArr.split(",")
    imgs.splice(zIndex, 1)
    imgArr = imgs.join(",")
    this.setState({imgs: imgArr})
  }

  /*保存*/
  exceptionSave = async (bool) => {
    if (!bool) {
      if (this.state.value == null) {
        return showToast("请输入不合格备注", "warning")
      }
      if (this.state.imgs == null) {
        return showToast("请上传不合格图片", "warning")
      }
    }
    let userInfo = this.userInfo;
    console.log(this.state.data)
    console.log(this.state.data.reviewProjectId, this.state.data.reviewId, this.state.data.storeId, userInfo.userId, userInfo.fullname, bool ? 2 : 1, this.state.value || "", this.state.imgs || "")
    await exceptionSave(this.state.data.reviewProjectId, this.state.data.reviewId, this.state.data.storeId, userInfo.userId, userInfo.fullname, bool ? 2 : 1, this.state.value || "", this.state.imgs || "")
    showToast("保存成功", "success")
    await this.setState({value: "", imgs: ""})
    this._exceptionFollow();
  }

  render() {
    const {params} = this.props.navigation.state;

    return (
      <View style={{flex: 1, backgroundColor: whiteColor}}>
        <Header isBack={this.onBackPress} title={"例外跟踪"}/>
        <ListItem itemDivider>
          <Text style={[styles.color_back, {fontSize: fontSize20}]}>{params.storeName}</Text>
        </ListItem>
        <Content>
          <List>
            <ListItem>
              <Left>
                <Text style={[styles.color_back, {fontSize: fontSize18}]}>{this.state.data.projectType}</Text>
              </Left>
              <Right>
                <Text style={{color: '#F00', fontSize: fontSize18}}>不合格</Text>
              </Right>
            </ListItem>
            <Text style={[commonStyle.borderBottom, {
              marginHorizontal: scaleSize(40),
              paddingHorizontal: scaleSize(20),
              paddingVertical: scaleSize(30),
              fontSize: fontSize16
            }]}>{this.state.data.projectRequire}</Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: scaleSize(20),
            }}>
              {
                this.state.data.photos && this.state.data.photos.split(',').map(item => (
                  <CustomImage
                    key={item}
                    style={styles.image}
                    image={BASE_URL + item}
                  />
                ))
              }
            </View>
            <ListItem>
              <Left><Text style={{fontSize: fontSize14}}>{this.state.data.updateTime}</Text></Left>
            </ListItem>
          </List>
          {this.followList()}
          {
            this.state.data.exceptionStatus && this.state.data.exceptionStatus !== 2 ?
              <View style={{marginHorizontal: scaleSize(30)}}>
                <View style={styles.comment}>
                  <View style={styles.image_wrap}>
                    {this.showImages()}
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={[styles.image]}
                      onPress={() => this.choosePic()}
                    >
                      <Image
                        source={require("../../../assets/resource/evalut/icon_add.png")}
                        style={{width: scaleSize(170), height: scaleSize(95)}}/>
                    </TouchableOpacity>
                  </View>
                  <Item style={styles.input_wrap}>
                    <Image style={{width: scaleSize(48), height: scaleSize(48)}}
                           source={require("../../../assets/resource/evalut/icon_comment.png")}/>
                    <Input
                      placeholder="请输入备注"
                      editable={true}//是否可编辑
                      style={[styles.inputStyle, commonStyle.borderBottom]}//input框的基本样式
                      value={this.state.value}
                      //onEndEditing={(evt) => {
                      //this.setState({ text:evt.nativeEvent.text });
                      //this._changeText(evt.nativeEvent.text)
                      // }}
                      onChangeText={(value) => {
                        this._changeText(value)
                      }}//输入框改变触发的函数
                    />
                  </Item>
                </View>
                < View style={styles.btn_wrapper}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.btn_image}
                    onPress={() => this.exceptionSave(true)}
                  >
                    <Image style={styles.btn_image}
                           source={require("../../../assets/resource/evalut/btn_qualified.png")}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.btn_image}
                    onPress={() => this.exceptionSave(false)}
                  >
                    <Image style={styles.btn_image}
                           source={require("../../../assets/resource/evalut/btn_unqualified.png")}/>
                  </TouchableOpacity>
                </View>
              </View>
              : null
          }
        </Content>
      </View>
    );
  }

  followList = () => this.state.data.followList && this.state.data.followList.map((item, index) =>
    <View
      key={item.followId}
      style={[{
        marginLeft: scaleSize(20),
        padding: scaleSize(20),
      }, commonStyle.borderBottom]}
    >
      <Text>{item.follower}: <Text style={{color: dangerColor}}>{item.followDesc}</Text></Text>
      <View style={styles.image_wrap}>
        {
          item.followPhotos && item.followPhotos.split(",").map((v, i) => (
            <CustomImage
              key={i}
              style={styles.image}
              image={BASE_URL + v}
            />)
          )
        }
      </View>
      <Text>修改时间：{item.createTime}</Text>
    </View>
  )

  showImages = () => {
    let show = this.state.imgs ? this.state.imgs.split(",").map((v, i) => (
      <View key={i} style={styles.image_item}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.delete_icon, {
            position: 'absolute',
            right: scaleSize(12),
            top: scaleSize(12),
            zIndex: 1,
          }]}
          onPress={() => this.deleteImage(i)}
        >
          <Image style={styles.delete_icon}
                 source={require("../../../assets/resource/evalut/icon_error_yes.png")}/>
        </TouchableOpacity>
        <Image source={{uri: BASE_URL + v}} style={styles.image}/>
      </View>
    )) : null
    return show;
  }
}

const styles = StyleSheet.create({
  color_back: {
    color: '#000',
  },

  container: {
    paddingHorizontal: scaleSize(20),
    flex: 1,
  },

  title: {
    fontSize: setSpText(18),
  },
  content: {},
  image_wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    margin: scaleSize(20),
    width: scaleSize(170),
    height: scaleSize(95)
  },
  comment: {
    marginTop: scaleSize(22),
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

  btn_wrapper: {
    marginVertical: scaleSize(40),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn_image: {
    width: scaleSize(249),
    height: scaleSize(90)
  }
})
