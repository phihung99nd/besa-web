import request, {Method, commonUrl} from '@/plugins/request.js';

/**
 * 获取拼图验证
 */
export function getCaptcha (params) {
  return request({
    url: `${commonUrl}/common/captcha`,
    method: Method.GET,
    params,
    needToken: false
  });
}
/**
 * 验证码校验
 */
export function verifyCaptcha (data) {
  return request({
    url: `${commonUrl}/common/captcha`,
    method: Method.POST,
    data,
    needToken: false,
    headers: {
      "Content-Type": "application/json",
    }
  });
}
/**
 * 发送短信验证码
 */
export function sendSms (params) {
  return request({
    url: `${commonUrl}/common/common/sms/${params.verificationEnums}/${params.mobile}`,
    method: Method.GET,
    needToken: false,
    params
  });
}

// 地区数据，用于三级联动
export function getRegion (id) {
  return request({
    url: `${commonUrl}/common/region/${id}/item`,
    needToken: true,
    method: Method.GET
  });
}

export function getAvailableRegion (id) {
  return request({
    url: `${commonUrl}/common/region/available?parentId=${id}`,
    needToken: false,
    method: Method.GET
  });
}

/**
 * 分页获取文章列表
 * @param cateId 文章分类id
 */
export function articleList (params) {
  return request({
    url: `/article`,
    method: Method.GET,
    params
  });
}

/**
 * 获取帮助中心文章分类列表
 * @param cateId 文章分类id
 */
export function articleCateList () {
  return request({
    url: `/article/category`,
    method: Method.GET
  });
}

// 通过id获取文章
export function articleDetail (id) {
  return request({
    url: `/article/${id}`,
    method: Method.GET
  });
}




export function policyDetail (id) {
  return request({
    url: `/policy/${id}`,
    method: Method.GET,
    needToken: true,
  });
}


//获取图片logo
export function getBaseSite(){
  return request ({
    url:`${commonUrl}/common/site`,
    method: Method.GET,
    needToken: false
  })
}


export function getDiscoveryData(params, headers){
  return request({
    url: `/discovery`,
    method: Method.GET,
    params,
    headers
  })
}
