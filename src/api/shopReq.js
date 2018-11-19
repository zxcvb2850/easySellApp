/*店铺相关的请求*/
import {objChangeUrl} from "../common/util";
import BaseServer from "./BaseServer";

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
    let data = {page, sidx, order, storeCode, storeName, limit};
    return BaseServer.post(url, data)
}

/**
 * 获取店铺详情
 * storeId 店铺ID
 * */
export function getStoreDetails(id) {
    let url = '/app/store/details';
    return BaseServer.get(url, {storeId: id})
}

/**
 * 店铺收藏
 * isCollection 是否收藏 1是 2否
 * */
export function isCollection(isCollection) {
    let url = '/app/store/collection';
    return BaseServer.put(url, {isCollection})
}

/**
 * 店铺统计
 * */
export function storeStat() {
    let url = '/app/stat/storeStat';
    return BaseServer.get(url)
}