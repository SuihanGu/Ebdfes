<template>
    <div style="position: relative;" id="hsMap2">
        <div class="inpubox" style="position: absolute;top:70px;left:27%;z-index: 1000;">
            <div id='geocoder' class='geocoder'></div>
        </div>
        <div ref="dom" class="charts chart-bar" style="width: 100%;height:100%;"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import * as turf from '@turf/turf'
import { compare } from '@/untils/untilsPublic'
import { } from '@/api/data'
echarts.registerTheme('tdTheme', tdTheme)

let hoveredStateId = null
export default {
  name: 'hsMap',
  props: ['pointCenter', 'language', 'mapstyle', 'geoJsonType'],
  data () {
    return {
      dom: null,
      controlLanguage: null, // 动态切换语言
      color1: [
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026'
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
      ],
      buildType: {
        key: '',
        label: ''
      },
      activePlonPac: '',// 选中块的pac
      popupBox:null,
    }
  },
  watch: {
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
        that.$emit('getTimeList')
        that.popupBox = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })
      })
    },
    // 动态调整tf数据结构
    changePointObj2 (data, typeName, type, maptype, num) {
      let list = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      }
      let center = []
      data = data.sort(compare(type, false))
      let max = data[0][type], min = data[data.length - 1][type]
      for (let i in data) {
        if (data[i].longitude) {
          center = [Number(data[i].longitude), Number(data[i].latitude)]
        } else {
          center = [Number(data[i].lon), Number(data[i].lat)]
        }
        if (data[i].gustspeed) {
          data[i].gustspeed = Number(data[i].gustspeed)
        }
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: data[i]
        }
        list.features.push(obj)
      }
      if (maptype == 1) {
        this.upDateTFPoint(list, typeName, type)
      } else if (maptype == 2) {
        this.upDateTFfbPoint(list, typeName, type,max,min)
        this.mapBoxMap.flyTo({ center, zoom: 8 })
      }
    },
    upDateTFPoint (data, typeName, tfType) {
      let that = this
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
          'circle-color': [
            'step',
            ['to-number', ['get', tfType]],
            '#01FFD2', 5,
            '#05E4DF', 10,
            '#05C2E4', 15,
            '#0589E4', 20,
            '#0464D2', 25,
            '#044AD2', 30,
            '#042AD2'
          ],
          'circle-radius': 3
        }
      })
      let typeBox = 'point' + typeName
      var hoveredStateId = null
      that.mapBoxMap.on('mousemove', typeBox, function (e) {
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
        if (e.features[0].properties.rmax) {
          let content = ''
          content = `<h4 style="text-align:center;line-height: 28px;border-bottom:1px solid #ccc;">台风信息</h4>
                        <p>最大风速:${parseInt(e.features[0].properties.speed)} m/s</p>
                        <p>中心气压:${parseInt(e.features[0].properties.centralpressure)} hPa</p>
                        <p>环境气压:${parseInt(e.features[0].properties.envpressure)} hPa</p>
                        <p>最大风半径:${parseInt(e.features[0].properties.rmax)} km</p>`
          that.popupBox
            .setLngLat(e.lngLat)
            .setHTML(content)
            .addTo(that.mapBoxMap)
        }
      })
      that.mapBoxMap.on('mouseleave', typeBox, function (e) {
        if (hoveredStateId) {
          that.mapBoxMap.setFeatureState(
            { source: 'pd' + typeName, id: hoveredStateId },
            { hover: false }
          )
        }
        // that.mapBoxMap.setPaintProperty(type, 'circle-radius', 6);
        hoveredStateId = null
        that.popupBox.remove()
      })
    },
    // 生成台风轨迹路线数据结构
    changeLineObj (data) {
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
      this.upDateTFLine(list)
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
    upDateTFLine (data) {
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
    // 调整台风风圈数据结构
    changeTFCircle (p) {
      let radiusData = {
        ne: 100,
        nw: 120,
        sw: 120,
        se: 10
      }
      var center = turf.point(p)
      let quadrant = {
        // 逆时针算角度
        0: 'ne',
        1: 'sw',
        2: 'se',
        3: 'nw'
      }
      if (radiusData[quadrant[0]]) {
        var options = { number: 2048 }
        var arc_ne = turf.lineArc(center, radiusData[quadrant[0]], 0, 89.9, options)
        var arc_se = turf.lineArc(center, radiusData[quadrant[3]], 90, 179.9, options)
        var arc_sw = turf.lineArc(center, radiusData[quadrant[2]], 180, 269.9, options)
        var arc_nw = turf.lineArc(center, radiusData[quadrant[1]], 270, 360.1, options)

        var arcs = []
        arcs.push(arc_ne, arc_se, arc_sw, arc_nw)

        var typhoonCircleCoords = []
        for (var i = 0; i < arcs.length; i++) {
          var rawCoords1 = arcs[i].geometry.coordinates

          for (var j = 0; j < rawCoords1.length; j++) {
            typhoonCircleCoords.push(rawCoords1[j])
          }
        }

        var lineAll = turf.lineString(typhoonCircleCoords)
        var typhoonCirclePolygon = turf.lineToPolygon(lineAll)
        return typhoonCirclePolygon
      } else {

      }
    },
    // 生成台风风圈
    updateTFCircle (center) {
      let that = this
      let data = that.changeTFCircle(center)
      that.mapBoxMap.flyTo({ center, zoom: 5 })
      let list = {
        type: 'FeatureCollection',
        crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: [data]
      }
      if (that.mapBoxMap.getLayer('currentFillLayer')) {
        that.mapBoxMap.getSource('currentFillData').setData(list)
        that.updateTFRote(center)
        return
      }
      that.mapBoxMap.addSource(`currentFillData`, {
        type: 'geojson',
        data: list
      })
      that.mapBoxMap.addLayer({
        id: `currentFillLayer`,
        source: `currentFillData`,
        type: 'fill',
        paint: {
          'fill-color': ['match', ['get', 'radius'], '7', '#ffff00', '10', '#ffa911', '#ff5341'],
          'fill-opacity': 0.42,
          'fill-outline-color': ['match', ['get', 'radius'], '7', '#ffff00', '10', '#ffa911', '#ff5341']
        }
      })
      that.updateTFRote(center)
    },
    // 生成旋风动画图层
    updateTFRote (center) {
      let that = this
      let data = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: center }
          }
        ]
      }
      if (that.mapBoxMap.getLayer('rotateLayer')) {
        that.mapBoxMap.getSource('rotateData').setData(data)
        return
      }
      that.mapBoxMap.addImage(
        'rotate-img',
        that.createRotateIcon(require('@/assets/images/taifeng.png'))
      )
      that.mapBoxMap.addSource('rotateData', {
        type: 'geojson',
        data
      })
      that.mapBoxMap.addLayer({
        id: 'rotateLayer',
        type: 'symbol',
        source: 'rotateData',
        layout: {
          'icon-image': 'rotate-img',
          'icon-size': 1,
          'icon-offset': [0, 0],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      })
    },
    // 旋转的图片图层
    createRotateIcon (url) {
      const size = 40
      let that = this
      return {
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
          const context = this.context
          context.clearRect(0, 0, this.width, this.height)
          const img = new Image()
          img.src = url
          context.drawImage(img, 0, 0)
          img.onload = function () {
            context.clearRect(0, 0, 40, 40)
            context.translate(20, 20)
            context.rotate((Math.PI / 90) * (-1))
            context.translate(-20, -20)
            context.drawImage(img, 0, 0)
          }
          this.data = context.getImageData(0, 0, this.width, this.height).data
          that.mapBoxMap.triggerRepaint()
          return true
        }
      }
    },
    // 区域块数据结构调整
    changePolygon (data, colorList, type, geoJson) {
      let that = this
      let geo = {
        type: 'FeatureCollection',
        name: 'gd',
        bbox: [ 109.66481579, 20.2232732050001, 117.30348354, 25.5199513700001 ],
        features: []
      }
      let list = []
      for (let i in geoJson) {
        let params = this.geoJsonType
        let info = data.filter(function (item, index) {
          return geoJson[i].properties[params].indexOf(item[params]) != -1
        })
        geoJson[i].id = i
        if (info.length>0) {
          geoJson[i].properties[type] = info[0][type]
          geoJson[i].properties.city = info[0].city
          geoJson[i].properties.county = info[0].county
          geoJson[i].properties.province = info[0].province
          if (info[0].fwType) {
            geoJson[i].properties.fwType = info[0].fwType
          }
        } else {
          geoJson[i].properties[type] = 0
          if (type == 'loss') {
            geoJson[i].properties.fwType = '无'
          }
        }

        list.push(geoJson[i])
      }
      this.buildType.key = type
      switch (type) {
        case 'vmax':
          this.buildType.label = '风速(m/s)'
          break
        case 'population':
          this.buildType.label = '人口(万人)'
          break
        case 'value':
          this.buildType.label = '价值(万元)'
          break
        case 'loss':
          this.buildType.label = '损失(万元)'
          break
      }
      let max = data[0][type], min = data[data.length - 1][type]
      geo.features = list
      this.updatePolygon(geo, colorList, type, max, min)
    },
    // 生成风灾区域块
    updatePolygon (data, colorList, type, max, min) {
      let that = this
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
            color: that[colorList]
          },
          outOfRange: {
            colorAlpha: 0
          }
        }
      }
      let numlist = [((max - min) / 8) * 1, ((max - min) / 8) * 2, ((max - min) / 8) * 3, ((max - min) / 8) * 4, ((max - min) / 8) * 5, ((max - min) / 8) * 6, max]
      if (type == 'loss') {
        numlist = [0.1, 4500, 10000, 70000, 97000, 100000, 200000, 270000]
      }
      that.dom.setOption(option)
      if (that.mapBoxMap.getLayer('MultiPolygon')) {
        that.mapBoxMap.getSource('citymap').setData(data)
        that.mapBoxMap.setPaintProperty('MultiPolygon', 'fill-color', [
          'step',
          ['to-number', ['get', type]],
          that[colorList][0], numlist[0],
          that[colorList][1], numlist[1],
          that[colorList][2], numlist[2],
          that[colorList][3], numlist[3],
          that[colorList][4], numlist[4],
          that[colorList][5], numlist[5],
          that[colorList][6], numlist[6],
          that[colorList][7]
        ]
        )
        return
      }
      that.mapBoxMap.addSource('citymap', {
        type: 'geojson',
        data: data
      })
      that.mapBoxMap.addLayer(
        {
          id: 'MultiPolygon',
          source: 'citymap',
          type: 'fill',
          layout: {
            // visibility: "none"
            visibility: 'visible'
          },
          paint: {
            'fill-color': [
              'step',
              ['to-number', ['get', type]],
              that[colorList][0], numlist[0],
              that[colorList][1], numlist[1],
              that[colorList][2], numlist[2],
              that[colorList][3], numlist[3],
              that[colorList][4], numlist[4],
              that[colorList][5], numlist[5],
              that[colorList][6], numlist[6],
              that[colorList][7]
            ],
            // "fill-opacity": 0.45
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'click'], false],
              0,
              0.45
            ]
          }
        }
      )
      that.mapBoxMap.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'citymap',
        'paint': {
          'line-color': '#627BC1',
          'line-width': 0.5
        }
      })
      // that.mapBoxMap.on('mousemove', 'MultiPolygon', function (e) {
      //   let title = that.buildType.key == 'vmax' ? '风灾信息' : '风险暴露信息'
      //   if (that.buildType.key == 'loss') {
      //     title = '台风损失信息'
      //   }
      //   let str = `<h4 style="text-align:center;line-height: 28px;border-bottom:1px solid #ccc;">${title}</h4>
      //                       <p>省份:${e.features[0].properties.province}</p>
      //                       <p>城市:${e.features[0].properties.city}</p>`
      //   if (that.geoJsonType == 'county') {
      //     str = `${str}<p>区县:${e.features[0].properties.county} </p>`
      //   }
      //   if (that.buildType.key == 'loss') {
      //     str = `${str}<p>房屋建筑类型:${e.features[0].properties.fwType}</p>`
      //   }
      //   popup.remove()
      //   // if(e.features[0].properties[that.buildType.key]!=0){
      //   if (hoveredStateId != e.features[0].id) {
      //     popup
      //       .setLngLat(e.lngLat)
      //       .setHTML(`${str}
      //                   <p>${that.buildType.label}:${e.features[0].properties[that.buildType.key]}</p>`
      //       )
      //       .addTo(that.mapBoxMap)
      //   }
      // })
      // that.mapBoxMap.on('mouseleave', 'MultiPolygon', function (e) {
      //   popup.remove()
      // })
      // that.mapBoxMap.on('click', 'MultiPolygon', function (e) {
      //   if (that.geoJsonType == 'county') {
      //     that.mapBoxMap.getCanvas().style.cursor = ''
      //     if (e.features.length > 0) {
      //       if (hoveredStateId) {
      //         that.mapBoxMap.setFeatureState(
      //           { source: 'citymap', id: hoveredStateId },
      //           { click: false }
      //         )
      //         hoveredStateId = null
      //       }
      //       if (hoveredStateId != e.features[0].id && type != 'population') {
      //         that.$emit('getFBPoint', e.features[0].properties.county)
      //         that.mapBoxMap.flyTo({ center: e.lngLat, zoom: 10 })
      //         hoveredStateId = e.features[0].id
      //         that.mapBoxMap.setFeatureState(
      //           { source: 'citymap', id: hoveredStateId },
      //           { click: true }
      //         )
      //       }
      //     }
      //   } else {
      //     that.mapBoxMap.setFeatureState(
      //       { source: 'citymap', id: e.features[0].id },
      //       { click: false }
      //     )
      //     hoveredStateId = null
      //   }
      // })
    
    },
    // 城市分布网格点
    upDateTFfbPoint (data, typeName, type,max,min) {
      let that = this
      if (that.mapBoxMap.getLayer('point' + typeName)) {
        that.mapBoxMap.getSource('pd' + typeName).setData(data)
        return
      }
      let numlist = []
      console.log(type)
      if(type=="vmax"){
        numlist = [0, 10.5, 11, 11.5 ]
      }else if (type == 'loss') {
        numlist = [0, 1, 3, 6, ]
      }else if (type == 'value') {
        numlist = [0, 4500, 10000, 100000, 200000, ]
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
          'circle-color': [
            'step',
            ['to-number', ['get', type]],
              "rgba(0,0,0,0)", numlist[0],
              "#19be6b", numlist[1],
              "#2db7f5", numlist[2],
              "#ff9900", numlist[3],
              "#ed4014"
          ],
          'circle-radius': 3
        }
      })
      let typeBox = 'point' + typeName
      that.mapBoxMap.on('mousemove', typeBox, function (e) {
        let content = ''
        content = `<h4 style="text-align:center;line-height: 28px;border-bottom:1px solid #ccc;">损失信息</h4>
                        <p>省份:${e.features[0].properties.province} </p>
                        <p>城市:${e.features[0].properties.city} </p>`
        if (that.geoJsonType == 'county') {
          content = `${content}<p>区县:${e.features[0].properties.county} </p>`
        }
        if (type == 'vmax') {
          content = `${content}<p>风速:${e.features[0].properties[type]} m/s</p>`
        } else if (type == 'loss') {
          content = `${content}<p>房屋类型:${e.features[0].properties.fwType} </p>
                        <p>损失:${e.features[0].properties.loss} 万元</p>`
        } else if (type == 'value') {
          content = `${content}<p>价值:${e.features[0].properties.value} 万元</p>`
        }
        that.popupBox
          .setLngLat(e.lngLat)
          .setHTML(content)
          .addTo(that.mapBoxMap)
      })
      that.mapBoxMap.on('mouseleave', typeBox, function (e) {
        that.popupBox.remove()
      })
    },
    flyTo (obj) {
      this.mapBoxMap.flyTo(obj)
    },
    //  清除图层
    clearLayer (typeName) {
      if (this.mapBoxMap.getLayer('point' + typeName)) {
        this.mapBoxMap.removeLayer('point' + typeName)
        this.mapBoxMap.removeSource('pd' + typeName)
      }
      if (this.mapBoxMap.getLayer('wfh' + typeName)) {
        this.mapBoxMap.removeLayer('wfh' + typeName)
        this.mapBoxMap.removeSource('wfd' + typeName)
      }
    },
    clearLayer2 () {
      if (this.mapBoxMap.getLayer('curData-layer')) {
        this.mapBoxMap.removeLayer('curData-layer')
        this.mapBoxMap.removeLayer('clusters')
        this.mapBoxMap.removeLayer('cluster-count')
        this.mapBoxMap.removeSource('curData')
      }
      if (this.mapBoxMap.getLayer('lineslayer')) {
        this.mapBoxMap.removeLayer('lineslayer')
        this.mapBoxMap.removeSource('linesData')
      }
      if (this.mapBoxMap.getLayer('currentFillLayer')) {
        this.mapBoxMap.removeLayer('currentFillLayer')
        this.mapBoxMap.removeSource('currentFillData')
      }
      if (this.mapBoxMap.getLayer('rotateLayer')) {
        this.mapBoxMap.removeLayer('rotateLayer')
        this.mapBoxMap.removeSource('rotateData')
      }
      if (this.mapBoxMap.getLayer('MultiPolygon')) {
        this.mapBoxMap.removeLayer('MultiPolygon')
        this.mapBoxMap.removeLayer('state-borders')
        this.mapBoxMap.removeSource('citymap')
      }
      this.dom.setOption({
        visualMap: {
          show: false
        }
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
