import request, {
  Method
} from '@/plugins/request.js';

export function getOrderList (params) {
  return request({
    url: `/order`,
    method: Method.GET,
    needToken: true,
    params
  });
}
export function getRecentBooking () {
  return request({
    url: `/order/booking/recent`,
    method: Method.GET,
    needToken: true,
  });
}

export function getBookingList (params) {
  return request({
    url: `/order/booking`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function cancelBooking (params, data){
  return request({
    url: `/order/${params}/cancel`,
    method: Method.POST,
    needToken: true,
    data
  });
}

export function DoneBooking (params) {
  return request({
    url: `/order/booking/${params}/done`,
    method: Method.POST,
    needToken: true,
    params
  });
}

export function ReceiveOrder (params) {
  return request({
    url: `/order/${params}/complete`,
    method: Method.POST,
    needToken: true,
    params
  });
}

export function updateBooking (params){
  return request({
    url: `/order/booking/${params.orderSn}`,
    method: Method.PUT,
    needToken: true,
    params
  });
}

export function getDetailBooking(sn){
  return request({
    url: `/order/booking/${sn}`,
    method: Method.GET,
    needToken: true,
  })
}

/**
 * 订单明细
 * @param {orderSn} 订单编号
 */
export function orderDetail (orderSn) {
  return request({
    url: `/order/${orderSn}`,
    method: Method.GET,
    needToken: true
  });
}

/**
 * 取消订单
 * @param {orderSn} 订单编号
 * @param reason 取消订单原因
 */
export function cancelOrder (params, data) {
  return request({
    url: `/order/${params}/cancel`,
    method: Method.POST,
    needToken: true,
    params,
    data
  });
}

/**
 * 删除订单
 * @param {orderSn} 订单编号
 */
export function delOrder (orderSn) {
  return request({
    url: `/order/${orderSn}`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 确认收货
 * @param {orderSn} 订单编号
 */
export function sureReceived (orderSn) {
  return request({
    url: `/order/${orderSn}/complete`,
    method: Method.POST,
    needToken: true
  });
}

export function getTraces (orderSn) {
  return request({
    url: `/order/${orderSn}/trace`,
    method: Method.POST,
    needToken: true
  });
}

export function evolutionList (params) {
  return request({
    url: `/member/evaluation`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 添加交易投诉对话
export function communication (params) {
  return request({
    url: `/order/complain/communication`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// 退换货服务 提交物流
export function afterSaleDelivery (params) {
  return request({
    url: `/order/afterSale/delivery/${params.afterSaleSn}`,
    method: Method.POST,
    needToken: true,
    params
  });
}
// 获取退货可选物流公司
export function getLogisticsCompany () {
  return request({
    url: `/other/logistics`,
    method: Method.GET,
    needToken: true,
    params: { page: 1, size: 200, disabled: 'OPEN' }
  });
}
