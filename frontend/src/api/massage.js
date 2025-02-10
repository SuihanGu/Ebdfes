import req from '@/libs/api.request'

// /user/getmsg
export const getmsg = (data) => {
  return req.axios0.request({
    url: '/user/getmsg',
    params: data,
    method: 'get'
  })
}
// user/insertmsg
export const insertmsg = (data) => {
    return req.axios0.request({
        url: '/user/insertmsg',
        params: data,
        method: 'get'
    })
}
// user/deletemsg?msgid=2
export const deletemsg = (data) => {
    return req.axios0.request({
        url: '/user/deletemsg',
        params: data,
        method: 'get'
    })
}