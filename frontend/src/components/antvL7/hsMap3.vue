<template>
  <div style="position: relative;" id="hsMap2">
      <div id="domChart" class="charts chart-bar" style="width: 100%;height:100%;position: relative;z-index: 100;"></div>
      <div ref="dom" class="charts chart-bar" style="width: 80px;height:250px;position: absolute;right: 25%;z-index: 999;bottom: 60px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import { Scene, Mapbox, HeatmapLayer,Popup,PointLayer } from '@antv/l7'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { compare } from '@/untils/untilsPublic'
export default {
name: 'hsMap',
props: ['pointCenter', 'language', 'mapstyle'],
data () {
  return {
    dom: null,
    domLayer:null,
    controlLanguage: null, // 动态切换语言
    HeatLayer: null,
    colorInfo:{
      1:[
        '#D0F4CA',
        '#A7ECB2',
        '#6BD5A0',
        '#30C7C4',
        '#2BA9DF',
        '#0796D3',
        '#0072C4',
        '#0350C1',
        '#0350C1',
        '#051FB7',
        '#1B048B',
        '#100243',
        '#100243',
        '#0B0030',
      ],
      2:[
        '#EDE59C',
        '#ECC357',
        '#ED9909',
        '#F77B00',
        '#FF8B18',
        '#FF4818',
        '#FF4818',
        '#FF2A3C',
        '#F0051A',
        '#DA05AA',
        '#8C1EB2',
        '#8C1EB2',
      ],
      3:[
        '#094D4A',
        '#146968',
        '#1D7F7E',
        '#289899',
        '#34B6B7',
        '#4AC5AF',
        '#5FD3A6',
        '#7BE39E',
        '#A1EDB8',
        '#C3F9CC',
        '#DEFAC0',
        '#ECFFB1'
      ]
    }
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
    that.mapBoxMap = new mapboxgl.Map({
      container: 'domChart',
      center: that.pointCenter,
      zoom: 2,
      style: that.mapstyle,
      shading: 'realistic',
      token: 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
    })
    that.domLayer = new Scene({
      id: 'domChart',
      map: new Mapbox({
        mapInstance: that.mapBoxMap
      })
    })
    var option = {
      visualMap: {
        show: false,
        max:100,
        bottom: 0,
        right: 0,
        calculable: false,
        realtime: false,
        textStyle: {
          color: '#fff'
        },
        inRange: {
          color: [
            '#FF3417',
            '#FF7412',
            '#FFB02A',
            '#FFE754',
            '#46F3FF',
            '#02BEFF',
            '#1A7AFF',
            '#0A1FB2'
          ].reverse()
        },
        outOfRange: {
          colorAlpha: 0
        }
      }
    }
    that.dom = echarts.init(that.$refs.dom, 'tdTheme')
    that.dom.setOption(option)
    on(window, 'resize', that.resize)
    that.$emit('getTimeList')
  },
  // 调整为geojson
  // 动态调整hs数据结构
  changePointObj (data, type,nn) {
    let list = {
      type: 'FeatureCollection',
      crs: { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: []
    }
    let num = 0,max=0
    let center = []
    for (let i in data) {
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
      max=Number((data[i][type]>max?data[i][type]:max).toFixed(2))
    }
    if (type == 'flddph') {
      this.upDatetfHeatMap(list, type,nn,max)
    } else {
      this.upDatetfHeatMap2(list, type,nn,center,max)
    }
  },
  // 生成洪水热力图
  upDatetfHeatMap (data, type,zoom,max) {
    let that = this
    if (that.HeatLayer != null) {
      that.HeatLayer.setData(data)
      return
    }
    let option = {
      visualMap: {
        show: true,
        bottom: 0,
        right: 0,
        max,
        text:[max+'m','0m'],
        calculable: false,
        realtime: false,
        textStyle: {
          color: '#fff'
        },
        inRange: {
          color: [
            '#FF3417',
            '#FF7412',
            '#FFB02A',
            '#FFE754',
            '#46F3FF',
            '#02BEFF',
            '#1A7AFF',
            '#0A1FB2'
          ].reverse()
        },
        outOfRange: {
          colorAlpha: 0
        }
      }
    }
    that.dom.setOption(option)
    that.mapBoxMap.flyTo({pitch: 0, zoom })
    that.HeatLayer = new HeatmapLayer({})
      .source(data, {
        transforms: [
          {
            type: 'grid',
            size: 10000,
            field: type,
            method: 'mean'
          }
        ]
      })
      .shape('square')
      .style({
        opaicty: ['mean', [0.05, 0.8]], // opacity 的值字啊 0.1 ～ 0.5 之间
        coverage: 1,
        angle: 0
      })
      .color(
        'mean',
        [
          '#FF3417',
          '#FF7412',
          '#FFB02A',
          '#FFE754',
          '#46F3FF',
          '#02BEFF',
          '#1A7AFF',
          '#0A1FB2'
        ].reverse()
      )
    that.domLayer.addLayer(that.HeatLayer)
    const popup = new Popup({
      offsets: [ 0, 0 ],
      closeButton: false,
      closeOnClick: true
    })
    that.HeatLayer.on('mousemove', e => {
      let text = '淹没深度(m)'
      popup
        .setLnglat(e.lngLat)
        .setHTML(`<span>${text}: ${Number((e.feature.properties.mean).toFixed(4))}</span>`)
      that.domLayer.addPopup(popup)
    })

    that.domLayer.on('mousemove', e => {
      popup.hide()
    })
  },
  // 生成洪水热力图
  upDatetfHeatMap2 (data, type, num,center,max) {
    let that = this
    that.mapBoxMap.flyTo({center, pitch: 0, zoom: 5.5 })
    if (that.hsLayer) {
      that.hsLayer.setData(data)
    }
    that.hsLayer = new PointLayer({ zIndex: 4 })
    .source([{ lng: center[0], lat: center[1] } ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat'
        }
      }
    )
      .shape('radar')
      .size(80)
      .color('#ed4014')
      .animate(true)
      .style({
        speed: 5
      })
    that.domLayer.addLayer(that.hsLayer)
    if (that.HeatLayer != null) {
      that.HeatLayer.setData(data)
      return
    }
    let text = '淹没深度(m)'
    let txt='m'
    if(type=='loss'){
      text='损失(万元)'
      txt='万元'
    }
    if(type=='value'){
      text='风险暴露(万)'
      txt='万'
    }
    let option = {
      visualMap: {
        show: true,
        max,
        text:[max+txt,'0'+txt],
        bottom: 0,
        right: 0,
        calculable: false,
        realtime: false,
        textStyle: {
          color: '#fff'
        },
        inRange: {
          color: that.colorInfo[num]
        },
        outOfRange: {
          colorAlpha: 0
        }
      }
    }
    that.dom.setOption(option)
    that.HeatLayer = new HeatmapLayer({})
      .source(data, {
        transforms: [
          {
            type: 'grid',
            size: 10000,
            field: type,
            method: 'mean'
          }
        ]
      })
      .shape('square')
      .style({
        opaicty: [type, [0.05, 0.8]], // opacity 的值字啊 0.1 ～ 0.5 之间
        coverage: 1,
        angle: 0
      })
      .color(
        'mean',
        that.colorInfo[num]
      )
    that.domLayer.addLayer(that.HeatLayer)
    const popup = new Popup({
      offsets: [ 0, 0 ],
      closeButton: false,
      closeOnClick: true
    })
    that.HeatLayer.on('mousemove', e => {
      
      popup
        .setLnglat(e.lngLat)
        .setHTML(`<span>${text}: ${Number((e.feature.properties.mean).toFixed(4))}</span>`)
      that.domLayer.addPopup(popup)
    })

    that.domLayer.on('mousemove', e => {
      popup.hide()
    })
  },
  //  清除图层
  clearLayer (typeName) {
    if(this.HeatLayer!=null){
      this.HeatLayer.hide();
      this.HeatLayer = null
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
    visualMap: {
      show: false
    }
  })
  off(window, 'resize', this.resize)
}
}
</script>
<style lang="less">
#hsMap2{
  width: 100%;
  height: 100%;
}
</style>
