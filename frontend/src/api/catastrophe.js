import req from '@/libs/api.request'

// export const homeCalamity = (userId,startTime,endTime) => {
//   return req.axios2.request({
//     url: '/iem/shm/calamity',
//     params: {
//       userId,
//       startTime,
//       endTime
//     },
//     method: 'get'
//   })
// }
// 计算当前地震 /eq_emergency/caculate_request
export const caculate_request = (data) => {
  return req.axios2.request({
    url: '/iem/shm/caculate_request',
    params: data,
    method: 'get'
  })
}
// 当前地震
export const dr_loss = (data) => {
  return req.axios2.request({
    url: '/iem/shm/JoinEblJoinEcgjd',
    params: data,
    method: 'get'
  })
}
// 人员伤亡总人数/iem/shm/fatility_population
export const fatility_population = (data) => {
  return req.axios2.request({
    url: '/iem/shm/fatility_population',
    params: data,
    method: 'get'
  })
}
// 人员伤亡概率
// /iem/shm/fatality_uncertainty
export const fatality_uncertainty = (data) => {
  return req.axios2.request({
    url: '/iem/shm/getEdwFI',
    params: data,
    method: 'get'
  })
}
// /iem/shm/location_info
export const location_info = (data) => {
  return req.axios2.request({
    url: '/iem/shm/location_info',
    params: data,
    method: 'get'
  })
}
// 各点损失评估结果 /iem/shm/roll_show
export const roll_show = (data) => {
  return req.axios2.request({
    url: '/iem/shm/JoinEblJoinEcgjd1',
    params: data,
    method: 'get'
  })
}
// 直接经济损失 模拟次数赔付金额 /iem/shm/stimulate_time
export const stimulate_time  = (data) => {
  return req.axios2.request({
    url: '/iem/shm/getEdwLossList',
    params: data,
    method: 'get'
  })
}
// 台站 /iem/shm/station_info
export const station_info = (data) => {
  return req.axios2.request({
    url: '/iem/shm/station_info',
    params: data,
    method: 'get'
  })
}
// 历史地震 http://172.18.1.21:8080/iem/shm/history_eq
export const history_eq = (data) => {
  return req.axios2.request({
    url: '/iem/shm/history_eq',
    params: data,
    method: 'get'
  })
}
// 峰值加速度等值线 /iem/shm/contour_line
export const contour_line = (data) => {
  return req.axios2.request({
    url: '/iem/shm/getContourLine',
    params: data,
    method: 'get'
  })
}
// 获取当前地震或根据eventid获取对应地震事件内容
export const eventid = (data) => {
  return req.axios2.request({
    url: '/iem/shm/getEQUSGS1',
    params: data,
    method: 'get'
  })
}
