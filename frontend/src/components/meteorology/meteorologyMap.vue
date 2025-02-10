<template>
    <div style="position: relative;" id="meMap">
        <div ref="dom" class="charts chart-bar" id="meteMap" style="width: 100%;height:100%;"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
echarts.registerTheme('tdTheme', tdTheme)
// import imgUrl from '@/assets/images/meteorology/map/rain.png'
export default {
  name: 'meMap',
  props: ['selcjyData', 'language', 'mapstyle'],
  data () {
    return {
      dom: null,
      controlLanguage: null// 动态切换语言
      // imgUrl
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
      that.mapBoxMap = new mapboxgl.Map({
        container: 'meteMap',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: that.mapstyle,
        center: [170, 0],
        zoom: 2,
        minZoom: 2,
        projection: 'equirectangular' // starting projection
      })
      that.controlLanguage = new MapboxLanguage({
        defaultLanguage: that.language
      })
      that.mapBoxMap.addControl(that.controlLanguage)
      that.mapBoxMap.on('load', () => {

      })
    },
    // 调整为geojson
    changeObj (data, typeName) {
      // let geojson1 = {
      //     type: 'FeatureCollection',
      //     crs: { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      //     features: []
      // }
      // for(let i in data){
      //     let obj={
      //         type: 'Feature',
      //         geometry: {
      //             type: 'Point',
      //             coordinates: [data[i].longitude*1,data[i].latitude*1]
      //         },
      //         properties: data[i]
      //     }
      //     geojson1.features.push(obj)
      // }
      this.mapBoxHeat(data, typeName)
    },
    // mapBox绘制热力图 降雨
    mapBoxHeat (data, typeName, type) {
      let that = this
      if (that.mapBoxMap.getLayer(typeName + 'Layer')) {
        that.mapBoxMap.getSource(typeName + 'Data').updateImage({ url: data })
        return
      }
      that.mapBoxMap.addSource(typeName + 'Data', {
        'type': 'image',
        'url': data,
        'coordinates': [
          [-0.25, 89],
          [359.75, 89],
          [359.75, -89],
          [-0.25, -89]
        ]
      })
      that.mapBoxMap.addLayer({
        id: typeName + 'Layer',
        'type': 'raster',
        'source': typeName + 'Data',
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
          'raster-fade-duration': 0,
          'raster-opacity': 0.65
        }
      })
    },
    // 图层控制
    layerChange (name, isTrue) {
      let that = this
      if (that.mapBoxMap.getLayer(name + 'Layer')) {
        that.mapBoxMap.setLayoutProperty(name + 'Layer', 'visibility', isTrue)
      } else {
        if (isTrue == 'visible') {
          that.$emit('getGusts')
        }
      }
    }

  },
  beforeDestroy () {
    let that = this
    off(window, 'resize', this.resize)
  }
}
</script>
<style lang="less">
#meMap{
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
</style>
