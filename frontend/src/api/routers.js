import req from '@/libs/api.request'

export const getRouterReq = (access) => {
  return req.axios0.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}
