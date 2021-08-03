import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/doc/sys/logout',
    method: 'post'
  })
}

export function adminLogin(params) {
  return request({
    url: '/doc/sys/login',
    method: 'get',
    params
  })
}
