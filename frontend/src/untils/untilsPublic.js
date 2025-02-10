import gcoord from 'gcoord'
// 动态生成当前时间
export const getcurrentTime = (str) => {
  let date = new Date()
  let Y = date.getFullYear() // 获取系统的年；
  let M = date.getMonth() + 1 // 获取系统月份，由于月份是从0开始计算，所以要加1
  let D = date.getDate() // 获取系统日
  let H = date.getHours() // 获取系统时间
  let m = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes() // 分
  let s = date.getSeconds() // 秒
  M = M < 10 ? '0' + M : M
  D = D < 10 ? '0' + D : D
  H = H < 10 ? '0' + H : H
  s = s < 10 ? '0' + s : s
  return Y + str + M + str + D + ' ' + H + ':' + m + ':' + s
}
// 动态生成随机数id
export const uuid = (center, radiusInKm, points) => {
  var s = []
  // 随机的id值从以下字符串中产生
  var uuidData = '0123456789abcdefghijklmnopqrstuvwxyz'
  var uuidDataLength = uuidData.length
  // 此处循环了32次，可以修改循环次数，循环次数决定生成id长度
  for (var i = 0; i < 32; i++) {
    // 从uuidData中随机截取一个字符
    s[i] = uuidData.substr(Math.floor(Math.random() * uuidDataLength), 1)
  }
  var uuid = s.join('')
  return uuid
}
// 公共工具方法
// 经纬度转换
export const transGcoord = (latlng, cur, to) => {
  var result = gcoord.transform(
    latlng, // 经纬度坐标
    gcoord[cur], // 当前坐标系
    gcoord[to] // 目标坐标系
  )
  return result
}
// 动态获取dr、loss、lossSum数据
export const filterData = (data, str) => {
  let list = []
  for (let j in data) {
    if (str == 'Loss_') {
      if (j.indexOf(str) != -1 && j.indexOf('Sum') == -1) {
        list.push({
          [j]: data[j] * 1
        })
      }
    } else if (j.indexOf(str) != -1) {
      if (str == 'Loss_Sum') {
        list.push(data[j] * 1)
      } else {
        list.push({
          [j]: data[j] * 1
        })
      }
    }
  }
  return list
}

export const compare = (key, desc) => {
  // key:  用于排序的数组的key值
  // desc： 布尔值，为true是升序排序，false是降序排序
  return function (a, b) {
    let value1 = a[key] * 1
    let value2 = b[key] * 1
    if (desc == true) {
      // 升序排列
      return value1 - value2
    } else {
      // 降序排列
      return value2 - value1
    }
  }
}
