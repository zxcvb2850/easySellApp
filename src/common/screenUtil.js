/*
*   react-native 页面做适配
* */

import {Dimensions, PixelRatio, Platform} from 'react-native'

export const DEVICE_WIDTH = Dimensions.get('window').width;      //设备的宽度
export const DEVICE_HEIGHT = Dimensions.get('window').height;    //设备的高度

const PIXEL_RATIO = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();
const DEFAULT_PIXEL = 2;                           //iphone6的像素密度

//px转换成dp
const w = 750 / PIXEL_RATIO;
const h = 1334 / PIXEL_RATIO;
const scale = Math.min(DEVICE_HEIGHT / h, DEVICE_WIDTH / w);   //获取缩放比例

/**
 * 设置text为sp
 * @param size sp
 * return number dp
 */
export function scaleSize(size) {
  size = Math.round(size * scale + 0.5);
  return size / PIXEL_RATIO;
}

export function setSpText(size) {
  //size = Platform.OS === 'ios' ? Math.round((size * scale * 0.5) * PIXEL_RATIO / fontScale) : size
  return size / DEFAULT_PIXEL
}
