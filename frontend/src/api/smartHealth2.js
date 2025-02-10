import req from '@/libs/api.request'

// 数据分析和首页
// 监测建筑经纬度 "path": "/mysql/shm/long_lat_query"
export const long_lat_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/long_lat_query',
    params: data,
    method: 'get'
  })
}
// 温湿度api/mysql/shm/temperature_humidity_query
export const temperature_humidity_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/temperature_humidity_query',
    params: data,
    method: 'get'
  })
}
// 加速度
export const time_features_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/time_features_query',
    params: data,
    method: 'get'
  })
}
// 实时加速度
export const acc_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/acc_query',
    params: data,
    method: 'get'
  })
}

// 项目管理
// 工程名称下拉选项值 工程名称查询
export const engineeringconfig_engineeringquery = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/engineeringconfig_engineeringquery',
    params: data,
    method: 'get'
  })
}

// "path": "/mysql/shm/engineeringconfig_engineeringquery",
// 工程名称下拉选项值 采集仪和工程名称查询
export const engineeringconfig_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/engineeringconfig_query',
    params: data,
    method: 'get'
  })
}
// 查询
export const engineeringconfig_distinct = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/engineeringconfig_distinct',
    params: data,
    method: 'get'
  })
}

// 设备管理 /mysql/shm/statuscatlog_query
export const statuscatlog_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/statuscatlog_query',
    params: data,
    method: 'get'
  })
}
// 设备管理实时更新 "path": "/mysql/shm/realstate_query",
export const realstate_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/realstate_query',
    params: data,
    method: 'get'
  })
}

// 阈值预警
// 静态表 "path": "/mysql/shm/threshold_warning_tabel",
export const threshold_warning_tabel = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/threshold_warning_tabel',
    params: data,
    method: 'get'
  })
}
// 静态表数据更新 /mysql/shm/threshold_warning_updata
export const threshold_warning_updata = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/threshold_warning_updata',
    params: data,
    method: 'get'
  })
}

// 预警播报
export const threshold_warning_eachsecond = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/threshold_warning_eachsecond',
    params: data,
    method: 'get'
  })
}

// 动态柱状图
export const threshold_warning_groupby = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/threshold_warning_groupby',
    params: data,
    method: 'get'
  })
}

// 实时更新预警 /mysql/shm/eewsinfo_query
export const eewsinfo_query = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/eewsinfo_query',
    params: data,
    method: 'get'
  })
}

// 数据分析 关联分析
export const AnalysisLine = (data, url) => {
  return req.axios1.request({
    url: 'api/mysql/shm/' + url,
    params: data,
    method: 'get'
  })
}
// 数据下载
export const QueryHistorical_acc_dataset = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/QueryHistorical_acc_dataset',
    params: data,
    method: 'get'
  })
}

// 设备管理 查询全部设备
export const DeviceStatus_devices_statuslist = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/DeviceStatus_devices_statuslist',
    params: data,
    method: 'get'
  })
}
// 今日设备状态

export const TodayStatus_devices_statuslist = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/TodayStatus_devices_statuslist',
    params: data,
    method: 'get'
  })
}
// 获取当月状态 MonthStatus_devices_statuslist
export const MonthStatus_devices_statuslist = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/MonthStatus_devices_statuslist',
    params: data,
    method: 'get'
  })
}
// 数据管理 最大值最小值平均值 /api/mysql/shm/Statistics24_acc_dataset
export const Statistics24 = (data, url) => {
  return req.axios1.request({
    url: 'api/mysql/shm/' + url,
    params: data,
    method: 'get'
  })
}
// 加速度表格获取
export const DataView_acc_dataset = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/DataView_acc_dataset',
    params: data,
    method: 'get'
  })
}
// 温湿度获取
export const DataView_humiture_dataset = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/DataView_humiture_dataset',
    params: data,
    method: 'get'
  })
}
// 阈值获取 RealtimeThreshold
export const RealtimeThreshold = (data, url) => {
  return req.axios1.request({
    url: 'api/mysql/shm/' + url,
    params: data,
    method: 'get'
  })
}
// AccQurey_acc_dataset
export const AccQurey_acc_dataset = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/AccQurey_acc_dataset',
    params: data,
    method: 'get'
  })
}

// 数据管理
// "path": "/api/mysql/shm/jm_dataset",测缝计
export const jm_dataset = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/jm_dataset',
    params: data,
    method: 'get'
  })
}
// "path": "/api/mysql/shm/jm_dataset_bus",测斜探头
export const jm_dataset_bus = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/jm_dataset_bus',
    params: data,
    method: 'get'
  })
}
// "path": "/api/mysql/shm/jm_dataset_wlg"水位计
export const jm_dataset_wlg = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/jm_dataset_wlg',
    params: data,
    method: 'get'
  })
}
// "path": "/api/mysql/shm/jm_dataset_level"，水准仪
export const jm_dataset_level = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/jm_dataset_level',
    params: data,
    method: 'get'
  })
}
// boyuan_dataset "path": "/api/mysql/shm/boyuan_dataset",加速度仪1
export const boyuan_dataset = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/boyuan_dataset',
    params: data,
    method: 'get'
  })
}
// devicelist "path": "/api/mysql/shm/devicelist []",仪器占比
export const devicelist = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/devicelist',
    params: data,
    method: 'get'
  })
}
// devicewarning "path": "/api/mysql/shm/devicewarning []",预警分布
export const devicewarning = (data) => {
  return req.axios1.request({
    url: 'api/mysql/shm/devicewarning',
    params: data,
    method: 'get'
  })
}