import request, { Method } from "@/plugins/request.js";
import {commonUrl} from "../plugins/request";

export function indexData(params) {
  return request({
    url: "/page/data",
    method: Method.GET,
    needToken: false,
    params,
  });
}

export function getFloorStoreData(params) {
  return request({
    url: `/page/data`,
    method: "get",
    params,
  });
}

export function pageData(params) {
  return request({
    url: `/other/pageData`,
    method: Method.GET,
    needToken: false,
    params,
  });
}

export function handleRefreshToken(token) {
  return request({
    url: `${commonUrl}/oauth2/token`,
    method: Method.POST,
    params: {grant_type: 'refresh_token', refresh_token: token},
    headers: {Authorization: 'Basic YnV5ZXJhcHA6MTIzNDU2'},
    needToken: false,
  });
}

export function autocompleteSearch(params) {
  return request({
    url: `/search/autocomplete`,
    method: Method.GET,
    needToken: false,
    params
  });
}

// /**
//  * 获取店铺楼层数据
//  */
// export function getFloorStoreData(params) {
//   return request({
//     url: `/other/pageData?pageClientType=PC`,
//     method: "get",
//     params,
//   });
// }
