<template>
    <div style="position: relative;" id="hsMap2">
        <div ref="dom" class="charts chart-bar" style="width: 100%;height:100%;"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import * as turf from '@turf/turf'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { } from '@/api/data'
echarts.registerTheme('tdTheme', tdTheme)
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js')
let canvas = null, context = null
export default {
  name: 'hsMap',
  props: ['pointCenter', 'language', 'mapstyle'],
  data () {
    return {
      dom: null,
      controlLanguage: null, // 动态切换语言
      color1: [
        'rgba(33,102,172,0)',
        'rgb(103,169,207)',
        'rgb(209,229,240)',
        'rgb(253,219,199)',
        'rgb(239,138,98)',
        'rgb(178,24,43)'
      ],
      color2: [
        '#e0f3f8',
        '#ffffd7',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026'
      ]
    }
  },
  watch: {
    language (cur, old) {
      this.languageChange(cur)
    },
    mapstyle (cur, old) {
      this.mapStyleChange(cur)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initBasicMap()
    })
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initBasicMap () {
      let that = this
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      var option = {
        tooltip: {
          trigger: 'item'
        },
        mapbox: {
          center: that.pointCenter,
          zoom: 2,
          style: that.mapstyle,
          shading: 'realistic',
          light: {
            main: {
              intensity: 0.5,
              shadow: false
            },
            ambient: {
              intensity: 0.2
            },
            ambientCubemap: {
              exposure: 1,
              diffuseIntensity: 0.5,
              specularIntensity: 2
            }
          },
          zlevel: 1,
          projection: 'mercator' // starting projection
          // mercator
        },
        series: [
          {
            name: '网格点',
            color: '#ccff12',
            type: 'bar3D',
            coordinateSystem: 'mapbox',
            // blendMode: 'lighter',
            symbolSize: 8,
            zlevel: 10,
            itemStyle: {
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.8)'
            },
            data: []
          }
        ]
      }
      that.dom = echarts.init(that.$refs.dom, 'tdTheme')
      that.dom.setOption(option)
      on(window, 'resize', that.resize)
      that.mapBoxMap = that.dom
        .getModel()
        .getComponent('mapbox3D')
        .getMapbox()
      that.controlLanguage = new MapboxLanguage({
        defaultLanguage: that.language
      })
      that.mapBoxMap.addControl(that.controlLanguage)
      that.mapBoxMap.on('load', () => {
        // that.initMaker()
        // that.changeObj(this.devicesList)
        that.$emit('getTimeList')
      })
    },
    // 调整为geojson
    // 动态调整hs数据结构
    changePointObj (data, type) {
      let list = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      }
      let num = 0
      for (let i in data) {
        let center = []
        center = [Number(data[i].lon), Number(data[i].lat)]
        data[i][type] = Number(data[i][type])
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: data[i]
        }
        list.features.push(obj)
        num = num >= data[i][type] ? num : data[i][type]
      }
      if (type == 'flddph') {
        this.upDatetfHeatMap(list, '20230419', type, num)
      } else {
        this.upDatetfHeatMap2(list, '20230419', type, num)
      }
    },
    // 生成洪水热力图
    upDatetfHeatMap (data, typeName, type, num) {
      let that = this
      let option = {
        visualMap: {
          show: true,
          max: num,
          bottom: 80,
          right: 10,
          calculable: true,
          realtime: false,
          textStyle: {
            color: '#fff'
          },
          inRange: {
            color: that.color1
          },
          outOfRange: {
            colorAlpha: 0
          }
        }
      }
      that.dom.setOption(option)
      that.mapBoxMap.flyTo({ pitch: 0, zoom: 4 })
      if (that.mapBoxMap.getLayer('wfh' + typeName)) {
        that.mapBoxMap.getSource('wfd' + typeName).setData(data)
        return
      }
      var bbox = [112, 22, 114, 23] // 格网坐标 minX,minY,maxX,maxY. modify here.
      var cellSide = 5 // 格网长度
      var options = { units: 'kilometers' } // 长度单位
      var squareGrid = turf.squareGrid(bbox, cellSide, options) // 生成格网
      that.mapBoxMap.addSource('wfd' + typeName, {
        'type': 'geojson',
        'data': squareGrid
      })
      that.mapBoxMap.addLayer(
        {
          'id': 'wfh' + typeName,
          'type': 'fill',
          'source': 'wfd' + typeName,
          paint: {
            'fill-color': '#486DE0'
          }
        }
      )
    },
    // upDatetfHeatMap (data, typeName, type, num) {
    //   let that = this
    //   let option = {
    //     visualMap: {
    //       show: true,
    //       max:num,
    //       bottom: 80,
    //       right: 10,
    //       calculable: true,
    //       realtime: false,
    //       textStyle: {
    //         color: '#fff'
    //       },
    //       inRange: {
    //         color: that.color1
    //       },
    //       outOfRange: {
    //         colorAlpha: 0
    //       }
    //     }
    //   }
    //   that.dom.setOption(option)
    //   that.mapBoxMap.flyTo({ pitch: 0, zoom: 4 })
    //   if (that.mapBoxMap.getLayer('wfh' + typeName)) {
    //     that.mapBoxMap.getSource('wfd' + typeName).setData(data)
    //     return
    //   }
    //   that.mapBoxMap.addSource('wfd' + typeName, {
    //     'type': 'geojson',
    //     'data': data
    //   })
    //   that.mapBoxMap.addLayer(
    //     {
    //       'id': 'wfh' + typeName,
    //       'type': 'heatmap',
    //       'source': 'wfd' + typeName,
    //       'paint': {
    //         'heatmap-weight': [
    //           'interpolate',
    //           ['linear'],
    //           ['get', type],
    //           0, 0,
    //           num*3, 0.5
    //         ],
    //         'heatmap-intensity': [
    //           'interpolate',
    //           ['linear'],
    //           ['zoom'],
    //           13, 1,
    //           16, 1
    //         ],
    //         // 调整颜色
    //         'heatmap-color': [
    //           'interpolate',
    //           ['linear'],
    //           ['heatmap-density'],
    //           0, that.color1[0],
    //           0.2, that.color1[1],
    //           0.4, that.color1[2],
    //           0.6, that.color1[3],
    //           0.8, that.color1[4],
    //           1, that.color1[5]
    //         ],
    //         'heatmap-radius': [
    //           'interpolate',
    //           ['linear'],
    //           ['zoom'],
    //           13, 14,
    //           // 1,4,
    //           // 2,6,
    //           // 3,8,
    //           // 4,10,
    //           // 5,12,
    //           // 6,14,
    //           // 7,16,
    //           // 8,18,
    //           16, 14
    //         ],
    //         'heatmap-opacity': [
    //           'interpolate',
    //           ['linear'],
    //           ['zoom'],
    //           13, 1,
    //           16, 1
    //         ]
    //       }
    //     },
    //     'waterway-label'
    //   )
    // },
    // 生成洪水热力图
    upDatetfHeatMap2 (data, typeName, type, num) {
      let that = this
      that.mapBoxMap.flyTo({ pitch: 0, zoom: 4 })
      if (that.mapBoxMap.getLayer('rainl' + typeName)) {
        that.mapBoxMap.getSource('raind' + typeName).setData(data)
        return
      }
      let option = {
        visualMap: {
          show: true,
          max,
          bottom: 80,
          right: '25%',
          calculable: true,
          realtime: false,
          textStyle: {
            color: '#fff'
          },
          inRange: {
            color: that.color2
          },
          outOfRange: {
            colorAlpha: 0
          }
        }
      }
      that.dom.setOption(option)
      that.mapBoxMap.addSource('wfd' + typeName, {
        'type': 'geojson',
        'data': data
      })
      that.mapBoxMap.addLayer(
        {
          'id': 'wfh' + typeName,
          'type': 'heatmap',
          'source': 'wfd' + typeName,
          'paint': {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', type],
              0, 0,
              num * 10, 0.5
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 1,
              16, 1
            ],
            // 调整颜色
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, that.color2[0],
              0.2, that.color2[1],
              0.4, that.color2[2],
              0.6, that.color2[3],
              0.8, that.color2[4],
              1, that.color2[5]
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 14,
              // 1,4,
              // 2,6,
              // 3,8,
              // 4,10,
              // 5,12,
              // 6,14,
              // 7,16,
              // 8,18,
              16, 14
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 1,
              16, 1
            ]
          }
        },
        'waterway-label'
      )
    },
    //  清除图层
    clearLayer (typeName) {
      if (this.mapBoxMap.getLayer('wfh' + typeName)) {
        this.mapBoxMap.removeLayer('wfh' + typeName)
        this.mapBoxMap.removeSource('wfd' + typeName)
      }
      if (this.mapBoxMap.getLayer('rainl' + typeName)) {
        this.mapBoxMap.removeLayer('rainl' + typeName)
        this.mapBoxMap.removeSource('raind' + typeName)
      }
      this.dom.setOption({
        visualMap: {
          show: false
        },
        series: [
          {
            data: null
          }
        ]
      })
    }
  },
  beforeDestroy () {
    let that = this
    that.dom.setOption({
      series: [
        {
          data: null
        }
      ]
    })
    off(window, 'resize', this.resize)
  }
}
</script>
<style lang="less">
#hsMap2{
    width: 100%;
    height: 100%;
    .mapboxgl-ctrl-bottom-left{
        display: none;
    }
    .mapboxgl-popup-content{
        background: rgba(32, 66, 122, 0.85);
        box-shadow: #4193d9 0px 0px 20px inset;
        color: #fff !important;
    }
    .mapboxgl-popup-tip{
        display: none;
    }
    .mapboxgl-popup-close-button{
        color: #fff;
    }
    .popupBox{
        .title{
            font-size: 15px;
            font-weight: 600;
            background-color: rgba(204, 204, 204,0.35);
            box-shadow: #4193d9 0px 0px 20px inset;
            border-radius: 12px;
            padding: 10px;
            text-align: center;
        }
        .btn{
            margin: 0 auto;
            margin-top: 18px;
            width: 50%;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 12px;
            background-color: rgba(65, 147, 217,.65);
            text-align: center;
        }
    }
}
</style>
