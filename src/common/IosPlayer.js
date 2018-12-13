/**
 * ios视频播放
 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { requireNativeComponent } from 'react-native';

let CreateVideoView = requireNativeComponent('VideoView', VideoView);

const VideoView = (props) => (<CreateVideoView {...this.props} />)

VideoView.propTypes = {
    serverIP: PropTypes.string,
    serverPort: PropTypes.string,
    callID: PropTypes.string,
    resID: PropTypes.string,
    state: PropTypes.string
}

export default VideoView;