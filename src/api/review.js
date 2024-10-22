import request, {Method} from "@/plugins/request";

export function getTemplateReply(params) {
  return request({
    url: '/message/template',
    method: Method.GET,
    needToken: true,
    params
  });
}

export function getReview(params) {
  return request({
    url: '/review',
    method: Method.GET,
    params
  });
}

export function getReviewStat(params) {
  return request({
    url: '/review/subject',
    method: Method.GET,
    params
  });
}

export function getReportReason() {
  return request({
    url: '/review/reason',
    method: Method.GET,
    needToken: true,
  });
}

export function getReviewDetailByOrder(orderId) {
  return request({
    url: `/review/order/${orderId}`,
    method: Method.GET,
    needToken: true,
  });
}

export function editReview(id, data) {
  return request({
    url: `/review/edit/${id}`,
    method: Method.PUT,
    headers: {
      "Content-Type": 'application/json'
    },
    needToken: true,
    data: data,
  });
}

export function createReview(data, params) {
  return request({
    url: '/review',
    method: Method.POST,
    headers: {
      "Content-Type": 'application/json'
    },
    needToken: true,
    data: data,
    params
  });
}

export function updateLikeReview(id) {
  return request({
    url: `/review/like/${id}`,
    method: Method.PUT,
    needToken: true,
  });
}

export function reportReview(id, data) {
  return request({
    url: `/review/report/${id}`,
    method: Method.POST,
    needToken: true,
    data: data
  });
}
