/**
 * 考评列表
 * */
import {observable, action, computed} from "mobx";
import index from "../index";

/*计划考评相关的信息*/
export class EvalutList {
    @observable
    evalutList = [];

    constructor(list) {
        console.log(list)
        this.evalutList = list;
    }

    @action
    setEvalutList(list) {
        console.log('**************', list)
        this.evalutList = list
    }
}

export class EvalutIndex {
    @observable
    evalutIndex = null;

    constructor(index) {
        this.evalutIndex = index;
    }

    @action
    setEvalutIndex(index) {
        this.evalutIndex = index;
    }

    @action
    prevEvalutIndex(index) {
        this.evalutIndex = index - 1;
    }

    @action
    nextEvalutIndex(index) {
        this.evalutIndex = index + 1;
    }
}