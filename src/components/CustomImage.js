/**
 * 加载失败的图片
 * 如果图片加载失败则显示404图片
 *
 * image uri
 * */
import React from "react";
import PropTypes from "prop-types";
import { Image } from "react-native";

export default class CustomImage extends React.Component {
    static propTypes = {
        image: PropTypes.string.isRequired
    };

    async componentWillReceiveProps(nextProps) {
        if (nextProps.image !== this.props.image) {
            this.setState({ image: { uri: nextProps.image } })
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            image: { uri: props.image }
        }
    }

    errorImage = () => {
        this.setState({ image: require("../assets/resource/evalut/img_not.jpg") })
    }

    render() {
        return <Image
            {...this.props}
            source={this.state.image}
            onError={this.errorImage}
        />;
    }
}