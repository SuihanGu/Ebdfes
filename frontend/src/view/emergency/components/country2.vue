<template>
    <div style="width:100%;height:100%;position:relative">
        <div id="container" style="position:relative;z-index:1;width:100%;height:100%;"></div>
        <infoWindow ref="infoWindow" style="margin-top:16px;" v-if="maptype=='egy'"/>
    </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import { transGcoord } from '@/untils/untilsPublic'
import Japan from '@/untils/Japan.json' // 中国地图
import infoWindow from './infoWindow.vue'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  components: {
    infoWindow
  },
  props: ['pointCenter', 'cityZoom',],
  data () {
    return {
      dom: null,
      dom2: null,
      mapCenter: [],
      marker:null,// 地震发生点
      mapBoxMap: null, // 腾讯地图
      maptype:'egy',
      infoWindowBox: null, // 信息窗口
      markerCluster: null, // 点聚合
      clusterBubbleList: [],
      markerList: null, // 点标记
      heatLayer1: null, // 人员伤亡热力图
      isoLine: null, // 峰值加速度等值线
      textLabel: null, // 峰值加速度标记
      hisDot: null, // 历史地震点
      hisDot2: null
    }
  },
  mounted () {
    let that = this
    that.$nextTick(() => {
    })
  },
  methods: {
    initBasicMap () {
      let that = this
      // WGS84 GCJ02
      that.mapCenter = JSON.parse(JSON.stringify(transGcoord(that.pointCenter, 'WGS84', 'GCJ02')))
      var center = new TMap.LatLng(that.mapCenter[1], that.mapCenter[0])
      // 初始化地图
      that.mapBoxMap = new TMap.Map('container', {
        // rotation: 20,//设置地图旋转角度
        pitch: 30, // 设置俯仰角度（0~45）
        zoom: 6, // 设置地图缩放级别
        center: center, // 设置地图中心点坐标
        mapStyleId: 'style1',
      })
      new TMap.vector.GeoJSONLayer({
        map: that.mapBoxMap,
        data: Japan,
        polygonStyle: new TMap.PolygonStyle({
          'color': 'rgba(0,0,0,0)',
          'showBorder': true, //是否显示边线
          'borderColor': '#fff', //边线颜色
          'borderWidth': 1 //边线宽度
        }),
      });
      that.initMarker()
    },
    // 绘制geojson区域图
    upDateMultiPolygon(json){
      let that = this
      that.maptype="shm"
      new TMap.vector.GeoJSONLayer({
        map: that.mapBoxMap,
        data: json,
        polygonStyle: new TMap.PolygonStyle({
          'color': 'rgba(62,186,65,1)',
          'showBorder': true, //是否显示边线
          'borderColor': '#0c94DD', //边线颜色
          'borderWidth': 1 //边线宽度
        }),
      });
      that.mapflyTo(10.8, 0)
    },
    // 生成标记点
    initMarker(){
      var center = new TMap.LatLng(this.mapCenter[1], this.mapCenter[0])
      this.marker = new TMap.MultiMarker({
        map: this.mapBoxMap,
        styles: {
          // 点标记样式
          marker: new TMap.MarkerStyle({
            width: 20, // 样式宽
            height: 30, // 样式高
            anchor: { x: 10, y: 30 } // 描点位置
          })
        },
        geometries: [
          // 点标记数据数组
          {
            // 标记位置(纬度，经度，高度)
            position: center,
            id: 'marker'
          }
        ]
      })
    },
    // 清除标记点
    removeMarker() {
      if (this.marker) {
          this.marker.setMap(null);
          this.marker = null;
      }
    },
    // 清除图层
    clearLayer () {
      let that = this
      if (that.infoWindowBox) {
        that.infoWindowBox.setMap(null)
        that.infoWindowBox = null
      }
      if (that.markerList) {
        that.markerList.setMap(null)
        that.markerList = null
      }
      if (that.markerCluster) {
        if (that.clusterBubbleList.length) {
          that.clusterBubbleList.forEach(function (item) {
            item.destroy()
          })
          that.clusterBubbleList = []
        }
        that.markerCluster.destroy()
        that.markerCluster = null
      }
      if (that.heatLayer1) {
        that.heatLayer1.setData([])
        that.heatLayer1.destroy()
        that.heatLayer1 = null
      }
      if (that.isoLine) {
        that.isoLine.setData([])
        that.isoLine.destroy()
        that.isoLine = null
      }
      if (that.textLabel) {
        that.textLabel.setMap(null)
        that.textLabel = null
      }
      if (that.hisDot) {
        that.hisDot.setData([])
        that.hisDot.destroy()
        that.hisDot = null
      }
      if (that.hisDot2) {
        that.hisDot2.setData([])
        that.hisDot2.destroy()
        that.hisDot2 = null
      }
    },
    // 调整数据结构
    changePointObj (data, max) {
      let list = []
      for (let i in data) {
        let center = []
        center = transGcoord([Number(data[i].longitude), Number(data[i].latitude)], 'WGS84', 'GCJ02')
        let obj = {
          position: new TMap.LatLng(center[1], center[0]),
          properties: data[i]
        }
        list.push(obj)
      }
      this.upDateTFLossPoint(list, max)
    },
    upDateTFLossPoint (data, max) {
      let that = this
      that.mapflyTo(7.5, 30)
      // 创建点聚合
      that.markerCluster = new TMap.MarkerCluster({
        map: that.mapBoxMap,
        enableDefaultStyle: false, // 关闭默认样式
        minimumClusterSize: 3,
        geometries: data,
        zoomOnClick: true,
        gridSize: 40,
        averageCenter: false
      })

      var markerGeometries = []

      // 监听聚合簇变化
      that.markerCluster.on('cluster_changed', function (e) {
        // 销毁旧聚合簇生成的覆盖物
        if (that.clusterBubbleList.length) {
          that.clusterBubbleList.forEach(function (item) {
            item.destroy()
          })
          that.clusterBubbleList = []
        }
        markerGeometries = []

        // 根据新的聚合簇数组生成新的覆盖物和点标记图层
        var clusters = that.markerCluster.getClusters()
        clusters.forEach(function (item) {
          if (item.geometries.length > 1) {
            let clusterBubble = new ClusterBubble({
              map: that.mapBoxMap,
              position: item.center,
              content: item.geometries.length,
              zIndex: 40,
              collisionOptions: {
                crossSource: true,
                vectorBaseMapSource: true
              }
            })
            clusterBubble.on('click', () => {
              that.mapBoxMap.fitBounds(item.bounds)
            })
            that.clusterBubbleList.push(clusterBubble)
          } else {
            markerGeometries.push({
              position: item.center,
              properties: item.geometries[0].properties
            })
          }
        })

        if (that.markerList) {
          // 已创建过点标记图层，直接更新数据
          that.markerList.setGeometries(markerGeometries)
        } else {
          // 创建点标记图层
          that.markerList = new TMap.MultiMarker({
            id: 'markerLayer',
            map: that.mapBoxMap,
            styles: {
              default: new TMap.MarkerStyle({
                'width': 34,
                'height': 42,
                'anchor': {
                  x: 17,
                  y: 21
                },
                'src': 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker_blue.png'
              })
            },
            zIndex: 100,
            collisionOptions: {
              crossSource: true,
              vectorBaseMapSource: true
            },
            geometries: markerGeometries
          })
          // 初始化infoWindow
          that.infoWindowBox = new TMap.InfoWindow({
            map: that.mapBoxMap,
            enableCustom: true,
            position: new TMap.LatLng(39.984104, 116.307503),
            offset: { y: -32, x: 0 },
            content: '<div class="info_card"></div>'
          })
          document.querySelector('.info_card').append(that.$refs.infoWindow.$el)
          that.infoWindowBox.close()
          // 监听标注鼠标移入事件
          that.markerList.on('mouseover', function (evt) {
            // 设置that.infoWindowBox
            that.infoWindowBox.setPosition(evt.geometry.position)// 设置信息窗位置
            that.$refs.infoWindow.getParentData(evt.geometry.properties, 0)
            setTimeout(() => {
              that.infoWindowBox.open() // 打开信息窗
            }, 100)
          })
          that.markerList.on('mouseout', function (evt) {
            that.infoWindowBox.close()
          })
        }
      })
    },
    // 人员伤亡热力图
    changeHeatobj (data, max, type) {
      let list = []
      for (let i in data) {
        if(parseInt(data[i][type]*100000)>0){
          let center = []
          center = transGcoord([Number(data[i].longitude), Number(data[i].latitude)], 'WGS84', 'GCJ02')
          let obj = {
            lng: center[0],
            lat: center[1],
            count: parseInt(data[i][type]*100000),
          }
          list.push(obj)
        }
        
      }
      if(max==null){
        max=0
      }
      this.fatalityP(list, max, type)
    },
    fatalityP (heatData, max, type) {
      let that = this
      that.mapflyTo(10, 70)
      // 初始化热力图并添加至map图层
      // let obj = {
      //   max: max>1000 ? max : max * 2, // 热力最强阈值
      //   min: 0, // 热力最弱阈值
      //   height: 40, // 峰值高度
      //   radius: 30, // 最大辐射半径
      //   transitAnimation: {
      //     duration: 5000 // 动画时长
      //   },
      //   enableLighting: true // 热力图是否呈现光照效果
      // }
      let len = 300
      if(heatData.length<=30){
        len=2000
      }else if(heatData.length>30&&heatData.length<=60){
        len=2000
      }else if(heatData.length>60&&heatData.length<=100){
        len=2000
      }else if(heatData.length>100&&heatData.length<=2000){
        len=1000
      }else if(heatData.length>2000&&heatData.length<=5000){
        len=500
      }
      let obj = {
        radius: len, //六边形中心点到端点的距离（半径）
        extrudable: true,
        heightRange: [1, 30000], // 高度变化区间
        showRange: [1, 1], //蜂窝聚合数据显示区间
        toggleAnimation: {
          animationType: "grow", //动画类型
          duration: 3000, //动画时长
        },
        colorList:['rgb(255,255,255)','rgb(253,219,199)','rgb(253,219,199)','rgb(239,138,98)','rgb(239,138,98)','#F24E4E','#F24E4E','rgb(178,24,43)','rgb(178,24,43)'],
        selectOptions: { //拾取配置
          action: 'hover', //拾取动作
          style: '#E9AB1D', //选中样式
          enableHighlight: false //是否使用高亮效果
        }
      }
      if (type == 'population') {
        obj.colorList=["#ea9c21", "#ea8e21", "#e6721c", "#e55f1d", "#cc2a18"]
        // obj.gradientColor = { // 渐变颜色
        //   0.6: '#673198',
        //   0.8: '#e53390',
        //   0.9: '#ffc95a'
        // }
      }
      //初始化蜂窝热力图图并添加至map图层
      that.heatLayer1 = new TMap.visualization.Hexagon(obj)
        .addTo(that.mapBoxMap)
        that.heatLayer1.setData(heatData); //设置数据
      // 数据聚合之后才能够真正获取值域范围
      that.heatLayer1.setShowRange(that.heatLayer1.getValueRange());
      // // 初始化infoWindow
      // that.infoWindowBox = new TMap.InfoWindow({
      //   map: that.mapBoxMap,
      //   enableCustom: true,
      //   position: new TMap.LatLng(39.984104, 116.307503),
      //   offset: { y: -32, x: 0 },
      //   content: '<div class="info_card"></div>'
      // })
      // document.querySelector('.info_card').append(that.$refs.infoWindow.$el)
      // that.infoWindowBox.close()
      // // 监听标注鼠标移入事件
      // that.heatLayer1.on('mouseover', function (evt) {
      //   var aggregator = evt && evt.detail && evt.detail.aggregator;
      //   let val = 0;
      //   for(let i in aggregator.rawData){
      //     val=val+aggregator.rawData[i].count
      //   }
      //   val=val/100000
      //   console.log(aggregator.rawData)
      //   that.infoWindowBox.setPosition(evt.latLng)// 设置信息窗位置
      //   that.$refs.infoWindow.getParentData(val, 2)
      //   setTimeout(() => {
      //     that.infoWindowBox.open() // 打开信息窗
      //   }, 100)
      // })
      // that.heatLayer1.on('mouseout', function (evt) {
      //   that.infoWindowBox.close()
      // })
      // that.heatLayer1 = new TMap.visualization.Heat(obj)
      //   .addTo(that.mapBoxMap)
      //   .setData(heatData)// 设置数据
      // // 文本标记
      // let geometries = []
      // heatData.forEach((i, index) => {
      //   if(i.count==max*1000||i.count*2>=max*1000){
      //     var marker = {
      //       //每个marker位置及文本
      //       position: new TMap.LatLng(i.lat, i.lng), //标注点位置
      //       content: i.count+'', //标注点文本
      //       styleId: 'label',
      //     };
      //     geometries.push(marker);
      //   }
      // });
      // //初始化点标记
      // that.textLabel = new TMap.MultiLabel({
      //   map: that.mapBoxMap, //显示Marker图层的底图
      //   styles: {
      //     label: new TMap.LabelStyle({
      //       color: '#ffffff', // 颜色属性
      //       size: 20, // 文字大小属性
      //       offset: { x: 0, y: 30000 }, // 文字偏移属性单位为像素
      //       angle: 0, // 文字旋转属性
      //       alignment: 'center', // 文字水平对齐属性
      //       verticalAlignment: 'middle', // 文字垂直对齐属性
      //     }),
      //   },
      //   geometries: geometries, //点标注数据数组
      // });
    },
    // 峰值加速度等值线
    changeLineobj (data, max) {
      let list = [], list2 = [], n = 0
      for (let i in data) {
        // let center = transGcoord([Number(data[i].clon), Number(data[i].clat)], 'WGS84', 'GCJ02')
        let center = [Number(data[i].clon), Number(data[i].clat)]
        let label = '烈度X'
        if(data[i].contourval==1000){
          label = '烈度X'
        }else if(data[i].contourval==500){
          label = '烈度IX'
        }else if(data[i].contourval==250){
          label = '烈度VIII'
        }else if(data[i].contourval==125){
          label = '烈度VII'
        }
        if (i>0) {
          if (data[i].contourval == data[i - 1].contourval) {
            list[n].path.push([center[1], center[0]])
          } else {
            n = list.length
            let num = parseInt((list[n - 1].path.length - 1) / 2)
            list[n - 1].path.push(list[n - 1].path[0])
            list.push({
              contourval: data[i].contourval,
              path: [[center[1], center[0]]],
              label,
            })
          }
        } else {
          n = 0
          list.push({
            contourval: data[i].contourval,
            path: [[center[1], center[0]]],
            label
          })
        }
      }
      console.log(list)
      this.updateISOLine(list, max)
    },
    updateISOLine (data, max) {
      let that = this
      that.mapflyTo(11, 30)
      that.isoLine = new TMap.visualization.Trail({
        pickStyle: function (item) { // 轨迹图样式映射函数
          let color = '#fe0300'
          if(item.contourval==1000){
            color = '#fe0300'
          }else if(item.contourval==500){
            color = '#f09a09'
          }else if(item.contourval==250){
            color = '#f5f811'
          }else if(item.contourval==125){
            color = '#00ff0d'
          }
          return { width: 4, color }
        },
        showDuration: Infinity, // 动画中轨迹点高亮的持续时间
        playTimes: 1,
        playRate: 1000000, // 动画播放倍速，默认为1m/s
        enableColorOffset: true
      })
        .addTo(that.mapBoxMap)
        .setData(data) // 设置数据
      let geometries = []
      data.forEach((i, index) => {
        // let count = data[index].count.toString(); //获取文本
        let len = parseInt(i.path.length / 2)
        var marker = {
          // 每个marker位置及文本
          position: new TMap.LatLng(i.path[len][0], i.path[len][1]), // 标注点位置
          content: i.label + '', // 标注点文本
          styleId: 'label'
        }
        geometries.push(marker)
      })
      // 初始化点标记
      that.textLabel = new TMap.MultiLabel({
        map: that.mapBoxMap, // 显示Marker图层的底图
        styles: {
          label: new TMap.LabelStyle({
            color: '#ffffff', // 颜色属性
            size: 20, // 文字大小属性
            offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
            angle: 0, // 文字旋转属性
            alignment: 'center', // 文字水平对齐属性
            verticalAlignment: 'middle' // 文字垂直对齐属性
          })
        },
        geometries: geometries // 点标注数据数组
      })
    },
    // 历史地震散点
    changePointHis (data) {
      let list = []
      for (let i in data) {
        if(i!=data.length-1){
          let center = transGcoord([Number(data[i].longitude), Number(data[i].latitude)], 'WGS84', 'GCJ02')
          let obj = {
            lat: center[1],
            lng: center[0],
            styleId: data[i].mag>5 ? 'style1' : 'style2',
            properties: data[i]
          }
          list.push(obj)
        }
      }
      this.updateHisPoint(list)
    },
    updateHisPoint (data) {
      let that = this
      that.mapflyTo(4, 0, [105.0293, 36.7711])
      // 初始化散点图并添加至map图层
      that.hisDot = new TMap.visualization.Dot({
        faceTo: 'map', // 散点固定的朝向
        styles: {
          style1: {
            type: 'circle', // 圆形样式
            fillColor: '#C72A18', // 填充颜色
            strokeWidth: 0, // 边线宽度
            radius: 5 // 原型半径
          },
          style2: {
            type: 'circle', // 圆形样式
            fillColor: '#FFCA1F', // 填充颜色
            radius: 3 // 原型半径
          }
        },
        enableBloom: true
      })
        .addTo(that.mapBoxMap)
      that.hisDot.setData(data) // 设置数据
      // 初始化散点图并添加至map图层
      that.hisDot2 = new TMap.visualization.Dot({
        faceTo: 'map', // 散点固定的朝向
        styles: {
          style1: {
            type: 'circle', // 圆形样式
            fillColor: 'rgba(204,42,24,0.3)',
            radius: 15
          },
          style2: {
            type: 'circle', // 圆形样式
            fillColor: 'rgba(255,202,31,0.3)',
            radius: 8
          }
        },
        processAnimation: {
          animationType: 'radiated' // 动画类型
        }
      })
        .addTo(that.mapBoxMap)
      that.hisDot2.setData(data) // 添加数据
      // 初始化infoWindow
      that.infoWindowBox = new TMap.InfoWindow({
        map: that.mapBoxMap,
        enableCustom: true,
        position: new TMap.LatLng(39.984104, 116.307503),
        offset: { y: -32, x: 0 },
        content: '<div class="info_card"></div>'
      })
      document.querySelector('.info_card').append(that.$refs.infoWindow.$el)
      that.infoWindowBox.close()
      // 监听标注鼠标移入事件
      that.hisDot2.on('mouseover', function (evt) {
        that.infoWindowBox.setPosition(evt.latLng)// 设置信息窗位置
        that.$refs.infoWindow.getParentData(evt.detail.dot.properties, 1)
        setTimeout(() => {
          that.infoWindowBox.open() // 打开信息窗
        }, 100)
      })
      that.hisDot2.on('mouseout', function (evt) {
        that.infoWindowBox.close()
      })
      that.hisDot2.on('click', function (evt) {
        let info = evt.detail.dot.properties
        that.$emit('toScrollData', info)
      })
    },
    mapflyTo (zoom, pitch,cen) {
      let center = new TMap.LatLng(this.mapCenter[1], this.mapCenter[0])
      if(cen!=undefined){
        center = new TMap.LatLng(cen[1], cen[0])
      }
      this.mapBoxMap.easeTo({
        center, zoom, pitch
      }, {
        duration: 2000
      })
    }
  },
  beforeDestroy () {
  }
}
// 以下代码为基于DOMOverlay实现聚合点气泡
function ClusterBubble (options) {
  TMap.DOMOverlay.call(this, options)
}

ClusterBubble.prototype = new TMap.DOMOverlay()

ClusterBubble.prototype.onInit = function (options) {
  this.content = options.content
  this.position = options.position
  this.zIndex = options.zIndex
}

// 销毁时需要删除监听器
ClusterBubble.prototype.onDestroy = function () {
  this.dom.removeEventListener('click', this.onClick)
  this.removeAllListeners()
}

ClusterBubble.prototype.onClick = function () {
  this.emit('click')
}

// 创建气泡DOM元素
ClusterBubble.prototype.createDOM = function () {
  var dom = document.createElement('div')
  dom.classList.add('clusterBubble')
  dom.innerText = this.content
  let size = 40 + parseInt(this.content)
  if (this.content>70) {
    size = 100
  }
  dom.style.cssText = [
    'width: ' + size + 'px;',
    'height: ' + size + 'px;',
    'line-height: ' + size + 'px;',
    'z-index: ' + `${this.zIndex}`
  ].join(' ')

  // 监听点击事件，实现zoomOnClick
  this.onClick = this.onClick.bind(this)
  // pc端注册click事件，移动端注册touchend事件
  dom.addEventListener('click', this.onClick)
  return dom
}

ClusterBubble.prototype.updateDOM = function () {
  if (!this.map) {
    return
  }
  // 经纬度坐标转容器像素坐标
  let pixel = this.map.projectToContainer(this.position)

  // 使文本框中心点对齐经纬度坐标点
  let left = pixel.getX() - this.dom.clientWidth / 2 + 'px'
  let top = pixel.getY() - this.dom.clientHeight / 2 + 'px'
  this.dom.style.transform = `translate(${left}, ${top})`

  this.emit('dom_updated')
}

window.ClusterBubble = ClusterBubble
</script>
