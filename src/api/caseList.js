import request from '@/utils/request'

// 案例列表
export function getCaseList(params) {
  return request({
    url: '/doc/case/search',
    method: 'get',
    params
  })
}

// 案例详情
export function getCaseDetails(params) {
  return request({
    url: '/doc/case/info',
    method: 'get',
    params
  })
}

// 案例修改
export function caseUpdate(data) {
  return request({
    url: '/doc/case/update',
    method: 'post',
    data
  })
}

// 案例修改
export function caseDelete(params) {
  return request({
    url: '/doc/case/delete',
    method: 'get',
    params
  })
}