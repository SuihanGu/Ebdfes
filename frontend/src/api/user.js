import req from '@/libs/api.request'

export const apiLogin = ({ userName, password }) => {
  return req.axios0.request({
    url: '/user/login',
    data: {
      username:userName,
      password
    },
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return req.axios0.request({
    url: '/user/getUserInfo',
    params: {
      userId: token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return req.axios0.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return req.axios0.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return req.axios0.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return req.axios0.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return req.axios0.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return req.axios0.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return req.axios0.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
