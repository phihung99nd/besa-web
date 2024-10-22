import request, {
  Method
} from '@/plugins/request.js';

/**
 * 获取当天限时抢购信息
 */
export function seckillByDay (params) {
  return request({
    url: '/promotion/seckill',
    method: Method.GET,
    params
  });
}

/**
 * 获取某个时刻限时抢购信息
 */
export function seckillByTimeline (timeline) {
  return request({
    url: `/promotion/seckill/${timeline}`,
    method: Method.GET
  });
}

/**
 * 获取积分商品分类列表
 */
export function pointGoodsCategory (params) {
  return request({
    url: `/promotion/pointsGoods/category`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 获取积分商品列表
 */
export function pointGoods (params) {
  return request({
    url: `/promotion/pointsGoods`,
    method: Method.GET,
    needToken: true,
    params
  });
}
/**
 * 获取积分商品详情
 */
export function pointGoodsDetail (id) {
  return request({
    url: `/promotion/pointsGoods/${id}`,
    method: Method.GET,
    needToken: true,
    id
  });
}
