/*
*   react-native 页面做适配
* */

import {Dimensions, PixelRatio} from 'react-native'

export const DEVICE_WIDTH = Dimensions.get('window').width;      //设备的宽度
export const DEVICE_HEIGHT = Dimensions.get('window').height;    //设备的高度

const DEFAULT_PIXEL = 2;                           //iphone6的像素密度

//px转换成dp
const w = 750 / DEFAULT_PIXEL;
const h = 1334 / DEFAULT_PIXEL;
const scale = Math.min(DEVICE_HEIGHT / h, DEVICE_WIDTH / w);   //获取缩放比例

/**
 * 设置text为sp
 * @param size sp
 * return number dp
 */
export function scaleSize(size) {
    size = Math.round(size * scale + 0.5);
    return size / DEFAULT_PIXEL;
}