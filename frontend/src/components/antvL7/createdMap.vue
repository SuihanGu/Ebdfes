<template>
    <div style="position: relative;width: 100%;height:100%;" id="createdMap">
        <div ref="dom" class="charts chart-bar" id="meteMap" style="width: 100%;height:100%;"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import { createGeoJSONCircle } from '@/untils/createGeoJSON'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'hsMap',
  props: ['pointCenter', 'pointData', 'width'],
  data () {
    return {
      dom: null,
      layerAct: 0,
      pointBox: {
        name: '点',
        type: 'scatter3D',
        coordinateSystem: 'mapbox',
        symbol: 'pin',
        symbolSize: 30,
        label: {},
        itemStyle: {
          normal: {
            color: '#F62157' // 标志颜色
          }
        },
        emphasis: {
          scale: true
        },
        // zlevel: 10,
        data: null
      },
      mapBoxMap: null,
      allpointData: [],
      marker1: null,
      mapType: ''
    }
  },
  watch: {
    pointData (cur, old) {
      this.allpointData = this.allpointData.concat(cur)
      // if (this.dom == null) {
      //     this.initBasicMap()
      // } else {
      this.upDatePoint(cur)
      // }
    },
    width (cur, old) {
      if (this.dom != null) {
        this.dom.resize()
      }
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
      let mapData = [that.pointBox]
      // for(let i in that.pointData){
      //     that.pointData[i].value.push(2000)
      //     that.pointData[i].value.push(i)
      // }
      // that.pointBox.data = that.pointData
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      var option = {
        mapbox: {
          center: that.pointCenter,
          zoom: 2,
          pitch: 0,
          style: 'mapbox://styles/laijianying/cla0hpibz000114jos5h37n6l',
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
          zlevel: 1
        },
        tooltip: {
          trigger: 'item'
        },
        series: mapData
      }
      that.dom = echarts.init(that.$refs.dom, 'tdTheme')
      that.dom.setOption(option)
      on(window, 'resize', that.resize)
      that.resize()
      that.mapBoxMap = that.dom
        .getModel()
        .getComponent('mapbox3D')
        .getMapbox()
      that.mapBoxMap.on('load', () => {
      })
    },
    // 打点更新
    upDatePoint (data) {
      let that = this
      that.resize()
      let info = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      }
      for (let i in data) {
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [data[i].longitude, data[i].latitude]
          },
          properties: data[i]
        }
        info.features.push(obj)
      }
      if (that.mapBoxMap.getLayer('curData-layer')) {
        that.mapBoxMap.getSource('curData').setData(info)
      } else {
        that.mapBoxMap.addSource('curData', {
          type: 'geojson',
          data: info,
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
              'rgba(255, 0, 0,0.85)',
              100,
              'rgba(255, 0, 0,0.85)',
              750,
              'rgba(255, 0, 0,0.85)'
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
              'rgba(255, 0, 0,0.45)',
              100,
              'rgba(255, 0, 0,0.45)',
              750,
              'rgba(255, 0, 0,0.45)'
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
            'text-font': ['Arial Unicode MS Bold', 'Arial Unicode MS Bold'],
            'text-size': 16
          },
          // 添加这个就可以改变圆圈内字样式，这里我改变了他的颜色
          paint: {
            'text-color': '#fff',
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
            'circle-stroke-width': 1,
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
          if (e.features[0].properties.locid) {
            popup
              .setLngLat(e.lngLat)
            // .setHTML(e.features[0].properties.wheatNum_2017)
            // <h4 style='text-align:center;line-height: 28px'>${e.features[0].properties.locid}</h4>
              .setHTML(
                `<p>locid:${e.features[0].properties.locid}</p>
                                <p>gridid:${e.features[0].properties.gridid}</p>
                                <p>经纬度:${e.features[0].properties.longitude}，${e.features[0].properties.latitude}</p>`
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
      let center = [data[0].longitude, data[0].latitude]
      that.mapBoxMap.flyTo({ center, zoom: 9 })
    },
    // 定位事件点
    initPopup (center) {
      let that = this
      that.resize()
      that.mapBoxMap.flyTo({ center: center, zoom: 7 })
      const size = 200
      if (that.mapBoxMap.getLayer('curPoint')) {
        that.mapBoxMap.removeLayer('curPoint')
        that.mapBoxMap.removeSource('dot-point')
        that.mapBoxMap.removeImage('pulsing-dot')
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
                'coordinates': center // icon position [lng, lat]
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
    },
    // 绘制tf路线
    // 获取台风数据
    getTFData (data, type, tfType) {
      if (type != 'importall') {
        for (let i in data) {
          switch (type) {
            case 'point':
              this.changePointObj(data[i], tfType, type) // 打点
              this.changeLineObj2(data[i].data)
              break
            case 'line':
              this.changeLineObj(data[i], tfType) // 线
              break
            case 'windField':
              this.changePointObj(data[i], tfType, type) // 热力图和点一样的geojson
              break
          }
        }
      } else {
        let info = {
          data
        }
        this.changePointObj(info, tfType, type) // 热力图和点一样的geojson
      }
    },
    // 动态调整tf路线点数据结构
    changePointObj (info, tfType, type) {
      let list = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      }
      for (let i in info.data) {
        let center = []
        if (tfType == 1) {
          center = [Number(info.data[i].longitude), Number(info.data[i].latitude)]
        } else {
          center = [Number(info.data[i].LON), Number(info.data[i].LAT)]
        }
        info.data[i].SID = info.SID
        info.data[i].speed = Number(info.data[i].speed)
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: info.data[i]
        }
        list.features.push(obj)
      }
      if (type == 'point') {
        this.upDateTFPoint(info.SID, list, tfType)
      } else if (type == 'windField') {
        this.upDatetfHeatMap(list, info.SID, 'vmax')
      }
    },
    upDateTFPoint (typeName, data, tfType) {
      let that = this
      let fieldName = 'speed'
      if (tfType == 0) {
        fieldName = 'STORM_SPEED'
      }
      if (that.mapBoxMap.getLayer('point' + typeName)) {
        that.mapBoxMap.getSource('pd' + typeName).setData(data)
        return
      }
      that.mapBoxMap.addSource('pd' + typeName, {
        'type': 'geojson',
        'data': data
      })
      that.mapBoxMap.addLayer({
        id: 'point' + typeName,
        'type': 'circle',
        'source': 'pd' + typeName,
        'paint': {
          // step <=5, 5-10, >10
          'circle-color': [
            'step',
            ['to-number', ['get', fieldName]],
            '#01FFD2', 5,
            '#05E4DF', 10,
            '#05C2E4', 15,
            '#0589E4', 20,
            '#0464D2', 25,
            '#044AD2', 30,
            '#042AD2'
          ],
          'circle-radius': {
            stops: [ // 重点
              [0, 0],
              [1, 3]
            ],
            base: 2
          }
          // 'circle-radius': 5,
          // 'circle-stroke-width': 1,
          // 'circle-stroke-color': '#fff'
        }
      })
      let type = 'point' + typeName
      var hoveredStateId = null
      var popup = new mapboxgl.Popup({
        offset: 5,
        closeButton: false,
        closeOnClick: false
      })
      that.mapBoxMap.on('mousemove', type, function (e) {
        // that.mapBoxMap.setPaintProperty(type, 'circle-radius', 10);
        if (e.features.length > 0) {
          if (hoveredStateId) {
            that.mapBoxMap.setFeatureState(
              { source: 'pd' + typeName, id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = e.features[0].layer.id
          that.mapBoxMap.setFeatureState(
            { source: 'pd' + typeName, id: hoveredStateId },
            { hover: true }
          )
        }
        if (e.features[0].properties.SID) {
          let content = ''
          if (e.features[0].properties.eventid != undefined) {
            content = `<h4 style="text-align:center;line-height: 28px;border-bottom:1px solid #ccc;">台风信息</h4>
                            <p style="margin-top:3px;">台风编号:${e.features[0].properties.SID}</p>
                            <p>最大风速:${e.features[0].properties.speed} m/s</p>
                            <p>最小气压:${e.features[0].properties.centralpressure} hPa</p>
                            <p>最大风半径:${e.features[0].properties.rmax} km</p>`
          } else {
            content = `<h4 style="text-align:center;line-height: 28px;border-bottom:1px solid #ccc;">台风信息</h4>
                            <p style="margin-top:3px;">台风编号:${e.features[0].properties.SID}</p>
                            <p>台风名称:${e.features[0].properties.NAME}</p>
                            <p>时间:${e.features[0].properties.ISO_TIME}</p>
                            <p>STORM_SPEED:${e.features[0].properties.STORM_SPEED}</p>`
          }
          popup
            .setLngLat(e.lngLat)
          // .setHTML(e.features[0].properties.wheatNum_2017)
          // <h4 style='text-align:center;line-height: 28px'>${e.features[0].properties.locid}</h4>
            .setHTML(content)
            .addTo(that.mapBoxMap)
        }
      })
      that.mapBoxMap.on('mouseleave', type, function (e) {
        if (hoveredStateId) {
          that.mapBoxMap.setFeatureState(
            { source: 'pd' + typeName, id: hoveredStateId },
            { hover: false }
          )
        }
        // that.mapBoxMap.setPaintProperty(type, 'circle-radius', 6);
        hoveredStateId = null
        popup.remove()
      })
    },
    // 动态调整tf风场点数据结构
    changeWindFieldObj (info, tfType) {
      let list = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      }
      for (let i in info.data) {
        let center = []
        if (tfType == 1) {
          center = [Number(info.data[i].longitude), Number(info.data[i].latitude)]
        } else {
          center = [Number(info.data[i].LON), Number(info.data[i].LAT)]
        }
        // info.data[i].SID=info.SID
        // let obj={
        //     type: 'Feature',
        //     geometry: {
        //         type: 'Point',
        //         coordinates: center
        //     },
        //     properties: info.data[i]
        // }
        // list.features.push(obj)
        this.upDateTFWindField(info.SID, i, center, Number(info.data[i].rmax) * 5, info.data[i])
      }
    },
    upDateTFWindField (typeName, i, center, len, geodata) {
      let that = this
      let geojson = null
      if (that.mapBoxMap.getLayer('wf' + typeName + i)) {
        geojson = createGeoJSONCircle(center, len)
        geojson.properties = geodata
        that.mapBoxMap.getSource('wfd' + typeName + i).setData(geojson)
        return
      }
      let data = {
        'type': 'FeatureCollection',
        'features': []
      }
      that.mapBoxMap.addSource('wfd' + typeName + i, {
        'type': 'geojson',
        'data': data
      })
      that.mapBoxMap.addLayer({
        id: 'wf' + typeName + i,
        'type': 'fill',
        'source': 'wfd' + typeName + i,
        'layout': {
				 },
        'paint': {
          'fill-color': '#74C105',
          'fill-opacity': 0.6
        }
      }, that.mapBoxMap.getLayer('point' + typeName) ? 'point' + typeName : '')
      geojson = createGeoJSONCircle(center, len)
      geojson.properties = geodata
      that.mapBoxMap.getSource('wfd' + typeName + i).setData(geojson)
    },
    // 动态调整tf路线数据结构
    changeLineObj (info, tfType) {
      let coord = []
      for (let i in info.data) {
        let center = []
        if (tfType == 1) {
          center = [Number(info.data[i].longitude), Number(info.data[i].latitude)]
        } else {
          center = [Number(info.data[i].LON), Number(info.data[i].LAT)]
        }
        info.data[i].SID = info.SID
        coord.push(center)
      }
      let list = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': info,
            'geometry': {
              'type': 'LineString',
              'coordinates': coord
            }
          }
        ]
      }
      this.upDateTFLine(info.SID, list, tfType)
    },
    upDateTFLine (typeName, data, tfType) {
      let that = this
      if (that.mapBoxMap.getLayer('line' + typeName)) {
        that.mapBoxMap.getSource('ld' + typeName).setData(data)
        return
      }
      that.mapBoxMap.addSource('ld' + typeName, {
        'type': 'geojson',
        'data': data
      })
      that.mapBoxMap.addLayer({
        id: 'line' + typeName,
        'type': 'line',
        'source': 'ld' + typeName,
        'paint': {
          'line-width': 2,
          // 'line-color': ['get', 'color']
          'line-color': '#2b85e4'
        }
      })
      let type = 'line' + typeName
      var hoveredStateId = null
      var popup = new mapboxgl.Popup({
        offset: 5
      })
      that.mapBoxMap.on('mousemove', type, function (e) {
        that.mapBoxMap.setPaintProperty(type, 'line-color', 'red')
        that.mapBoxMap.setPaintProperty(type, 'line-width', 10)
      })
      that.mapBoxMap.on('mouseleave', type, function (e) {
        that.mapBoxMap.setPaintProperty(type, 'line-color', '#2b85e4')
        that.mapBoxMap.setPaintProperty(type, 'line-width', 2)
      })
      that.mapBoxMap.on('click', type, (e) => {
        if (e.features[0].properties.SID) {
          let content = ''
          if (e.features[0].properties.eventid != undefined) {
            content = `<h4 style="text-align:center;line-height: 28px;border-bottom:1px solid #ccc;">台风信息</h4>
                            <p style="margin-top:3px;">台风编号:${e.features[0].properties.SID}</p>
                            <p>当前移动速度:${e.features[0].properties.speed} km/h</p>
                            <p>当前气压:${e.features[0].properties.centralpressure} hPa</p>
                            <p>最大风半径:${e.features[0].properties.rmax} km</p>`
          } else {
            content = `<h4 style="text-align:center;line-height: 28px;border-bottom:1px solid #ccc;">台风信息</h4>
                            <p style="margin-top:3px;">台风编号:${e.features[0].properties.SID}</p>
                            <p>台风名称:${e.features[0].properties.NAME}</p>
                            <p>时间:${e.features[0].properties.ISO_TIME}</p>
                            <p>STORM_SPEED:${e.features[0].properties.STORM_SPEED}</p>`
          }
          popup
            .setLngLat(e.lngLat)
          // .setHTML(e.features[0].properties.wheatNum_2017)
          // <h4 style='text-align:center;line-height: 28px'>${e.features[0].properties.locid}</h4>
            .setHTML(content)
            .addTo(that.mapBoxMap)
        }
      })
    },
    // 动态调整tf重现期数据结构
    changetfHeatObj (info, typeName, type) {
      let list = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: info
      }
      // for(let i in info){
      //     let obj={
      //         type: 'Feature',
      //         geometry: {
      //             type: 'Point',
      //             coordinates: [Number(info[i].lon),Number(info[i].lat)]
      //         },
      //         properties: {
      //             [type]:Number(info[i][type])
      //         }
      //     }
      //     list.features.push(obj)
      // }
      this.upDatetfHeatMap(list, typeName, type)
    },
    // 绘制重现期热力图
    upDatetfHeatMap (data, typeName, type) {
      let that = this
      if (that.mapBoxMap.getLayer('wfh' + typeName)) {
        that.mapBoxMap.getSource('wfd' + typeName).setData(data)
        return
      }
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
              3000, 0.5
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
              0, 'rgba(0,0,0,0)',
              0.2, 'rgba(25,70,150, .7)',
              0.4, 'rgba(60,160,70, .7)',
              0.6, 'rgba(250,230,30, .8)',
              0.8, 'rgba(250,130,45, .9)',
              1, 'rgba(255,36,36, .9)'
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
      that.mapBoxMap.flyTo({ center: data.features[0].geometry.coordinates, zoom: 3.5 })
    },
    // 动态修改图层样式
    modifyLayer (data, type, val) {
      // that.mapBoxMap.setPaintProperty(type, 'line-width', 2);
      for (let i in data) {
        if (this.mapBoxMap.getLayer('point' + data[i].SID)) {
          this.mapBoxMap.setPaintProperty('point' + data[i].SID, type, val)
        }
      }
    },
    // 动态调整块结构
    changetfPolygonobj (data) {
      let list = {
        type: 'FeatureCollection',
        features: []
      }
      for (let i in data) {
        let center = []
        center = [Number(data[i].longitude), Number(data[i].latitude)]

        data[i].speed = Number(info.data[i].speed)
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: center
          },
          properties: data[i]
        }
        list.features.push(obj)
      }
    },
    // 绘制台风影响场
    upDateImport (data) {
      let that = this

      that.dom.setOption({
        visualMap: {
          max: 120,
          calculable: true,
          realtime: false,
          outOfRange: {
            colorAlpha: 0
          },
          inRange: {
            color: [
              '#ffffff',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026'
            ]
          }
        },
        series: [
          {
            type: 'bar3D',
            shading: 'realistic',
            coordinateSystem: 'mapbox',
            data: [],
            barSize: 0.35,
            itemStyle: {
              color: 'orange'
            }
          }
        ]
      })
    },
    // 生成台风轨迹路线数据结构
    changeLineObj2 (data) {
      let list = {
        'type': 'FeatureCollection',
        'features': []
      }
      let center = []
      for (let i in data) {
        // step <=5, 5-10, >10
        if (data[i].speed * 1 <= 5) {
          center = this.dynamicline('#01FFD2', center, data, i)
        } else if (data[i].speed * 1>5 && data[i].speed * 1 <= 10) {
          center = this.dynamicline('#05E4DF', center, data, i)
        } else if (data[i].speed * 1>10 && data[i].speed * 1 <= 15) {
          center = this.dynamicline('#05C2E4', center, data, i)
        } else if (data[i].speed * 1>15 && data[i].speed * 1 <= 20) {
          center = this.dynamicline('#0589E4', center, data, i)
        } else if (data[i].speed * 1>20 && data[i].speed * 1 <= 25) {
          center = this.dynamicline('#0464D2', center, data, i)
        } else if (data[i].speed * 1>25 && data[i].speed * 1 <= 30) {
          center = this.dynamicline('#044AD2', center, data, i)
        } else if (data[i].speed * 1>30) {
          center = this.dynamicline('#042AD2', center, data, i)
        }
      }
      list.features = center
      this.upDateTFLine2(list)
    },
    // 动态拆分线段
    dynamicline (color, center, data, i) {
      i = i * 1
      let arr = center.filter(item => item.properties.color == color)
      if (arr.length == 0) {
        let arrc = [
          [Number(data[i].longitude), Number(data[i].latitude)],
          [Number(data[i + 1].longitude), Number(data[i + 1].latitude)]
        ]
        if (i != 0) {
          arrc.unshift([Number(data[i - 1].longitude), Number(data[i - 1].latitude)])
        }
        center.push({
          type: 'Feature',
          properties: {
            color: color
          },
          geometry: {
            type: 'LineString',
            coordinates: arrc
          }
        })
      } else {
        if (center[center.length - 1].properties.color == color) {
          let arr2 = center[center.length - 1].geometry.coordinates.filter(item => item.longitude == data[i].longitude * 1 && item.latitude == data[i].latitude * 1)
          if (arr2.length == 0) {
            center[center.length - 1].geometry.coordinates.push([Number(data[i].longitude), Number(data[i].latitude)])
          }
        } else {
          center.push({
            type: 'Feature',
            properties: {
              color: color
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [Number(data[i - 1].longitude), Number(data[i - 1].latitude)],
                [Number(data[i].longitude), Number(data[i].latitude)]
              ]
            }
          })
        }
      }
      return center
    },
    // 生成台风轨迹路线
    upDateTFLine2 (data) {
      let that = this
      if (that.mapBoxMap.getLayer('lineslayer')) {
        that.mapBoxMap.getSource('linesData').setData(data)
        return
      }
      that.mapBoxMap.addSource('linesData', {
        'type': 'geojson',
        'data': data
      })
      that.mapBoxMap.addLayer({
        'id': 'lineslayer',
        'type': 'line',
        'source': 'linesData',
        'paint': {
          'line-width': 2,
          'line-color': ['get', 'color']
        }
      })
      // that.mapBoxMap.moveLayer('lineslayer', 'points')
    },
    // 清除图层
    clearLayer (data, type) {
      for (let i in data) {
        switch (type) {
          case 'point':
            if (this.mapBoxMap.getLayer('point' + data[i].SID)) {
              this.mapBoxMap.removeLayer('point' + data[i].SID)
              this.mapBoxMap.removeSource('pd' + data[i].SID)
            }
            break
          case 'line':
            if (this.mapBoxMap.getLayer('line' + data[i].SID)) {
              this.mapBoxMap.removeLayer('line' + data[i].SID)
              this.mapBoxMap.removeSource('ld' + data[i].SID)
            }
            break
          case 'windField':
            if (this.mapBoxMap.getLayer('wfh' + data[i].SID)) {
              this.mapBoxMap.removeLayer('wfh' + data[i].SID)
              this.mapBoxMap.removeSource('wfd' + data[i].SID)
            }
            break
        }
      }
    },
    clearheatLayer (type) {
      if (this.mapBoxMap.getLayer('Layer' + type)) {
        this.mapBoxMap.removeLayer('Layer' + type)
        this.mapBoxMap.removeSource('Data' + type)
      }
    },
    // 地图区域选择绘制图形
    // 矩形
    rectangleMap () {
      let that = this
      that.mapBoxMap.getCanvas().style.cursor = 'crosshair'
      that.clearLayerAndSource()
      var isDraw = true
      that.mapType = 'rectangle'
      // 禁止双击缩放
      that.mapBoxMap.doubleClickZoom.disable()
      var jsonPoint = {
        'type': 'FeatureCollection',
        'features': []
      }
      jsonPoint.features = []
      var source = that.mapBoxMap.getSource('rectangle')
      if (source) {
        that.mapBoxMap.getSource('rectangle').setData(jsonPoint)
      } else {
        that.mapBoxMap.addSource('rectangle', {
          type: 'geojson',
          data: jsonPoint
        })
        that.mapBoxMap.addLayer({
          'id': 'rectangle',
          'type': 'fill',
          'source': 'rectangle',
          'layout': {},
          'paint': {
            'fill-color': '#fff',
            'fill-opacity': 0.36
          }
        })
        that.mapBoxMap.addLayer({
          id: 'line-rectangle',
          type: 'line',
          source: 'rectangle',
          paint: {
            'line-color': '#ff0000',
            'line-width': 1,
            'line-opacity': 0.65
          }
        })
      }
      var starCoords = []
      let isMousemove = false
      let startOrend = false
      var moveCoords = []
      that.mapBoxMap.on('click', function (_e) {
        if (that.mapType == 'rectangle') {
          if (!startOrend) {
            if (isDraw) {
              starCoords = [_e.lngLat.lng, _e.lngLat.lat]
              isMousemove = true
              startOrend = true
            }
          } else {
            if (isDraw) {
              isMousemove = false
              isDraw = false
              that.mapBoxMap.getCanvas().style.cursor = 'grab'
              var endCoords = [_e.lngLat.lng, _e.lngLat.lat]
              var rightTopCoords = []
              rightTopCoords = [endCoords[0], starCoords[1]]
              var buttomLeftCoords = []
              buttomLeftCoords = [starCoords[0], endCoords[1]]

              var coords = []
              coords = [starCoords, rightTopCoords, endCoords, buttomLeftCoords]
              jsonPoint.features.push({
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: coords
                }
              })
              that.mapBoxMap.getSource('rectangle').setData(jsonPoint)
              let lng11 = endCoords[0] - (endCoords[0] - starCoords[0]) / 2
              let lat11 = starCoords[1] - (starCoords[1] - endCoords[1]) / 2
              var range = that.mapBoxMap.getZoom()
              if (range !== 21) {
                range = range + 1
              }
              that.mapBoxMap.flyTo({ center: [lng11, lat11], zoom: range })
              that.mapType = ''
              let pointlist = [
                starCoords[1] >= endCoords[1] ? starCoords[1] : endCoords[1],
                starCoords[1]<endCoords[1] ? starCoords[1] : endCoords[1],
                starCoords[0] >= endCoords[0] ? starCoords[0] : endCoords[0],
                starCoords[0]<endCoords[0] ? starCoords[0] : endCoords[0]
              ]
              that.$emit('searchTable', 'tf', pointlist)
            }
          }
        }
      })
      that.mapBoxMap.on('mousemove', function (_e) {
        if (isDraw && isMousemove) {
          moveCoords = [_e.lngLat.lng, _e.lngLat.lat]
          var rightTopCoords = []
          rightTopCoords = [moveCoords[0], starCoords[1]]
          var buttomLeftCoords = []
          buttomLeftCoords = [starCoords[0], moveCoords[1]]
          var coords = []
          coords = [starCoords, rightTopCoords, moveCoords, buttomLeftCoords]
          jsonPoint.features = []
          jsonPoint.features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coords]
            }
          })
          that.mapBoxMap.getSource('rectangle').setData(jsonPoint)
        }
      })
    },
    // 圆形
    pointMap () {
      let that = this
      that.mapType = 'point'
      that.clearLayerAndSource()
      var isDraw = true
      // 禁止双击缩放
      that.mapBoxMap.doubleClickZoom.disable()
      that.mapBoxMap.on('click', function (_e) {
        if (that.mapType == 'point') {
          if (isDraw) {
            that.mapBoxMap.getCanvas().style.cursor = 'grab'
            isDraw = false
            var endCoords = [_e.lngLat.lng, _e.lngLat.lat]
            that.marker1 = new mapboxgl.Marker().setLngLat(endCoords).addTo(that.mapBoxMap)
            var range = that.mapBoxMap.getZoom()
            if (range !== 21) {
              range = range + 1
            }
            that.mapBoxMap.flyTo({ center: endCoords, zoom: range })
            that.mapType = ''
            that.$emit('searchTable', 'tf', endCoords)
          }
        }
      })

      that.mapBoxMap.on('dblclick', function (_e) {

      })

      // that.mapBoxMap.on("click", function(_e) {
      //     if (that.marker1!=null) {
      //         that.marker1.remove()
      //         that.marker1=null
      //     }
      //     if(that.mapType=='point'){
      //         let center = [_e.lngLat.lng.toFixed(3)*1, _e.lngLat.lat.toFixed(3)*1]
      //         that.marker1 = new mapboxgl.Marker().setLngLat(center).addTo(that.mapBoxMap);
      //         var range = that.mapBoxMap.getZoom();
      //         if(range!==21){
      //             range=range+3
      //         }
      //         that.mapBoxMap.flyTo({ center, zoom: range})
      //         that.mapType=''
      //         that.$emit('searchTable','tf',center)
      //     }

      // });
    },
    // 清除绘制的图形和区域
    clearLayerAndSource () {
      let that = this
      if (that.marker1 != null) {
        that.marker1.remove()
        that.marker1 = null
      }
      if (that.mapBoxMap.getLayer('points')) {
        that.mapBoxMap.removeLayer('points')
      }
      if (that.mapBoxMap.getSource('points')) {
        that.mapBoxMap.removeSource('points')
      }
      if (that.mapBoxMap.getLayer('rectangle')) {
        that.mapBoxMap.removeLayer('rectangle')
        that.mapBoxMap.removeLayer('line-rectangle')
      }
      if (that.mapBoxMap.getSource('rectangle')) {
        that.mapBoxMap.removeSource('rectangle')
      }
      if (that.mapBoxMap.getLayer('pointimportall')) {
        that.mapBoxMap.removeLayer('pointimportall')
        that.mapBoxMap.removeSource('pdimportall')
      }
      if (that.mapBoxMap.getLayer('lineslayer')) {
        that.mapBoxMap.removeLayer('lineslayer')
        that.mapBoxMap.removeSource('linesData')
      }
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
  <style lang="less">
    #createdMap{
        .mapboxgl-popup {
            color: #fff;
            max-width: 300px !important;
        }
        .mapboxgl-popup-content {
            text-align: left;
            font-family: 'Open Sans', sans-serif;
            background: rgba(0, 0, 0,.65);
            // box-shadow: rgb(174, 174, 174) 0px 0px 10px;
            color: #fff !important;
            padding: 5px;
        }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
        .mapboxgl-popup-tip,
        .mapboxgl-popup-close-button{
            display: none;
        }
    }
  </style>
