import request, {Method} from '@/plugins/request.js';

// 查询账户余额
export function getMembersWallet() {
  return request({
    url: '/wallet/wallet',
    method: Method.GET,
    needToken: true
  });
}

// 查询余额列表
export function getDepositLog(params) {
  return request({
    url: '/wallet/log',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 查询充值记录
export function getRecharge(params) {
  return request({
    url: '/wallet/recharge',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 查询提现记录
export function getWithdrawApply(params) {
  return request({
    url: '/member/withdrawApply',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 在线充值
export function recharge(params) {
  return request({
    url: '/trade/recharge',
    method: Method.POST,
    needToken: true,
    data: params
  });
}

// 提现
export function withdrawalApply(params) {
  return request({
    url: '/wallet/wallet/withdrawal',
    method: Method.POST,
    needToken: true,
    data: params
  });
}

// 收藏商品、店铺
export function collectGoods(id) {
  return request({
    url: `/collection/goods/${id}`,
    method: Method.POST,
    needToken: true
  });
}

export function collectService(id) {
  return request({
    url: `/collection/service/${id}`,
    method: Method.POST,
    needToken: true
  });
}

export function collectShop(id) {
  return request({
    url: `/collection/store/${id}`,
    method: Method.POST,
    needToken: true
  });
}

// 取消 收藏商品、店铺
export function cancelCollectGoods(id) {
  return request({
    url: `/collection/goods/${id}`,
    method: Method.DELETE,
    needToken: true
  });
}

export function cancelCollectService(id) {
  return request({
    url: `/collection/service/${id}`,
    method: Method.DELETE,
    needToken: true
  });
}

export function cancelCollectShop(id) {
  return request({
    url: `/collection/store/${id}`,
    method: Method.DELETE,
    needToken: true
  });
}

export function isCollectionGoods(goodsId) {
  return request({
    url: `/collection/goods/${goodsId}`,
    method: Method.GET,
    needToken: true
  });
}

export function isCollectionService(serviceId) {
  return request({
    url: `/collection/service/${serviceId}`,
    method: Method.GET,
    needToken: true
  });
}

export function isCollectionShop(shopId) {
  return request({
    url: `/collection/store/${shopId}`,
    method: Method.GET,
    needToken: true
  });
}

// 会员收藏列表
export function collectGoodsList(params) {
  return request({
    url: `/collection/goods`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function collectServiceList(params) {
  return request({
    url: `/collection/service`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function collectStoreList(params) {
  return request({
    url: `/collection/store`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function collectRecentStoreList(params) {
  return request({
    url: `/collection/store/recent`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function goodsComment(params) {
  return request({
    url: `/member/evaluation/${params.goodsId}/goodsEvaluation`,
    method: Method.GET,
    needToken: false,
    params
  });
}

export function goodsCommentNum(goodsId) {
  return request({
    url: `/member/evaluation/${goodsId}/evaluationNumber`,
    method: Method.GET,
    needToken: false
  });
}

export function addEvaluation(params) {
  return request({
    url: `/member/evaluation`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// 会员评价详情
export function evaluationDetail(id) {
  return request({
    url: `/member/evaluation/get/${id}`,
    method: Method.GET,
    needToken: true
  });
}

// 发票分页列表
export function receiptList() {
  return request({
    url: `/trade/receipt`,
    method: Method.GET,
    needToken: true
  });
}

// 保存发票信息
export function saveReceipt(params) {
  return request({
    url: `/trade/receipt`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// 获取可领取优惠券列表
export function couponList(params) {
  return request({
    url: `/promotion/coupon`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 会员优惠券列表
export function memberCouponList(params) {
  return request({
    url: `/promotion/coupon`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 会员优惠券列表
export function canUseCouponList(params) {
  return request({
    url: `/promotion/coupon/canUse`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 领取优惠券
export function receiveCoupon(couponId) {
  return request({
    url: `/promotion/coupon/receive/${couponId}`,
    method: Method.GET,
    needToken: true
  });
}

// 获取申请售后列表
export function afterSaleList(params) {
  return request({
    url: `/order/afterSale/page`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 获取申请售后页面信息
export function afterSaleInfo(sn) {
  return request({
    url: `/order/afterSale/applyAfterSaleInfo/${sn}`,
    method: Method.GET,
    needToken: true
  });
}

// 获取申请售后、投诉原因
export function afterSaleReason(serviceType) {
  return request({
    url: `/order/afterSale/${serviceType}/reasons`,
    method: Method.GET,
    needToken: true
  });
}

// 获取申请售后详情
export function afterSaleDetail(sn) {
  return request({
    url: `/order/afterSale/get/${sn}`,
    method: Method.GET,
    needToken: true
  });
}

// 售后日志
export function afterSaleLog(sn) {
  return request({
    url: `/order/afterSale/get/getAfterSaleLog/${sn}`,
    method: Method.GET,
    needToken: true
  });
}

// 申请售后
export function applyAfterSale(params) {
  return request({
    url: `/order/afterSale/save/${params.orderItemSn}`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// 取消售后申请
export function cancelAfterSale(afterSaleSn) {
  return request({
    url: `/order/afterSale/cancel/${afterSaleSn}`,
    method: Method.POST,
    needToken: true
  });
}

// 投诉商品
export function handleComplain(data) {
  return request({
    url: `/order/complain`,
    method: Method.POST,
    needToken: true,
    data
  });
}

// 分页获取我的投诉列表
export function complainList(params) {
  return request({
    url: `/order/complain`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 获取投诉详情
 */
export function getComplainDetail(id) {
  return request({
    url: `/order/complain/${id}`,
    method: Method.GET,
    needToken: true
  });
}

/**
 * 取消投诉
 */
export function clearComplain(id) {
  return request({
    url: `/order/complain/status/${id}`,
    method: Method.PUT,
    needToken: true
  });
}

/**
 * 获取当前会员分销信息
 */
export function distribution() {
  return request({
    url: `/distribution/distribution`,
    method: Method.GET,
    needToken: true
  });
}

/**
 * 申请成为分销商
 * @param idNumber 身份证号
 * @param name  名字
 */
export function applyDistribution(params) {
  return request({
    url: `/distribution/distribution`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * 获取分销商订单列表
 */
export function getDistOrderList(params) {
  return request({
    url: `/distribution/order`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 获取分销商商品列表
 */
export function getDistGoodsList(params) {
  return request({
    url: `/distribution/goods`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 绑定、解绑分销商品
 * @param distributionGoodsId 分销商品id
 * @param checked 分销商品id,true为绑定，false为解绑
 */
export function selectDistGoods(params) {
  return request({
    url: `/distribution/goods/checked/${params.distributionGoodsId}`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 分销商提现历史
 */
export function distCashHistory(params) {
  return request({
    url: `/distribution/cash`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 分销商提现
 */
export function distCash(params) {
  return request({
    url: `/distribution/cash`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * 我的足迹
 * @param {Number} pageNumber 页码
 * @param {Number} pageSize 页数
 */
export function tracksList(params) {
  return request({
    url: `/member/footprint`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 清空足迹
 */
export function clearTracks() {
  return request({
    url: `/member/footprint`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 根据id删除足迹
 * @param {String} ids id集合
 */
export function clearTracksById(ids) {
  return request({
    url: `/member/footprint/delByIds/${ids}`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 获取会员积分
 */
export function memberPoint(params) {
  return request({
    url: `/member/point/history/own`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 积分历史
 */
export function memberPointHistory(params) {
  return request({
    url: `/member/point/history`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function memberMsgList(params) {
  return request({
    url: `/message/member`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 设置消息为已读
 * @param {String} messageId 消息id
 */

export function readMemberMsg(id) {
  return request({
    url: `/message/member/${id}`,
    method: Method.PUT,
    needToken: true
  });
}

/**
 * 删除会员消息
 * @param {String} messageId 消息id
 */
export function delMemberMsg(id) {
  return request({
    url: `/message/member/${id}`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 绑定分销
 * @param distributionId 商品分销ID
 */
export function getGoodsDistribution(distributionId) {
  return request({
    url: `/distribution/distribution/bindingDistribution/${distributionId}`,
    method: Method.GET,
    needToken: true
  });
}

export function getClerkList(params) {
  return request({
    url: `/clerk`,
    method: Method.GET,
    needToken: false,
    params
  })
}

export function getClerkDetail(id) {
  return request({
    url: `/clerk/${id}`,
    method: Method.GET,
    needToken: false,
  })
}
