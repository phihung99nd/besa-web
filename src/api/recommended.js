import request, {Method} from "@/plugins/request";

export function getRecommendedClerk() {
  return request({
    url: '/clerk/recommended',
    method: Method.GET,
    needToken: false
  });
}

export function getRecommendedStore() {
  return request({
    url: '/store/recommended',
    method: Method.GET,
    needToken: false
  });
}

export function getRecommendedService() {
  return request({
    url: '/service/recommended',
    method: Method.GET,
    needToken: false
  });
}

export function getRecommendedGoods() {
  return request({
    url: '/goods/recommended',
    method: Method.GET,
    needToken: false
  });
}
