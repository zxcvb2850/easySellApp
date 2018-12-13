/**
 * statusBar 相关的颜色
*/
import { observable, action } from 'mobx';

//statusBar 颜色
export default class statusBar{
    @observable
    statusBarColor = "";

    constructor(color){
        this.statusBarColor = color;
    }

    @action
    setStatusBarColor(color) {
        this.statusBarColor = color;
    }
}