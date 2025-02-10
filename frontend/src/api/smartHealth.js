import req from '@/libs/api.request'

// 智慧健康/Monitoring/measurepoint
export const measurepoint = (data) => {
  return req.axios0.request({
    url: '/Monitoring/measurepoint',
    params: data,
    method: 'get'
  })
}

export const location = (data) => {
  return req.axios0.request({
    url: '/Monitoring/location',
    params: data,
    method: 'get'
  })
}
// 树节点查询
export const category = (data) => {
  return req.axios0.request({
    url: '/Monitoring/category',
    params: data,
    method: 'get'
  })
}
// 采集仪状态查询 /Monitoring/status
export const status = (data) => {
  return req.axios0.request({
    url: '/Monitoring/status',
    params: data,
    method: 'get'
  })
}
// 实时加速度 //Monitoring/taidedata
export const taidedata = (data) => {
  return req.axios0.request({
    url: '/Monitoring/acc',
    params: data,
    method: 'get'
  })
}

// 统计报表 /Monitoring/stats
export const stats = (data) => {
  return req.axios0.request({
    url: '/Monitoring/stats',
    params: data,
    method: 'get'
  })
}
// 相关图新建临时表 /Monitoring/tmp
export const tmp = (data) => {
  return req.axios0.request({
    url: '/Monitoring/tmp',
    params: data,
    method: 'get'
  })
}
// 获取相关图临时数据 /Monitoring/ab
export const ab = (data) => {
  return req.axios0.request({
    url: '/Monitoring/ab',
    params: data,
    method: 'get'
  })
}
// 获取加速度相关图散点
export const acctime = (data) => {
  return req.axios0.request({
    url: '/Monitoring/acctime',
    params: data,
    method: 'get'
  })
}

// 温湿度相关图散点 /Monitoring/humi?humidity=1&startTime=2023-01-04 11:51:26&endTime=2023-01-04 11:51:27
export const humi = (data) => {
  return req.axios0.request({
    url: '/Monitoring/humi',
    params: data,
    method: 'get'
  })
}

// 设备管理
// 目录 /Monitoring/catlog
export const catlog = (data) => {
  return req.axios0.request({
    url: '/Monitoring/catlog',
    params: data,
    method: 'get'
  })
}
