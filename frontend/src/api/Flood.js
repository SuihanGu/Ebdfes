import req from '@/libs/api.request'
// 洪水应急响应系统开始
// 历史洪水事件 /event
export const floodEvent = (data) => {
  return req.axios2.request({
    url: '/Flood/event',
    params: data,
    method: 'get'
  })
}

// 洪水轨迹路线//haiyantrack
export const floodDepth = (data) => {
  return req.axios2.request({
    url: '/Flood/depth',
    params: data,
    method: 'get'
  })
}
// 洪水淹没过程 /Flood/eventdepth?time=2023-07-31%2021:00:00&flood=doksuri
export const eventdepth = (data) => {
  return req.axios2.request({
    url: '/Flood/eventdepth',
    params: data,
    method: 'get'
  })
}
// 降雨量获取 /Flood/rain
export const floodRain = (data) => {
  return req.axios2.request({
    url: '/Flood/rain',
    params: data,
    method: 'get'
  })
}

// 洪水损失 /Flood/totalloss?flood=bj
export const totalloss = (data) => {
  return req.axios2.request({
    url: '/Flood/totalloss',
    params: data,
    method: 'get'
  })
}
