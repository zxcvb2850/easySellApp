/**
 * 视频截取保存图片地址
 * */
import {observable, action} from "mobx";

export default class PhotoScreen {
    @observable
    photoPath = "";

    constructor(path) {
        this.photoPath = path;
    }

    @action
    setPhotoPath(path) {
        this.photoPath = path;
    }
}