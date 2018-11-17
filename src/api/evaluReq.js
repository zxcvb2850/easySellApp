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