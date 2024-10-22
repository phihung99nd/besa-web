import request, {Method} from '@/plugins/request.js';


export function getServicesList(params) {
  return request({
    url: '/service',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function getServicesListNotPagination(params) {
  return request({
    url: '/service/list',
    method: Method.GET,
    needToken: false,
    params
  });
}

export function getServiceDetail(id) {
  return request({
    url: `/service/${id}`,
    method: Method.GET,
    needToken: false
  });
}

export function getServicesSlot(params) {
  return request({
    url: `/service/slot`,
    params,
    method: Method.GET,
    needToken: false
  });
}

export function getServicesSku(id) {
  return request({
    url: `/service/${id}/sku`,
    method: Method.GET,
    needToken: false
  });
}

