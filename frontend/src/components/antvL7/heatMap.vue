<style lang="less">
  @import "./index.less";
</style>
<template>
    <div style="position: relative;">
        <div id="Hmap">
        </div>
        <div @mouseenter="layerBox=true">
          <Icon type="logo-buffer" class="layerBtn"></Icon>
        </div>
        <div class="layerBox" v-if="layerBox" @mouseout="layerBox=false">
          <div v-for="(item,index) in layerList" :key="index+'la'" class="chackBox" @click="layerSH(item.variable,index)">
            <Icon type="md-eye" v-if="item.isShow" size="16"/>
            <Icon type="md-eye-off" v-else size="16" color="#ccc"/>
            <div>
                {{item.txt}}
            </div>
          </div>
        </div>
        <div class="colorBox">
          <div class="colorInfo"
            style="background: -webkit-linear-gradient(#421EB2,#FFF598,#FF4818);
            background: -o-linear-gradient(#421EB2,#FFF598,#FF4818);
            background: -moz-linear-gradient(#421EB2,#FFF598,#FF4818,);
            background: linear-gradient(#421EB2,#FFF598,#FF4818);">
          </div>
          <div class="colorInfo"
            style="background: -webkit-linear-gradient(#01f736,#f73201);
            background: -o-linear-gradient(#01f736,#f73201);
            background: -moz-linear-gradient(#01f736,#f73201,);
            background: linear-gradient(#01f736,#f73201);">
          </div>
        </div>
        
    </div>

</template>

<script>
import { Scene, HeatmapLayer, Mapbox } from '@antv/l7'
export default {
  name: 'Hmap',
  props: ['value', 'text', 'subtext', 'pointCenter', 'zoom'],
  data () {
    return {
      HmapBox: null,
      dataList: {
        type: 'FeatureCollection',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: []
      },
      modelData: {},
      modalT: false,
      HeatmapCon: null,
      searchVal: '',
      fatalityLayer:null,
      populationLayer:null,
      // 图层列表
      layerList: [
        {
          txt: '人口伤亡',
          icon: require('@/assets/images/index-page/point.png'),
          isShow: true,
          variable: ['fatalityLayer']// 需要控制的图层
        }, {
          txt: '人口密度',
          icon: require('@/assets/images/index-page/taifeng.png'),
          isShow: true,
          variable: ['populationLayer']// 需要控制的图层
        }
      ],
      layerBox:false
    }
  },
  watch: {
    value (cur, old) {
      this.HeatmapCon = null
      this.changeObj(cur)
    }
  },
  mounted () {
    this.HeatmapCon = null
    this.changeObj(this.value)
  },
  methods: {
    // 图层控制
    layerSH (typeList, n) {
      let that = this
      that.layerList[n].isShow = !that.layerList[n].isShow
      for (let i in typeList) {
        if (!Array.isArray(that[typeList[i]])) {
          if (that.layerList[n].isShow) {
            that[typeList[i]].show()
          } else {
            that[typeList[i]].hide()
          }
        } else {
          if (that.layerList[n].isShow) {
            for (let j in that[typeList[i]]) {
              that[typeList[i]][j].show()
            }
          } else {
            for (let j in that[typeList[i]]) {
              that[typeList[i]][j].hide()
            }
          }
        }
      }
    },
    // 调整点标注结构
    changeObj (data) {
      let list = []
      for (let i in data) {
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [data[i].longitud, data[i].latitude]
          },
          properties: {
            id: data[i].locid ? data[i].locid : i,
            population: data[i].population,
            fatality: data[i].fatality,
          }
        }
        list.push(obj)
      }
      this.dataList.features = list
      this.initDiv()
    },
    initDiv () {
      // 访问令牌  这个需要自己去mapbox官网申请
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      this.HeatmapCon = new mapboxgl.Map({
        container: 'Hmap',
        center: [139.46, 35.42],
        zoom: 4,
        // maxZoom:1.7,
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        token: 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      })
      this.HmapBox = new Scene({
        id: 'Hmap',
        map: new Mapbox({
          mapInstance: this.HeatmapCon
        }),
      })

      this.initMapBox()
    },
    initMapBox () {
      let that = this
      that.HmapBox.on('loaded', () => {
        that.fatalityLayer = new HeatmapLayer({ zIndex:2 })
          .source(that.dataList)
          .shape('heatmap')
          .size('fatality', [ 0, 1.0]) // weight映射通道
          .style({
            intensity: 2,
            radius: 20,
            opacity: 1.0,
            rampColors: {
              colors: [
                '#FF4818',
                '#F7B74A',
                '#FFF598',
                '#F27DEB',
                '#8C1EB2',
                '#421EB2'
              ].reverse(),
              positions: [ 0, 0.2, 0.4, 0.6, 0.8, 1.0 ]
            }
          })
        that.HmapBox.addLayer(that.fatalityLayer)
        that.populationLayer = new HeatmapLayer({ zIndex:1 })
          .source(that.dataList)
          .shape('heatmap')
          .size('population', [ 0, 1.0]) // weight映射通道
          .style({
            intensity: 2,
            radius: 20,
            opacity: 1.0,
            rampColors: {
              colors: [
                '#FF4818',
                '#F7B74A',
                '#FFF598',
                '#91EABC',
                '#2EA9A1',
                '#206C7C'
              ].reverse(),
              positions: [ 0, 0.2, 0.4, 0.6, 0.8, 1.0 ]
            }
          })
        that.HmapBox.addLayer(that.populationLayer)
      })
    }
  },

  beforeDestroy () {
    this.HmapBox = null
    this.HeatmapCon = null
  }
}
</script>
<style>
canvas.mapboxgl-canvas {
  width: 100% !important;
}
</style>