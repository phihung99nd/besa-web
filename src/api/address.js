import request, {
  Method, commonUrl
} from '@/plugins/request.js';

// 会员收货地址列表
export function memberAddress () {
  return request({
    url: '/member/address',
    needToken: true,
    method: Method.GET
  });
}

// 添加收货地址
export function newMemberAddress (data) {
  return request({
    url: '/member/address',
    needToken: true,
    method: Method.POST,
    data
  });
}

// 编辑收货地址
export function editMemberAddress (id, data) {
  return request({
    url: `/member/address/${id}`,
    needToken: true,
    method: Method.PUT,
    data
  });
}

// 删除收货地址
export function delMemberAddress (id) {
  return request({
    url: `/member/address/${id}`,
    needToken: true,
    method: Method.DELETE
  });
}

// 根据id获取会员地址详情
export function getAddrDetail (id) {
  return request({
    url: `/member/address/${id}`,
    needToken: true,
    method: Method.GET
  });
}

// 传给后台citycode 获取城市街道等id
export function handleRegion (params) {
  return request({
    url: `${commonUrl}/common/common/region/region`,
    needToken: true,
    method: Method.GET,
    params
  });
}
