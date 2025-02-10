import req from '@/libs/api.request'
// 台风应急响应系统开始
// 台风轨迹路线//haiyantrack
export const haiyantrack = (data) => {
  return req.axios2.request({
    url: '/haiyantrack',
    params: data,
    method: 'get'
  })
}
// 台风 风场
export const forecast = (data) => {
  return req.axios2.request({
    url: '/catastrophe/iem/shm/forecast',
    params: data,
    method: 'get'
  })
}
// 台风 降水/catastrophe/iem/shm/precipitation
export const precipitation = (data) => {
  return req.axios2.request({
    url: '/catastrophe/iem/shm/precipitation',
    params: data,
    method: 'get'
  })
}
// 台风 风场/catastrophe/iem/shm/windfield
export const windfield = (data) => {
  return req.axios2.request({
    url: '/catastrophe/iem/shm/windfield',
    params: data,
    method: 'get'
  })
}
// 历史台风事件/iem/shm/history
export const tfhistory = (data) => {
  return req.axios2.request({
    url: '/iem/shm/getHistoryEvent',
    params: data,
    method: 'get'
  })
}
// 历史台风事件路径
export const tfhistorydata = (data) => {
  return req.axios2.request({
    url: '/iem/shm/historydata',
    params: data,
    method: 'get'
  })
}
// 风灾分布 /iem/shm/totalwind
export const totalwind = (data) => {
  return req.axios2.request({
    url: '/iem/shm/totalwind',
    params: data,
    method: 'get'
  })
}
// 风灾分布 Typhoon/vmaxbycounty
export const vmaxbycounty = (data) => {
  return req.axios2.request({
    url: '/iem/shm/vmaxbycounty',
    params: data,
    method: 'get'
  })
}
// 建筑财产分布 /iem/shm/valueguangdong
export const valueguangdong = (data) => {
  return req.axios2.request({
    url: '/iem/shm/valueguangdong',
    params: data,
    method: 'get'
  })
}
// 温度 /catastrophe/iem/shm/temperature
export const temperature = (data) => {
  return req.axios2.request({
    url: '/catastrophe/iem/shm/temperature',
    params: data,
    method: 'get'
  })
}
// 台风损失
export const multiplierloss = (data) => {
  return req.axios2.request({
    url: '/iem/shm/multiplierloss',
    params: data,
    method: 'get'
  })
}
// 台风应急响应系统结束
// 根据台风eventid查询台风风场
// /iem/shm/vmax
export const vmax = (data) => {
  return req.axios2.request({
    url: '/iem/shm/wind1623event',
    params: data,
    method: 'get'
  })
}

// 台风应急响应系统
// 风场获取 //iem/shm/speed?
export const tfspeed = (data) => {
  return req.axios2.request({
    url: '/iem/shm/speed',
    params: data,
    method: 'get'
  })
}
// 台风路径获取
export const shanzhutrack = (data) => {
  return req.axios2.request({
    url: '/iem/shm/shanzhutrack',
    params: data,
    method: 'get'
  })
}
// 台风风险
// 查询模拟台风事件数据 /iem/shm/simtrackdata
export const simtrackdata = (data) => {
  return req.axios2.request({
    url: '/iem/shm/simtrackdata',
    params: data,
    method: 'get'
  })
}
// 根据台风eventid查询台风路径数据
// /iem/shm/simevents
export const simevents = (data) => {
  return req.axios2.request({
    url: '/iem/shm/simevents',
    params: data,
    method: 'get'
  })
}
// 台风 /windimpact?vulnid=1&v=1&value=1&mdr=1
export const windimpact = (data) => {
  return req.axios2.request({
    url: '/iem/shm/windimpact',
    params: data,
    method: 'get'
  })
}
// 获取台风geojson /iem/shm/geojson?glevel=city
export const geojsonurl = (data) => {
  return req.axios2.request({
    url: '/iem/shm/geojson',
    params: data,
    method: 'get'
  })
}
// 损失分布 Typhoon/iem/shmloss?type=RC&city=江门市,getMasonryLoss //  网格点
export const typhoonloss = (data,url) => {
  return req.axios2.request({
    url: '/iem/shm/'+url,
    params: data,
    method: 'get'
  })
}
// 风险暴露 /iem/shmexposure
export const typhoonexposure = (data) => {
  return req.axios2.request({
    url: '/iem/shm/iem/shmexposure',
    params: data,
    method: 'get'
  })
}
