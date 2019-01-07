import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

let VideoFargment = requireNativeComponent('VideoView', VideoView)

const VideoView = (props)=>(
    <VideoFargment {...props} />
)

export default VideoView