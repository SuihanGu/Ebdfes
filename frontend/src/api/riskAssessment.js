import req from '@/libs/api.request'



// 动态接口
export const EP = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url,
    params: data,
    method: 'get'
  })
}
/* 账户开始 */
// 获取Account
export const accgrp = (data, url) => {
    return req.axios2.request({
        url:'/iem' + url + '/accgrp',
        params: data,
        method: 'get'
    })
}
// 删除acct
export const deleteacct = (data, url) => {
    return req.axios2.request({
      url:'/iem' + url + '/deleteacct',
      params: data,
      method: 'get'
    })
}
// 新增acct api/Assessment/updateacct
export const updateacct = (data, url) => {
    return req.axios2.request({
      url:'/iem' + url + '/updateacct',
      params: data,
      method: 'get'
    })
}
// 根据投资组合id查询账户
export const selectacct = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/selectacct',
    params: data,
    method: 'get'
  })
}
/* 账户结束 */

/* 投资组合开始 */
// 获取投资组合
export const portinfo = (data, url) => {
    return req.axios2.request({
        url:'/iem' + url + '/portinfo',
        params: data,
        method: 'get'
    })
}
export const exposureGridid = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/getExposure',
    params: data,
    method: 'get'
  })
}
// 删除port Assessment/deleteport?portinfoid=44
export const deleteport = (data, url) => {
    return req.axios2.request({
        url:'/iem' + url + '/deleteport',
        params: data,
        method: 'get'
    })
}
// 校验投资组合编号 api/Assessment/validateport?portnum=test2
export const validateport = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/validateport',
    params: data,
    method: 'get'
  })
}
// 提交投资组合
export const insertport = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/insertport',
    params: data,
    method: 'get'
  })
}
/* 投资组合结束 */

/* 风险点开始 */
// 获取风险点
export const exposure = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/getExposure',
    params: data,
    method: 'get'
  })
}
// 删除风险点
export const deleteloc = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/deleteloc',
    params: data,
    method: 'get'
  })
}
// 地址解码 /geocode/geocoding 全部
export const geocoding = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/geocoding',
    params: data,
    method: 'get'
  })
}
// 查询可选择的occ Assessment/occ?occ=  // riskAssess
export const occ = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/occ',
    params: data,
    method: 'get'
  })
}
// 查询可选择的con Assessment/con?con=// riskAssess
export const con = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/con',
    params: data,
    method: 'get'
  })
}
// 查询可选择的yb Assessment/yb?yb=// riskAssess
export const yb = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/yb',
    params: data,
    method: 'get'
  })
}
// 查询可选择的ns Assessment/ns?ns=// riskAssess
export const ns = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/ns',
    params: data,
    method: 'get'
  })
}
// 创建location insertloc // riskAssess
export const insertloc = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/insertloc',
    params: data,
    method: 'get'
  })
}
/* 风险点结束 */
/* 保险条款开始 */
// 查询保险条款 /Assessment/gettreaty // riskAssess
export const gettreaty = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/trtydesc',
    params: data,
    method: 'get'
  })
}
// 删除保险条款 api/Assessment/deletetreaty?treatyid=3
export const deletetreaty = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/deletetreaty',
    params: data,
    method: 'get'
  })
}
// 提交保险条款 /Assessment/inserttreaty
export const inserttreaty = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/inserttreaty',
    params: data,
    method: 'get'
  })
}
// 查询条款再保险信息 selecttreaty
export const selecttreaty = (data, url) => {
    return req.axios2.request({
      url:'/iem' + url + '/selecttreaty',
      params: data,
      method: 'get'
    })
}
// 获取临时在保信息 /Assessment/selectreinsinf?accgrpid=1
export const selectreinsinf = (data, url) => {
    return req.axios2.request({
      url:'/iem' + url + '/selectreinsinf',
      params: data,
      method: 'get'
    })
}
// 删除临时在保信息 http://localhost:8080/Assessment/deletereinsinf?reinsinfid=6
export const deletereinsinf = (data, url) => {
    return req.axios2.request({
      url:'/iem' + url + '/deletereinsinf',
      params: data,
      method: 'get'
    })
}
// 获取保单 /Assessment/getpolicybyacct?accgrpid=1 
export const getpolicybyacct = (data, url) => {
    return req.axios2.request({
      url:'/iem' + url + '/getpolicybyacct',
      params: data,
      method: 'get'
    })
}

// 新增保单 /Assessment/insertreinsinf?=&exposureid=1&priority=1&layernum=1&pcntreins=1&layeramt=1&layercur=1&excessamt=1&reinsname=1
export const insertreinsinf = (data, url) => {
    return req.axios2.request({
      url:'/iem' + url + '/insertreinsinf',
      params: data,
      method: 'get'
    })
}
/* 保险条款开始 */

/* 创建风险评估开始 */
// 创建分析  Assessment/insertProject?portinfoid=1&edmnum=1&peril=1&region=1&edmcur=1&vulncurve=1 // riskAssess
export const insertProject = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/insertProject',
    params: data,
    method: 'get'
  })
}
// 获取创建分析 Assessment/getProject // riskAssess
export const getProject = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/getProject',
    params: data,
    method: 'get'
  })
}
/* 创建风险评估结束 */

/* 单次事件损失估计开始 */
// 获取潜在风险点信息 Assessment/expsourestats?longitude=126&latitude=46&range=0.5 // riskAssess
export const expsourestats = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/expsourestats',
    params: data,
    method: 'get'
  })
}
/* 单次事件损失估计结束 */

/* 评估结果分析开始 */
// 获取评估结果分析的可选择的分析项目 // riskAssess
export const getAnalysesProject = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/getAnalysesProject',
    params: data,
    method: 'get'
  })
}

// 获取任何aal Assessment/AAL?id=1&ty=1&lvl=accgrp&losstype=tyloss // riskAssess
export const AAL = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/AAL',
    params: data,
    method: 'get'
  })
}
/* 评估结果分析结束 */

/* 管理风险暴露数据开始*/
// 上传风险暴露数据
export const importdata = (data, url) => {
  return req.axios2.request({
    url:'/iem' + url + '/importdata',
    data: data,
    method: 'post'
  })
}
/* 风险暴露数据结束*/
