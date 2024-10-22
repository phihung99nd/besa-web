
import request, {Method, buyerUrl} from '@/plugins/request.js';

/**
 * 注册
 */
export function regist (params) {
  return request({
    url: '/passport/member/register',
    method: Method.POST,
    needToken: false,
    data: params,
    // headers: { 'Content-Type': 'application/json'}
  });
}

/**
 * 账号密码登录
 */
export function login (params) {
  return request({
    url: `${commonUrl}/oauth2/token`,
    method: Method.POST,
    needToken: false,
    data: params,
    headers: { 'clientType': 'PC', 'Authorization': 'Basic d2ViYXBwOjEyMzQ1NmFA' }
  });
}

/**
 * 手机号验证码登录
 */
export function smsLogin (params) {
  return request({
    url: '/passport/member/smsLogin',
    method: Method.POST,
    needToken: false,
    data: params,
    headers: { 'clientType': 'PC' }
  });
}

/**
 * 获取用户信息
 */
export function getMemberMsg (params) {
  return request({
    url: '/passport/member',
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 第三方登录 支付宝，微博，qq,微信
 */
export function webLogin (type) {
  window.open(`${buyerUrl}/passport/connect/connect/login/web/${type}`, 'blank');
}

/**
 * 第三方登录成功 回调接口
 */
export function loginCallback (uuid) {
  return request({
    url: `/passport/connect/connect/result?state=${uuid}`,
    method: Method.GET,
    needToken: false
  });
}

/**
 * 忘记密码  验证手机验证码
 */
export function validateCode (params) {
  return request({
    url: `/passport/member/resetByMobile`,
    method: Method.POST,
    needToken: false,
    params
  });
}

/**
 * 忘记密码 重置密码
 */
export function resetPassword (params) {
  return request({
    url: `/passport/member/password/reset`,
    method: Method.POST,
    needToken: false,
    params
  });
}


export function getSCLoginCode(params) {
  return request({
    url: `/passport/member/pc_session`,
    method: Method.POST,
    needToken: false,
    params
  });
}
export function sCLogin(token,params) {
  return request({
    url: `/passport/member/session_login/`+token,
    method: Method.POST,
    needToken: false,
    params
  });
}
