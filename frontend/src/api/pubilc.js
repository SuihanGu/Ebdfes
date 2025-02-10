import req from '@/libs/api.request'

// 获取geojson
export const geojson = (data) => {
  return req.axios0.request({
    url: '/Geo/geojson',
    params: data,
    method: 'get'
  })
}
