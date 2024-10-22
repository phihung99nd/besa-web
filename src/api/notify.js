import request, {Method} from "../plugins/request";

export function getNotiList(params) {
  return request({
    url: '/notify',
    method: Method.GET,
    needToken: true,
    params
  });
}

export function getNotiListByType(type, params) {
  return request({
    url: `/notify/${type}`,
    method: Method.GET,
    needToken: true,
    params
  });
}

export function confirmNotiRead() {
  return request({
    url: '/notify/read',
    method: Method.PUT,
    needToken: true,
  })
}

export function getNotiDetail(id) {
  return request({
    url: `/notify/${id}`,
    method: Method.GET,
    needToken: true,
  })
}
