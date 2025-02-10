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
import imgUrl from '@/assets/images/imgUrl.jpg'
echarts.registerTheme('tdTheme', tdTheme)
//   mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
export default {
  name: 'hsMap',
  props: ['selcjyData', 'language', 'mapstyle'],
  data () {
    return {
      dom: null,
      controlLanguage: null, // 动态切换语言
      imgUrl
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
      this.initBasicMap(this.selcjyData)
    })
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initBasicMap (row) {
      let that = this
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      var option = {
        tooltip: {
          trigger: 'item'
        },
        mapbox: {
          center: [row.longitude * 1, row.latitude * 1],
          zoom: 8,
          style: that.mapstyle,
          pitch: 60,
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
        that.changeObj([row])
      })
    },
    // 调整为geojson
    changeObj (data) {
      let geojson1 = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      }
      for (let i in data) {
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [data[i].longitude * 1, data[i].latitude * 1]
          },
          properties: data[i]
        }
        geojson1.features.push(obj)
      }
      this.initMaker(geojson1)
    },
    // 生成点标记
    initMaker (data1) {
      let that = this
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
              'icon-size': 1,
              'text-field': ['get', 'type'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            },
            'paint': {
              'text-color': '#202',
              'text-halo-color': '#fff',
              'text-halo-width': 2
            }
          })
        }
      )
      var popup = new mapboxgl.Popup({
        offset: 25
      })
      that.mapBoxMap.on('click', 'markerLayer', function (e) {
        // let res = JSON.parse(e.features[0].properties.direction_ns).join("，")
        let center = [e.features[0].properties.longitude * 1, e.features[0].properties.latitude * 1]
        that.mapBoxMap.flyTo({ center, zoom: 18, pitch: 50 })
        let divBox = `<div class="popupBox">
                        <div class="title1">${e.features[0].properties.type ? e.features[0].properties.type : 'TMA-63W'}</div>
                        <img src="${that.imgUrl}" alt="">
                    </div>`
        setTimeout(() => {
          popup
            .setLngLat(center)
            .setHTML(divBox)
            .addTo(that.mapBoxMap)
        }, 2000)

        // let ob = document.getElementById('btnHand');
        // ob.onclick=that.handelClick()
        // <div class="text">设备名称：${e.features[0].properties.loctime_devices}</div>
      })
      popup.on('close', function (e) {
        that.mapBoxMap.flyTo({ zoom: 14, pitch: 60 })
      })
      // this.mapBoxMap.flyTo({ zoom: 13, pitch: 50 })
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
    },
    parentUpdate (row) {
      this.dom.clear()
      this.mapBoxMap = null
      this.initBasicMap(row)
    },
    // 添加弹窗
    initPopup (info) {
      let that = this
      that.mapBoxMap.flyTo({ center: [info.longitude * 1, info.latitude * 1] })
      const size = 200
      if (that.mapBoxMap.getLayer('curPoint')) {
        this.mapBoxMap.removeLayer('curPoint')
        this.mapBoxMap.removeSource('dot-point')
        this.mapBoxMap.removeImage('pulsing-dot')
      }
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd: function () {
          const canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          this.context = canvas.getContext('2d')
        },
        render: function () {
          const duration = 1000
          const t = (performance.now() % duration) / duration
          const radius = (size / 2) * 0.3
          const outerRadius = (size / 2) * 0.7 * t + radius
          const context = this.context
          context.clearRect(0, 0, this.width, this.height)
          context.beginPath()
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          )
          context.fillStyle = `rgba(255, 200, 200, ${1 - t})`
          context.fill()

          // Draw the inner circle.
          context.beginPath()
          context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          )
          context.fillStyle = 'rgba(255, 100, 100, 1)'
          context.strokeStyle = 'white'
          context.lineWidth = 2 + 4 * (1 - t)
          context.fill()
          context.stroke()
          this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
          ).data
          that.mapBoxMap.triggerRepaint()
          return true
        }
      }
      that.mapBoxMap.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })

      that.mapBoxMap.addSource('dot-point', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [info.longitude * 1, info.latitude * 1] // icon position [lng, lat]
              }
            }
          ]
        }
      })
      that.mapBoxMap.addLayer({
        'id': 'curPoint',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      })
      that.mapBoxMap.on('click', 'curPoint', (e) => {
        that.mapBoxMap.flyTo({ zoom: 14 })
      })
      setTimeout(() => {
        popup.remove()
        // setTimeout(()=>{
        that.$emit('getEewsinfo')
        // },30000)
      }, 1000 * 60 * 60 * 24)
    },
    // 更新marker
    updateMarker (center) {
      let that = this
      if (that.mapBoxMap.getLayer('markerLayer')) {
        that.mapBoxMap.removeLayer('markerLayer')
        that.mapBoxMap.removeSource('markerData')
        that.mapBoxMap.flyTo({ center: center, zoom: 3, pitch: 0 })
      }
    },
    // 更新点数据
    updatePoint (data) {
      let that = this
      if (that.mapBoxMap.getLayer('curData-layer')) {
        that.mapBoxMap.getSource('curData').setData(data)
        if (that.mapBoxMap.getLayer('layer-with-pulsing-dot') && that.mapBoxMap.getLayer('curData-layer')) {
          that.mapBoxMap.moveLayer('curData-layer', 'layer-with-pulsing-dot')
        }
        return
      }
      that.mapBoxMap.addSource('curData', {
        type: 'geojson',
        data: data,
        cluster: true,
        clusterMaxZoom: 15, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      })
      that.mapBoxMap.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'curData',
        filter: ['has', 'point_count'],
        'paint': {
          //* 蓝色，当点数小于100时为20px圆
          //* 点计数在100到750之间时为黄色，21px圆
          //* 点计数大于或等于750时为22像素的粉红色圆圈
          'circle-color': [
            'step',
            ['get', 'point_count'],
            'rgba(81, 187, 214, 0.8)',
            100,
            'rgba(241, 240, 117, 0.8)',
            750,
            'rgba(242, 140, 177, 0.8)'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20, // 蓝色，当点数小于100时为20px圆
            100, // 对应上面circle-color 数字，意思为100以内
            21, // 点计数在100到750之间时为黄色，21px圆
            750, // 对应上面circle-color 数字，意思为750以内
            22 // 点计数大于或等于750时为22像素的粉红色圆圈
          ],
          // 这个是外边框的颜色 circle-stroke-color这个对应了上面circle-color
          'circle-stroke-color': [
            'step',
            ['get', 'point_count'],
            'rgba(81, 187, 214, 0.2)',
            100,
            'rgba(241, 240, 117, 0.2)',
            750,
            'rgba(242, 140, 177, 0.2)'
          ],
          // 这个是外边框晕染的范围
          'circle-stroke-width': [
            'step',
            ['get', 'point_count'],
            5, // 蓝色晕染长度，当点数小于100时为5px晕染
            100, // 对应上面circle-color 数字，意思为100以内
            6, // 点计数在100到750之间时为黄色，6px晕染
            750, // 对应上面circle-color 数字，意思为750以内
            7 // 点计数大于或等于750时为7px像素的粉红色晕染
          ]
        }
      })
      that.mapBoxMap.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'curData',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        // 添加这个就可以改变圆圈内字样式，这里我改变了他的颜色
        paint: {
          'text-color': '#000',
          'text-opacity': 1
        }
      })
      that.mapBoxMap.addLayer({
        id: 'curData-layer',
        type: 'circle',
        source: 'curData',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 4,
          // 'circle-stroke-width': 1,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
        }
      })

      var hoveredStateId = null
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })
      that.mapBoxMap.on('mousemove', 'curData-layer', function (e) {
        if (e.features.length > 0) {
          if (hoveredStateId) {
            that.mapBoxMap.setFeatureState(
              { source: 'curData', id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = e.features[0].layer.id
          that.mapBoxMap.setFeatureState(
            { source: 'curData', id: hoveredStateId },
            { hover: true }
          )
        }
        if (e.features[0].properties.place) {
          popup
            .setLngLat(e.lngLat)
          // .setHTML(e.features[0].properties.wheatNum_2017)
            .setHTML(
              `<h4 style='text-align:center;line-height: 28px'>${e.features[0].properties.place}</h4>
                            <p>经纬度:${e.lngLat}</p>
                            <p>深度:${e.features[0].properties.mag}</p>
                            <p>震级:${e.features[0].properties.mag}</p>
                            <p>事件编号:${e.features[0].properties.ids}</p>`
            )
            .addTo(that.mapBoxMap)
        }
      })
      that.mapBoxMap.on('mouseleave', 'curData-layer', function (e) {
        that.mapBoxMap.getCanvas().style.cursor = ''
        if (hoveredStateId) {
          that.mapBoxMap.setFeatureState(
            { source: 'curData', id: hoveredStateId },
            { hover: false }
          )
        }
        hoveredStateId = null
        popup.remove()
      })
      if (that.mapBoxMap.getLayer('layer-with-pulsing-dot') && that.mapBoxMap.getLayer('curData-layer')) {
        that.mapBoxMap.moveLayer('curData-layer', 'layer-with-pulsing-dot')
      }

      that.mapBoxMap.on('click', 'clusters', (e) => {
        const features = that.mapBoxMap.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        })
        const clusterId = features[0].properties.cluster_id
        that.mapBoxMap.getSource('curData').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return

            that.mapBoxMap.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          }
        )
      })
      that.mapBoxMap.on('mouseenter', 'clusters', () => {
        that.mapBoxMap.getCanvas().style.cursor = 'pointer'
      })
      that.mapBoxMap.on('mouseleave', 'clusters', () => {
        that.mapBoxMap.getCanvas().style.cursor = ''
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
#shMap{
    width: 100%;
    height: 100%;
    .mapboxgl-map * {
        max-width: none !important;
    }
    .mapboxgl-ctrl-bottom-left{
        display: none;
    }
    .mapboxgl-popup-content{
        background: rgba(32, 66, 122, 0.55);
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
        width: 300px;
        height: 200px;
        .title1{
            font-size: 14px;
            color: #fff;
        }
        img{
            width: 100%;
            height: 185px;
        }
    }
}
.popupYJBox{
    position: relative;
    width: 100%;
}
.popupyj1{
    position: absolute;
    z-index: 1;
    border-radius: 4px;
}
.popupyj{
    position: relative;
    border-radius: 4px;
    z-index: 100;
    // top: 0;
    // left: 0;
    width: 100%;
    animation: downMove 3s infinite;
    -webkit-animation: downMove 3s infinite;
}
@keyframes downMove{
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}
</style>
