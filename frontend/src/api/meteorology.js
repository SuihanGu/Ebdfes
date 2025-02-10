import req from '@/libs/api.request'

// 气象灾害预警
// 阵风
// catastrophe/weather/forecast?timeLine=2023-02-08-09:00:00
export const forecast = (data) => {
  return req.axios0.request({
    url: '/catastrophe/weather/forecast',
    params: data,
    method: 'get'
  })
}