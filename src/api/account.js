// import {
//   getRequest,
//   postRequest,
//   putRequest,
//   deleteRequest,
//   importRequest,
//   getRequestWithNoToken
// } from '@/axios/index.js';
import request, {Method} from '@/plugins/request.js'
import Storage from "../plugins/storage";
import {commonUrl} from "../plugins/request";

// 获取密码状态
export function getPwdStatus (params) {
  return request({
    url: '/wallet/check',
    method: Method.GET,
    needToken: true,
    params
  })
}

// 设置密码
export function setPwd (params) {
  return request({
    url: '/passport/member/wallet/set-password',
    method: Method.POST,
    needToken: true,
    data: params
  })
}

// 设置支付密码
export function setUpdatePwdOrdinary (params) {
  return request({
    url: '/passport/member/wallet/update-password/ordinary',
    method: Method.GET,
    needToken: true,
    data: params
  })
}

// 修改会员资料
export function editMemberInfo (params) {
  return request({
    url: '/passport/member',
    method: Method.PUT,
    needToken: true,
    data: params,
    headers: {
      "Content-Type": "application/json",
    }
  })
}

// 修改密码
export function editPwd (params) {
  return request({
    url: `/passport/member/password`,
    method: Method.PUT,
    needToken: true,
    params
  })
}

export function AccountLogin(data) {
  return request({
    url: `${commonUrl}/oauth2/token`,
    method: Method.POST,
    data,
    headers: {
      Authorization: 'Basic YnV5ZXJhcHA6MTIzNDU2',
      "Content-Type": 'multipart/form-data'
    }
  })
}

export function AccountLogout() {
  return request({
    url: `${commonUrl}/oauth2/logout`,
    method: Method.POST,
    needToken: true,
  })
}


export function AccountInfo() {
  let accessToken = Storage.getItem('buyer_accessToken');
  return request({
    url: '/user/current',
    method: Method.GET,
    headers: {
      accessToken: accessToken
    }
  })
};

