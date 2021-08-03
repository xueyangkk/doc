import request from '@/utils/request'

// 源数据列表
export function getSourceDataList(params) {
  return request({
    url: '/doc/article/crawlerList',
    method: 'get',
    params
  })
}
// 源数据删除
export function sourceDataDelete(id) {
  return request({
    url: `/doc/article/crawler/delete/${id}`,
    method: 'get',
  })
}
// 异常数据列表
export function getAbnormalDataList(params) {
  return request({
    url: '/doc/article/crawlerList/error',
    method: 'get',
    params
  })
}
// 异常数据删除
export function abnormalDataDelete(id) {
  return request({
    url: `/doc/article/crawlerError/delete/${id}`,
    method: 'get'
  })
}
// 统计数据
export function getAllData(params) {
  return request({
    url: '/doc/ops/docs/dashboard',
    method: 'get',
    params
  })
}