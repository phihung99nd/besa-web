import request, {Method} from '@/plugins/request.js';

export function clearCart() {
  return request({
    url: '/trade/carts',
    method: Method.DELETE,
    needToken: true,
  });
}

export function cartGoodsAll() {
  return request({
    url: '/trade/carts',
    method: Method.GET,
    needToken: true
  });
}

export function cartCount() {
  return request({
    url: '/trade/carts/count',
    method: Method.GET,
    needToken: true
  });
}

export function cartGoodsPay(params) {
  return request({
    url: '/trade/carts/checked',
    method: Method.GET,
    needToken: true,
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    params
  });
}

export function checkServiceBook(params) {
  return request({
    url: '/trade/carts/checked',
    method: Method.GET,
    needToken: true,
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    params
  });
}

export function addCartServices(params) {
  return request({
    url: '/trade/carts',
    method: Method.POST,
    needToken: true,
    headers: {"Content-Type": 'application/json'},
    data: params,
  });
}

export function addCartGoods(params, data) {
  return request({
    url: '/trade/carts',
    method: Method.POST,
    needToken: true,
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    params,
    data
  });
}

export function addCartGoodsRequestBody(data) {
  return request({
    url: '/trade/carts',
    method: Method.POST,
    needToken: true,
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    data,
  });
}

export function createTrade(data) {
  return request({
    url: '/trade/carts/trade',
    method: Method.POST,
    needToken: true,
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    data
  });
}

export function getPaymentMethod(params) {
  return request({
    url: '/payment/cashier/paymentMethod',
    method: Method.GET,
    needToken: true,
    params
  })
}

export function selectCoupon(params) {
  return request({
    url: '/trade/carts/select/coupon',
    method: Method.GET,
    needToken: true,
    params
  });
}

export function couponNum(params) {
  return request({
    url: '/trade/carts/coupon/num',
    method: Method.GET,
    needToken: true,
    params
  });
}

export function selectAddr(params) {
  return request({
    url: `/trade/carts/shipping/address`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function setCheckedAll(params) {
  return request({
    url: `/trade/carts/sku/checked`,
    method: Method.POST,
    needToken: true,
    params
  });
}

export function setCheckedSeller(params) {
  return request({
    url: `/trade/carts/store/${params.storeId}`,
    method: Method.POST,
    needToken: true,
    params
  });
}

export function setCheckedGoods(params) {
  return request({
    url: `/trade/carts/sku/${params.skuId}/checked`,
    method: Method.POST,
    needToken: true,
    params
  });
}

export function setCartGoodsNum(data) {
  return request({
    url: `/trade/carts/sku/${data.skuId}/num`,
    method: Method.POST,
    needToken: true,
    data
  });
}

export function addCartService(params) {
  return request({
    url: `/trade/carts/sku/num/${params.skuId}`,
    method: Method.POST,
    needToken: true,
    params
  });
}

export function delCartGoods(params) {
  return request({
    url: `/trade/carts/sku`,
    method: Method.DELETE,
    needToken: true,
    params
  });
}

export function shippingMethod(params) {
  return request({
    url: `/trade/carts/shipping/method`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function receiptSelect(params) {
  return request({
    url: `/trade/receipt`,
    method: Method.POST,
    needToken: true,
    params
  });
}


