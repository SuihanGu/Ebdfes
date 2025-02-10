import req from '@/libs/api.request'


// 项目管理 
// 仪器占比 shm/jmDevices
export const jmDevices = (data) => {
  return req.axios2.request({
    url: '/iem/shm/jmDevices',
    params: data,
    method: 'GET'
  })
}
// 地震预警信息 shm/eew1
export const eew1 = (data) => {
  return req.axios2.request({
    url: '/iem/shm/eew1',
    params: data,
    method: 'GET'
  })
}
// 数据管理
// 测斜探头 localhost:4999/iem/shm/jmBus
export const jmBus = (data) => {
  return req.axios2.request({
    url: '/iem/shm/jmBus',
    params: data,
    method: 'GET'
  })
}
// 水位计 jmWlg
export const jmWlg = (data) => {
    return req.axios2.request({
      url: '/iem/shm/jmWlg',
      params: data,
      method: 'GET'
    })
}

// 位移监测-测缝计 jmData
export const jmData = (data) => {
    return req.axios2.request({
      url: '/iem/shm/jmData',
      params: data,
      method: 'GET'
    })
}

// 水准仪 jmLevel
export const jmLevel = (data) => {
  return req.axios2.request({
    url: '/iem/shm/jmLevel',
    params: data,
    method: 'GET'
  })
}
// 加速度 byData
export const byData = (data) => {
  return req.axios2.request({
    url: '/iem/shm/byData',
    params: data,
    method: 'GET'
  })
}
// 加速度 QD
export const QD = (data) => {
  return req.axios2.request({
    url: '/iem/shm/QD',
    params: data,
    method: 'GET'
  })
}
// 多功能气象站 getRikaid
export const getRikaid = (data) => {
  return req.axios2.request({
    url: '/iem/shm/getRikaid',
    params: data,
    method: 'GET'
  })
}
// 弹窗动态接口
export const dtUrl = (data,url) => {
  return req.axios2.request({
    url: '/iem/shm/'+url,
    params: data,
    method: 'GET'
  })
}
