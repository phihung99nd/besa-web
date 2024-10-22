import request, {Method} from "@/plugins/request";

export function searchAllByKeyword (params) {
  return request({
    url: `/search`,
    method: Method.GET,
    needToken: false,
    params
  })
}

export function searchGoods (params) {
  return request({
    url: '/search/goods',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function searchService (params) {
  return request({
    url: '/search/service',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function searchClerk (params) {
  return request({
    url: '/search/clerk',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function searchStore (params) {
  return request({
    url: '/search/store',
    method: Method.GET,
    needToken: false,
    params
  });
}
