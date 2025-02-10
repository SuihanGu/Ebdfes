import req from '@/libs/api.request'
// 邮箱订阅
export const insertEmail = (data) => {
  return req.axios2.request({
    url: '/user/emergency/insertEmail',
    params: data,
    method: 'get'
  })
}
// 首页开始
// 查询历史地震信息
export const homeCalamity = (userId, startTime, endTime, nation) => {
  // params: {
  //   userId,
  //   startTime,
  //   endTime,
  //   nation
  // },
  return req.axios2.request({
    url: '/iem/shm/getEQUSGS',
    
    method: 'get'
  })
}
// 首页结束

// 地震应急响应系统开始
/// api/iem/shm/japanBoundry
// 日本地图边界线获取
export const japanBoundry = (data, url) => {
  return req.axios2.request({
    url: '/iem/shm/japanBoundry',
    params: data,
    method: 'get'
  })
}

// 查询地震信息
export const getGridInfo = (data, url) => {
  return req.axios2.request({
    url: '/iem/shm/getGridInfo',
    params: data,
    method: 'get'
  })
}

// 人员伤亡人数分布
export const fatality = (data, url) => {
  return req.axios2.request({
    url: '/iem/shm/fatalityProb',
    // params: data,
    method: 'get'
  })
}

// 人员伤亡可能
export const fatalityDistribution = (data, url) => {
  return req.axios2.request({
    url: '/iem/shm/fatalityDistribution',
    // params: data,
    method: 'get'
  })
}
// 整体损失评估结果
export const pointLossResult = (data, url) => {
  return req.axios2.request({
    url: '/iem/shm/pointLossResult',
    // params: data,
    method: 'get'
  })
}

// 获取历史地震信息
export const historyEarthke = (data, url) => {
  return req.axios2.request({
    url: '/iem/shm/historyEarthke',
    // params: data,
    method: 'get'
  })
}
// 台站分布记录
// 获取历史地震信息
export const stationInfo = (data, url) => {
  return req.axios2.request({
    url: '/iem/shm/stationInfo',
    params: data,
    method: 'get'
  })
}
// 地震应急响应系统结束

// 风险评估
// 分析生成器
// 评估结果分析
export const riskresults = (data, url) => {
  return req.axios2.request({
    url: url + '/riskresults',
    params: data,
    method: 'get'
  })
}
// 风险位置展示 // riskAssess
export const exposureGridid = (data, url) => {
  return req.axios2.request({
    url: url + '/exposureGrid',
    params: data,
    method: 'get'
  })
}
// 获取Account // riskAssess
export const accgrp = (data, url) => {
  return req.axios2.request({
    url: url + '/accgrp',
    params: data,
    method: 'get'
  })
}
// 获取 /Assessment/portinfo // riskAssess
export const portinfo = (data, url) => {
  return req.axios2.request({
    url: url + '/portinfo',
    params: data,
    method: 'get'
  })
}
// 获取locationsList // riskAssess
export const exposure = (data, url) => {
  return req.axios2.request({
    url: url + '/exposure',
    params: data,
    method: 'get'
  })
}

// 获取投资组合下的账户数据 /Assessment/portacct
export const portacct = (data, url) => {
  return req.axios2.request({
    url: url + '/portacct',
    params: data,
    method: 'get'
  })
}

// 风险评估分析 /Assessment/riskanalysis
export const riskanalysis = (data, url) => {
  return req.axios2.request({
    url: url + '/riskanalysis',
    params: data,
    method: 'get'
  })
}
// /Assessment/getacctep
export const getacctep = (data, url) => {
  return req.axios2.request({
    url: url + '/getacctep',
    params: data,
    method: 'get'
  })
}
// /Assessment/riskanalysis/acctep
export const acctep = (data, url) => {
  return req.axios2.request({
    url: url + '/riskanalysis/acctep',
    params: data,
    method: 'get'
  })
}
// /Assessment/riskanalysis/portep
export const portep = (data, url) => {
  return req.axios2.request({
    url: url + '/riskanalysis/portep',
    params: data,
    method: 'get'
  })
}
// /Assessment/riskresults/acctaal
export const acctaal = (data, url) => {
  return req.axios2.request({
    url: url + '/riskresults/acctaal',
    params: data,
    method: 'get'
  })
}
// /Assessment/riskresults/portaal
export const portaal = (data, url) => {
  return req.axios2.request({
    url: url + '/riskresults/portaal',
    params: data,
    method: 'get'
  })
}
// 风险评估结果 /dc/calc/users_simulate
export const users_simulate = (data, url) => {
  return req.axios2.request({
    url: '/dc/calc/users_simulate',
    // params: data,
    method: 'get'
  })
}
// /Assessment/getresults
export const getresults = (data, url) => {
  return req.axios2.request({
    url: url + '/getresults',
    // params: data,
    method: 'get'
  })
}

// 创建prolfil 筛选account // riskAssess
// 筛选account查询
export const selectacct = (data, url) => {
  return req.axios2.request({
    url: url + '/selectacct',
    params: data,
    method: 'get'
  })
}
// /Assessment/selectloc 获取loc查询
export const selectloc = (data, url) => {
  return req.axios2.request({
    url: url + '/selectloc',
    params: data,
    method: 'get'
  })
}
// 校验port编号 api/Assessment/validateport?portnum=test2 // riskAssess
export const validateport = (data, url) => {
  return req.axios2.request({
    url: url + '/validateport',
    params: data,
    method: 'get'
  })
}
// 提交port // riskAssess
export const insertport = (data, url) => {
  return req.axios2.request({
    url: url + '/insertport',
    params: data,
    method: 'get'
  })
}
// 删除port Assessment/deleteport?portinfoid=44 // riskAssess
export const deleteport = (data, url) => {
  return req.axios2.request({
    url: url + '/deleteport',
    params: data,
    method: 'get'
  })
}
// 删除port里的acc api/Assessment/deleteacctinport?accgrpid=1&portinfoid=7
export const deleteacctinport = (data, url) => {
  return req.axios2.request({
    url: url + '/deleteacctinport',
    params: data,
    method: 'get'
  })
}
// 新增acct api/Assessment/updateacct // riskAssess
export const updateacct = (data, url) => {
  return req.axios2.request({
    url: url + '/updateacct',
    params: data,
    method: 'get'
  })
}
// 删除acct // riskAssess
export const deleteacct = (data, url) => {
  return req.axios2.request({
    url: url + '/deleteacct',
    params: data,
    method: 'get'
  })
}
// 查询可选择的occ Assessment/occ?occ=  // riskAssess
export const occ = (data, url) => {
  return req.axios2.request({
    url: url + '/occ',
    params: data,
    method: 'get'
  })
}
// 查询可选择的con Assessment/con?con=// riskAssess
export const con = (data, url) => {
  return req.axios2.request({
    url: url + '/con',
    params: data,
    method: 'get'
  })
}
// 查询可选择的yb Assessment/yb?yb=// riskAssess
export const yb = (data, url) => {
  return req.axios2.request({
    url: url + '/yb',
    params: data,
    method: 'get'
  })
}
// 查询可选择的ns Assessment/ns?ns=// riskAssess
export const ns = (data, url) => {
  return req.axios2.request({
    url: url + '/ns',
    params: data,
    method: 'get'
  })
}
// 创建location insertloc // riskAssess
export const insertloc = (data, url) => {
  return req.axios2.request({
    url: url + '/insertloc',
    params: data,
    method: 'get'
  })
}
// 删除loc /Assessment/deleteloc // riskAssess
export const deleteloc = (data, url) => {
  return req.axios2.request({
    url: url + '/deleteloc',
    params: data,
    method: 'get'
  })
}

// 风险暴露 /house/shantou
export const shantou = (data, url) => {
  return req.axios2.request({
    url: '/house/shantou',
    params: data,
    method: 'get'
  })
}

// 查询保险条款 /Assessment/gettreaty // riskAssess
export const gettreaty = (data, url) => {
  return req.axios2.request({
    url: url + '/gettreaty',
    params: data,
    method: 'get'
  })
}
// 删除保险条款 api/Assessment/deletetreaty?treatyid=3
export const deletetreaty = (data, url) => {
  return req.axios2.request({
    url: url + '/deletetreaty',
    params: data,
    method: 'get'
  })
}
// 提交保险条款 /Assessment/inserttreaty
export const inserttreaty = (data, url) => {
  return req.axios2.request({
    url: url + '/inserttreaty',
    params: data,
    method: 'get'
  })
}
// 获取保单 /Assessment/getpolicybyacct?accgrpid=1 //riskAssess
export const getpolicybyacct = (data, url) => {
  return req.axios2.request({
    url: url + '/getpolicybyacct',
    params: data,
    method: 'get'
  })
}
// 新增保单 /Assessment/insertreinsinf?=&exposureid=1&priority=1&layernum=1&pcntreins=1&layeramt=1&layercur=1&excessamt=1&reinsname=1 // riskAssess
export const insertreinsinf = (data, url) => {
  return req.axios2.request({
    url: url + '/insertreinsinf',
    params: data,
    method: 'get'
  })
}
// 批量保存 /Assessment/insertreinsinfs?reins
export const insertreinsinfs = (data, url) => {
  return req.axios2.request({
    url: url + '/insertreinsinfs',
    params: data,
    method: 'get'
  })
}
// 获取临时在保信息 /Assessment/selectreinsinf?accgrpid=1 //riskAssess
export const selectreinsinf = (data, url) => {
  return req.axios2.request({
    url: url + '/selectreinsinf',
    params: data,
    method: 'get'
  })
}
// 删除临时在保信息 http://localhost:8080/Assessment/deletereinsinf?reinsinfid=6 // riskAssess
export const deletereinsinf = (data, url) => {
  return req.axios2.request({
    url: url + '/deletereinsinf',
    params: data,
    method: 'get'
  })
}
// 查询条款信息 selecttreaty // riskAssess
export const selecttreaty = (data, url) => {
  return req.axios2.request({
    url: url + '/selecttreaty',
    params: data,
    method: 'get'
  })
}
// /Assessment/getresults

// 创建分析  Assessment/insertProject?portinfoid=1&edmnum=1&peril=1&region=1&edmcur=1&vulncurve=1 // riskAssess
export const insertProject = (data, url) => {
  return req.axios2.request({
    url: url + '/insertProject',
    params: data,
    method: 'get'
  })
}
// 获取创建分析 Assessment/getProject // riskAssess
export const getProject = (data, url) => {
  return req.axios2.request({
    url: url + '/getProject',
    params: data,
    method: 'get'
  })
}
// 获取评估结果分析的可选择的分析项目 // riskAssess
export const getAnalysesProject = (data, url) => {
  return req.axios2.request({
    url: url + '/getAnalysesProject',
    params: data,
    method: 'get'
  })
}
// // 提交分析项目获取直接经济损失 Assessment/locEP
// export const locEP = (data,url) => {
//   return req.axios2.request({
//     url: url+'/locEP',
//     params: data,
//     method: 'get'
//   })
// }
// // 保险条款经济损失
// export const tyEP = (data,url) => {
//   return req.axios2.request({
//     url: url+'/tyEP',
//     params: data,
//     method: 'get'
//   })
// }

// 获取ep曲线，任何 // riskAssess
export const EP = (data, url) => {
  return req.axios2.request({
    url: url + '/EP',
    params: data,
    method: 'get'
  })
}
// 获取任何aal Assessment/AAL?id=1&ty=1&lvl=accgrp&losstype=tyloss // riskAssess
export const AAL = (data, url) => {
  return req.axios2.request({
    url: url + '/AAL',
    params: data,
    method: 'get'
  })
}
// 下载结果 /streamDownload
export const streamDownload = (data, url) => {
  return req.axios2.request({
    url: '/streamDownload',
    params: data,
    method: 'get'
  })
}
// 获取ylt /Assessment/YLT?edmnum=test1
export const YLT = (data, url) => {
  return req.axios2.request({
    url: url + '/YLT',
    params: data,
    method: 'get'
  })
}
// 获取潜在风险点信息 Assessment/expsourestats?longitude=126&latitude=46&range=0.5 // riskAssess
export const expsourestats = (data, url) => {
  return req.axios2.request({
    url: url + '/expsourestats',
    params: data,
    method: 'get'
  })
}
// 上传文件  /geo/geocodeuploadexcel
export const geocodeuploadexcel = (data, url) => {
  return req.axios2.request({
    url: '/geo/geocodeuploadexcel',
    data: data,
    method: 'post'
  })
}
// 上传文件 geo/importaddress?fileName=exposure_shantou.xlsx
export const importaddress = (params, data) => {
  return req.axios2.request({
    url: '/geo/importaddress',
    params,
    data: {
      file: 1
    },
    method: 'get'
  })
}
// 获取上传文件
export const geocodeexceltrans = (data, url) => {
  return req.axios2.request({
    url: '/geo/geocodeexceltrans',
    data: data,
    method: 'post'
  })
}
// 数据导出 geo/exportgeocoding?fileName=
export const exportgeocoding = (data, url) => {
  return req.axios2.request({
    url: '/geo/exportgeocoding',
    params: data,
    method: 'get'
  })
}
// 获取地址 /geocode/getAddress
export const getAddress = (data, url) => {
  return req.axios2.request({
    url: '/geo/getAddress',
    params: data,
    method: 'get'
  })
}
// 地址解码 /geocode/geocoding?userid=1 全部
export const geocoding = (data, url) => {
  return req.axios2.request({
    url: url + '/geocoding',
    params: data,
    method: 'get'
  })
}
