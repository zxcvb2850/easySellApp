/**
 * 店铺相关的请求
 * */
import BaseServer from "./BaseServer";
import {objChangeUrl} from "../common/util";
import qs from "qs";

/**
 * 获取店铺列表
 * page 页码
 * limit 每页数量
 * sidx 排序字段
 * order 排序方式 asc、desc
 * storeCode 门店编号
 * storeName 门店名称
 * */
export function getStoreList(page = 1, sidx, order, storeCode, storeName, limit = 10) {
    let url = '/app/store/list';
    let data = {params: 1, page, sidx, order, storeCode, storeName, limit};
    return BaseServer.get(url, objChangeUrl(data))
}

/**
 * 获取店铺详情
 * params
 * */
export function getStoreDetails(params) {
    let url = '/app/store/details';
    let data = {params};
    return BaseServer.get(url, objChangeUrl(data))
}

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
    return BaseServer.get(url, objChangeUrl(data));
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
    console.log(url, objChangeUrl(data));
    return BaseServer.post(url, data);
}

/**
 * 获取例外跟踪列表
 * params
 * */
export function getExportFollowList() {
    let url = '/app/review/projectFollow'
    let data = {}
    return BaseServer.get(url, objChangeUrl(data))
}

/**
 * 保存单个考评记录
 * storeReviewProject
 * */
export function saveSingle() {
    let url = '/app/review/save';
    let data = {}
    return BaseServer.post(url, data);
}