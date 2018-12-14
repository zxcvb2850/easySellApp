/**
 * 加载失败的图片
 * 如果图片加载失败则显示404图片
 *
 * image uri
 * */
import React from "react";
import PropTypes from "prop-types";
import {Image} from "react-native";

export default class CustomImage extends React.Component {
    static propTypes = {
        image: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props)
        this.state = {
            image: {uri: props.image}
        }
    }

    errorImage = () => {
        this.setState({image: require("../assets/resource/evalut/img_not.jpg")})
    }

    render() {
        return <Image
            {...this.props}
            source={this.state.image}
            onError={this.errorImage}
        />;
    }
}