/**
 * 店铺相关的请求
 * */
import BaseServer from "./BaseServer";
import {objChangeUrl} from "../common/util";
import qs from "qs";

/**
 * 获取列外考评列表
 * page 页码
 * limit 每页数量
 * sidx 排序字段
 * order 排序方式 asc、desc
 * storeCode 门店编号
 * storeName 门店名称
 * */
export function exceptionList(page = 1, sidx, order, storeCode, storeName, limit = 20) {
    let url = '/app/review/exceptionList';
    let data = {page, sidx, order, storeCode, storeName, limit};
    return BaseServer.get(url, data);
}

/**
 * 列外考评处理
 * params
 * */
export function exceptionFollow() {
    let url = '/app/review/follow';
    let data = {}
    return BaseServer.get(url, objChangeUrl(data))
}

/**
 * 例外订单保存
 * storeReviewProjectFollow
 * */
export function exceptionSave() {
    let url = '/app/review/followSave';
    let data = {}
    return BaseServer.post(url, data)
}

/**
 * 已经完结的考评列表
 * page 页码
 * limit 每页数量
 * sidx 排序字段
 * order 排序方式 asc、desc
 * storeCode 门店编号
 * storeName 门店名称
 * */
export function getStoreHistory(page = 1, sidx, order, storeCode, storeName, limit = 20) {
    let url = '/app/review/history';
    let data = {page, sidx, order, storeCode, storeName, limit}
    return BaseServer.post(url, data);
}

/**
 * 计划考评的列表
 * page 页码
 * limit 每页数量
 * sidx 排序字段
 * order 排序方式 asc、desc
 * storeCode 门店编号
 * storeName 门店名称
 * */
export function getPlanList(page = 1, sidx, order, storeCode, storeName, limit = 10) {
    let url = '/app/review/planList';
    let data = {page, sidx, order, storeCode, storeName, limit}
    return BaseServer.post(url, data);
}

/**
 * 获取例外跟踪列表
 * page 页码
 * limit 每页数量
 * */
export function getExceptionList(page = 1, limit = 10) {
    let url = '/app/review/exceptionList'
    let data = {page, limit}
    return BaseServer.post(url, data)
}

/**
 * 保存单个考评记录
 * reviewProjectId  考评项目ID
 * reviewId  考评记录ID
 * storeId  门店ID
 * projectCode  项目编号
 * projectType  项目分类
 * projectRequire  项目要求
 * checkResult  检查结果
 * exception  例外描述
 * photos 例外证据
 * */
export function saveSingle(reviewProjectId, reviewId, storeId, projectCode, projectType, projectRequire, checkResult, exception, photos) {
    let url = '/app/review/save';
    let data = {
        reviewProjectId,
        reviewId,
        storeId,
        projectCode,
        projectType,
        projectRequire,
        checkResult,
        exception,
        photos
    }
    return BaseServer.post(url, data);
}

/**
 * 批量保存考评记录
 * projectlList  考评项目列表
 * reviewProjectId  考评项目ID
 * reviewId  考评记录ID
 * storeId  门店ID
 * projectCode  项目编号
 * projectType  项目分类
 * projectRequire  项目要求
 * checkResult  检查结果
 * exception  例外描述
 * photos  例外证据
 * */
export function saveAll(projectlList) {
    let url = '/app/review/saveAll';
    let data = {projectlList}
    return BaseServer.post(url, data, true);
}

/**
 * 已完结的考评
 * reviewId 考评记录ID
 * */
export function evaluEnd(id) {
    let url = '/app/review/end';
    return BaseServer.get(url, {reviewId: id})
}

/**
 * 考评记录提交
 * projectlList 考评项目列表->JSON {reviewProjectd,projectCode，projectType,projectRequire,checkResult,checkResult,exception,photos}
 * projectId 考评项目ID
 * reviewId 考评记录ID
 * storeId 门店ID
 * projectCode 项目编号
 * projectType 项目分类
 * projectRequire 项目要求
 * checkResult 检查结果
 * exception 例外描述
 * photos 例外证据
 * */
export function evalSubmit(projectList, projectId, reviewId, storeId, projectCode, projectType, projectRequire, checkResult, exception, photos) {
    let url = '/app/review/submit';
    let data = {
        projectlList: projectList,
        reviewProjectId: projectId,
        reviewId,
        storeId,
        projectCode,
        projectType,
        projectRequire,
        checkResult,
        exception,
        photos
    }
    return BaseServer.post(url, data)
}

/**
 * 获取计划考评详情
 * reviewId 考评记录ID
 * */
export function getPlanDetails(reviewId) {
    let url = `/app/review/view/${reviewId}`;
    return BaseServer.get(url)
}

/**
 * 在线考评
 * */
export function reviewPlanStat() {
    let url = '/app/stat/reviewPlanStat';
    return BaseServer.get(url)
}

/**
 * 获取考评报表
 * page 页码
 * */
export function reviewRecordStat(page = 1) {
    let url = '/app/stat/reviewRecordStat';
    let data = {
        "page": page
    }
    return BaseServer.get(url, data)
}

/**
 * 上传图片
 * file 文件
 * */
export function uploadImage(file) {
    //console.log('++++++++++++++++', file)
    let url = '/app/store/imgUpload';
    let fileInfo = {uri: file, type: 'multipart/form-data', name: 'image.png'};
    let formData = new FormData()
    formData.append('img', fileInfo)
    return BaseServer.postImage(url, formData)
}

/**
 * 报告问题
 * */
export function problemReport(imgUrl, reviewProjectId, checkResult, exception) {
    let url = '/app/store/problemReport';
    let data = {imgUrl, reviewProjectId, checkResult, exception}
    return BaseServer.post(url, data)
}
