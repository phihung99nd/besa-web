import request, {
  Method
} from '@/plugins/request.js';

export function goodsList (params) {
  return request({
    url: '/goods',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function getGoodsList (params) {
  return request({
    url: '/goods',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function filterList (params) {
  return request({
    url: '/goods/related',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function goodsDetail (params) {
  return request({
    url: `/goods/${params.goodsId}`,
    method: Method.GET,
    needToken: false,
  });
}

export function goodsSkuDetail (params) {
  return request({
    url: `/goods/${params.goodsId || 0}/sku/${params.skuId || 'undefined'}`,
    method: Method.GET,
    needToken: false,
  });
}

export function getCategory (parentId) {
  return request({
    url: `/category/tree`,
    method: Method.GET,
    needToken: false
  });
}

export function pintuanMembers (pintuanId) {
  return request({
    url: `/promotion/pintuan/${pintuanId}/members`,
    method: Method.GET,
    needToken: false
  });
}

/**
 * 获取搜索热词
 * @param {Number} count 获取搜索热词数量
 */
export function hotWords (params) {
  return request({
    url: `/search/hot-word`,
    method: Method.GET,
    needToken: false,
    params
  });
}

export function getClerkListForSlot (params) {
  return request({
    url: `/service/available`,
    method: Method.GET,
    needToken: false,
    params
  });
}

export function getShopGoodsLabelList (shopId) {
  return request({
    url: `/category/store/${shopId}`,
    method: Method.GET,
    needToken: false,
  })
}
