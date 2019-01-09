import React from "React"
import { View, Text } from "react-native"
import { Spinner } from "native-base"
import Modal from "react-native-modal";

const LoadModal = (props) => props.status ?
    <Modal isVisible={true}>
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Spinner color='blue' />
            <Text style={{color: '#FFF'}}>{props.title}</Text>
        </View>
    </Modal>
    : null

LoadModal.defaultProps = {
    title: '加载中...'
}
export default LoadModal