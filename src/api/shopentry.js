import request, {
  Method
} from '@/plugins/request.js'

export function checkUserStore(){
  return request({
    url: '/store/check',
    method: Method.GET,
    needToken: true,
  })
}

export function createStoreAndBuyerAccount(data){
  return request({
    url: '/store/first',
    method: Method.POST,
    needToken: false,
    data
  })
}

export function applyShopInfo(data, token){
  return request({
    url: '/store/second',
    method: Method.POST,
    data,
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}
// 店铺分页列表
export function shopList(params) {
  return request({
    url: '/store/store',
    needToken: true,
    method: Method.GET,
    params
  })
}

// 申请店铺第一步-填写企业信息
export function applyFirst(data) {
  return request({
    url: '/store/apply/first',
    needToken: true,
    method: Method.POST,
    data
  })
}

// 申请店铺第一步-填写企业信息
export function applySecond(data) {
  return request({
    url: '/store/apply/second',
    needToken: true,
    method: Method.POST,
    data
  })
}

// 申请店铺第一步-填写企业信息
export function applyThird(data) {
  return request({
    url: '/store/apply/third',
    needToken: true,
    method: Method.POST,
    data
  })
}

// 店铺详情
export function getStoreDetailById(id) {
  return request({
    url: `/store/${id}`,
    needToken: false,
    method: Method.GET
  })
}

export function getStoreReviewStat(params) {
  return request({
    url: `/review/store-stats`,
    needToken: false,
    method: Method.GET,
    params
  })
}

export function getBranch(params) {
  return request({
    url: `/store/address`,
    needToken: false,
    method: Method.GET,
    params,
  })
}

export function getSlot(id, branch) {
  return request({
    url: `/goods/goods/${id}/slot?branchId=${branch}`,
    needToken: false,
    method: Method.GET
  })
}

// 店铺分类
export function getCateById(id) {
  return request({
    url: `/store/store/label/get/${id}`,
    needToken: true,
    method: Method.GET
  })
}

//  店铺入驻协议
export function agreement() {
  return request({
    url: `/other/article/type/STORE_REGISTER`,
    needToken: true,
    method: Method.GET
  })
}

//  获取当前登录会员的店铺信息
export function applyStatus() {
  return request({
    url: `/store/apply`,
    needToken: true,
    method: Method.GET
  })
}
