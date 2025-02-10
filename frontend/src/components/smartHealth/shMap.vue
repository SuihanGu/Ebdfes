<template>
    <div style="position: relative;" id="shMap">
        <div ref="dom" class="charts chart-bar" style="width: 100%;height:100%;"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { } from '@/api/data'
echarts.registerTheme('tdTheme', tdTheme)
//   mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
export default {
  name: 'hsMap',
  props: ['devicesList', 'language', 'mapstyle'],
  data () {
    return {
      dom: null,
      controlLanguage: null// 动态切换语言
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
    //   clearInterval(this.timer2)
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
          center: that.devicesList.length>0 ? [that.devicesList[0].longitude * 1, that.devicesList[0].latitude * 1] : [0, 0],
          zoom: 13,
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
            type: 'scatter3D',
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
        that.changeObj(this.devicesList)
      })
    },
    // 调整为geojson
    changeObj (data) {
      let geojson1 = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      }
      let geojson2 = JSON.parse(JSON.stringify(geojson1))
      for (let i in data) {
        if (data[i].userid == '1') {
          let obj = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [data[i].longitude * 1, data[i].latitude * 1]
            },
            properties: data[i]
          }
          geojson1.features.push(obj)
        } else {
          let obj = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [data[i].longitude * 1, data[i].latitude * 1]
            },
            properties: data[i]
          }
          geojson2.features.push(obj)
        }
      }
      this.initMaker(geojson1, geojson2)
    },
    // 生成点标记
    initMaker (data1, data2) {
      let that = this
      that.mapBoxMap.loadImage(require('@/assets/images/shicon/markerOF.png'),
        (error, image) => {
          if (error) throw error
          that.mapBoxMap.addImage('markerOF', image)
          that.mapBoxMap.addSource('markerOFData', {
            'type': 'geojson',
            'data': data2
          })

          // Add a layer to use the image to represent the data.
          that.mapBoxMap.addLayer({
            'id': 'markerOFayer',
            'type': 'symbol',
            'source': 'markerOFData', // reference the data source
            'layout': {
              'icon-image': 'markerOF', // reference the image
              'icon-size': 1
            }
          })
        }
      )
      that.mapBoxMap.loadImage(require('@/assets/images/shicon/marker.png'),
        (error, image) => {
          if (error) throw error
          that.mapBoxMap.addImage('marker', image)
          that.mapBoxMap.addSource('markerData', {
            'type': 'geojson',
            'data': data1
          })

          // Add a layer to use the image to represent the data.
          that.mapBoxMap.addLayer({
            'id': 'markerLayer',
            'type': 'symbol',
            'source': 'markerData', // reference the data source
            'layout': {
              'icon-image': 'marker', // reference the image
              'icon-size': 1
            }
          })
        }
      )
      var popup = new mapboxgl.Popup({
        offset: 20
      })
      that.mapBoxMap.on('click', 'markerLayer', function (e) {
        // let res = JSON.parse(e.features[0].properties.direction_ns).join("，")
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `<div class="popupBox">
                        <div class="title">${e.features[0].properties.location}</div>
                        <div class="text">经度：${e.features[0].properties.longitude * 1}</div>
                        <div class="text">纬度：${e.features[0].properties.latitude * 1}</div>
                    </div>`
          )
          .addTo(that.mapBoxMap)
        // let ob = document.getElementById('btnHand');
        // ob.onclick=that.handelClick()
        // <div class="text">设备名称：${e.features[0].properties.loctime_devices}</div>
      })
    },
    // 页面跳转
    handelClick () {
      this.$router.push({
        name: 'smartHealthAnalysis'
      })
    },
    // 地图语言切换
    languageChange (val) {
      let style = this.mapBoxMap.getStyle()
      let style2 = this.controlLanguage.setLanguage(style, val)
      this.mapBoxMap.setStyle(style2)
    },
    // 地图样式切换
    mapStyleChange (val) {
      this.mapBoxMap.setStyle(val)
      this.changeObj(this.devicesList)
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
#shMap{
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
