import req from '@/libs/api.request'

// /ceakj/azkaban/execute-flow
export const executeFlow = (data) => {
  return req.axios2.request({
    url: '/ceakj/azkaban/execute-flow',
    params: data,
    method: 'get'
  })
}
// /ceakj/azkaban/fetchExecFlow
export const fetchExecFlow = (data) => {
  return req.axios2.request({
    url: '/ceakj/azkaban/fetchExecFlow',
    params: data,
    method: 'get'
  })
}
