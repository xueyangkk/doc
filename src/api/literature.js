import request from '@/utils/request'

// 文献列表
export function getList(params) {
    return request({
        url: '/doc/ops/docs/download',
        method: 'get',
        params
    })
}

// 没找到
export function notFound(params) {
    return request({
        url: '/doc/ops/docs/notFound',
        method: 'get',
        params
    })
}

// 退款
export function refund(params) {
    return request({
        url: '/doc/ops/docs/refund',
        method: 'get',
        params
    })
}
// 上传文献
export function uploadFiles(params) {
    return request({
      url: '/doc/ops/docs/upload',
      method: 'post',
      params
    })
  }