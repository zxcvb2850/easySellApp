import React from "react"
import { Platform } from "react-native"
import {Input} from "native-base"

export default class TextInputZH extends React.Component {
    shouldComponentUpdate(nextProps) {
        return Platform.OS !== 'ios' || (this.props.value === nextProps.value &&
            (nextProps.defaultValue == undefined || nextProps.defaultValue == '')) ||
            (this.props.defaultValue === nextProps.defaultValue && (nextProps.value == undefined || nextProps.value == ''));
    }

    render() {
        return <Input {...this.props} />;
    }
};