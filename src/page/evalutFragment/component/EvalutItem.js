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
  TextInput,
  DeviceEventEmitter,
  BackHandler
} from "react-native";
import {Content, ListItem, Left, Right, Radio, Button} from "native-base";
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

//图片选择器参数设置
const options = {
  title: '选择图片',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '图片库',
  cameraType: 'back',
  mediaType: 'photo',
  videoQuality: 'high',
  storageOptions: {
	skipBackup: true,
	path: 'images'
  }
};

@inject("store")
@observer
export default class EvalutItem extends React.Component {
  /*获取列表*/
  @computed get getEvalutList() {
	return this.props.store.EvalutList.evalutList;
  }

  /*获取列表对应的index*/
  @computed get getEvalutIndex() {
	return this.props.store.EvalutIndex.evalutIndex
  }

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

  componentWillUnmount() {
	/*移除监听返回按钮*/
	BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  /*获取mobx的数据*/
  componentDidMount() {
	/*监听返回按钮*/
	BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

	this.setState({
	  index: this.getEvalutIndex,
	  list: this.getEvalutList,
	  value: this.getEvalutList[this.getEvalutIndex].exception || "",
	  radio: this.getEvalutList[this.getEvalutIndex].checkResult,
	})
	this._startAnimated();
	console.log(this.getEvalutList[this.getEvalutIndex])
  }

  onBackPress = () => {
	const {params} = this.props.navigation.state;
	params.callback(true);
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
	console.log(type)
	this.setState({radio: type})
	this._startAnimated()
  }

  /*输入框发生变化*/
  _changeText = (value) => {
	console.log('-----------', value)
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
	  //console.log('Response = ', response);

	  if (response.didCancel) {
		//console.log('用户取消了选择！');
	  }
	  else if (response.error) {
		alert("ImagePicker发生错误：" + response.error);
	  }
	  else if (response.customButton) {
		alert("自定义按钮点击：" + response.customButton);
	  }
	  else {
		let list = this.state.list;
		let imgs = list[this.state.index].photos ? list[this.state.index].photos.split(',') : [];
		// You can also display the image using data:
		// let source = { uri: 'data:image/jpeg;base64,' + response.data };
		let uri = await uploadImage(response.uri);
		showToast('上传成功', 'success')
		imgs.push(BASE_URL + uri.imgUrl)
		list[this.state.index].photos = imgs.join(',');
		this.setList(list)
	  }
	});
  }

  /*提交报告*/
  confirmReport = async () => {
	console.log(this.state.list[this.state.index])
	let data = this.state.list[this.state.index];
	await saveSingle(data.reviewProjectId, data.reviewId, data.storeId, data.projectCode, data.projectType, data.projectRequire, this.state.radio, data.exception, data.photos);
	showToast('提交成功', 'success')
	let list = this.getEvalutList
	list[this.state.index] = data
	list[this.state.index].checkResult = this.state.radio
	this.setList(list)
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

	return (
	  <View style={styles.container}>
		<Header isBack={this.onBackPress} title={"考评详情"}/>
		<View style={{flex: 1, paddingHorizontal: scaleSize(10)}}>
		  <Content style={styles.center}>
			{
			  this.state.list[this.state.index] ?
				<View>
				  <Text
					style={{textAlign: 'center'}}>{this.state.list[this.state.index].projectType}</Text>
				  <View style={styles.details}>
					<Text>{this.state.list[this.state.index].projectCode}</Text>
					<View style={styles.details_text}>
					  <Text>{this.state.list[this.state.index].projectData}</Text>
					  <Text>{this.state.list[this.state.index].projectRequire}</Text>
					</View>
				  </View>
				</View>
				: null
			}
			<Animated.View
			  style={{
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
					style={[styles.image, {margin: 0}]}
					onPress={this.choosePic}
				  >
					<Image source={require("../../../assets/resource/evalut/icon_add.png")}
						   style={styles.image}/>
				  </TouchableOpacity>
				</View>
				<View style={styles.input_wrap}>
				  <TextInput
					placeholder="请输入备注"
					editable={true}//是否可编辑
					style={styles.inputStyle}//input框的基本样式
					value={this.state.value}
					onChangeText={(value) => {
					  this._changeText(value)
					}}//输入框改变触发的函数
				  />
				  <Image style={{width: scaleSize(48), height: scaleSize(48)}}
						 source={require("../../../assets/resource/evalut/icon_comment.png")}/>
				</View>
			  </View>
			</Animated.View>
		  </Content>
		  <View style={styles.checkout_select}>
			<ListItem onPress={() => {
			  this.radioSelect(2);
			}} selected={this.state.radio === 2}>
			  <Left>
				<Text>正常</Text>
			  </Left>
			  <Right>
				<Radio
				  color={"#f0ad4e"}
				  selectedColor={"#5cb85c"}
				  selected={this.state.radio === 2}
				/>
			  </Right>
			</ListItem>
			<ListItem onPress={() => {
			  this.radioSelect(3);
			}} selected={this.state.radio === 3}>
			  <Left>
				<Text>例外</Text>
			  </Left>
			  <Right>
				<Radio
				  color={"#f0ad4e"}
				  selectedColor={"#5cb85c"}
				  selected={this.state.radio === 3}
				/>
			  </Right>
			</ListItem>
			<ListItem onPress={() => {
			  this.radioSelect(4);
			}} selected={this.state.radio === 4}>
			  <Left>
				<Text>不适用</Text>
			  </Left>
			  <Right>
				<Radio
				  color={"#f0ad4e"}
				  selectedColor={"#5cb85c"}
				  selected={this.state.radio === 4}
				/>
			  </Right>
			</ListItem>
		  </View>
		</View>
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
					onPress={this.confirmReport}><Text style={{color: '#FFF'}}>提交</Text></Button>
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

  showImages = () => {
	let images = this.state.list[this.state.index].photos;
	let img = null
	if (images) {
	  img = images.split(",")
	}
	let show = img ? img.map((item, index) => (
	  <Image key={index} source={{uri: item}} style={styles.image}/>
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
	marginTop: scaleSize(20)
  },
  image_wrap: {
	flexDirection: 'row',
	flexWrap: 'wrap'
  },
  image: {
	margin: scaleSize(10),
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
	height: scaleSize(100),
  },
  btn: {
	alignItems: 'center',
	justifyContent: 'center',
	borderColor: garyColor,
	borderWidth: scaleSize(1),
	borderStyle: 'solid',
	width: DEVICE_WIDTH / 3,
	height: scaleSize(100)
  },
  btn_txt: {
	// width: DEVICE_WIDTH / 2,
	// textAlign: 'center',
  }
})
