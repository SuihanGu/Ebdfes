<style lang="less">
  @import "./index.less";
</style>
<template>
    <div style="position: relative;height: 100%;">
        <Row class="inpubox" style="position: absolute;top:60px;left:25%;z-index: 1000;">
            <Col span="3">
                <div id='geocoder' class='geocoder'></div>
            </Col>
            <Col span="3"  style="position: relative;z-index: 2;">
                <Input prefix="ios-search" placeholder="网格搜索，例：120, 30" @on-enter="flyTo" v-model="searchVal"/>
            </Col>
        </Row>
        <div id="DMap"></div>
    </div>

</template>
<script>
import { Scene, PolygonLayer, LineLayer, PointLayer, Mapbox,Popup } from '@antv/l7'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
export default {
  name: 'DMap',
  props: ['value', 'text', 'subtext', 'pointCenter', 'zoom','curPoint'],
  data () {
    return {
      DmapBox: null,
      dataList: {
        type: 'FeatureCollection',
        features: []
      },
      curdataList: {
        type: 'FeatureCollection',
        features: []
      },
      curPointLayer: null,//当前地震层
      curtextLayer:null,
      pointLayer:null,
      textLayer:null,
      modelData: {},
      modalT: false,
      DmapCon: null,
      searchVal: ''
    }
  },
  watch: {
    value (cur, old) {
      this.dataList.features = this.changeObj(cur)
      let data = JSON.parse(JSON.stringify(this.dataList))
      if (this.DmapCon == null) {
        let list = []
        list.push(this.curPoint)
        this.curdataList.features  = this.changeObj(list)
        this.initDiv()
      } else {
        this.updatePoint(data)
      }
      // document.getElementById('geocoder').innerHTML = ''
      // this.DmapCon = null
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.getElementById('geocoder').innerHTML = ''
      this.DmapCon = null
      this.dataList.features = this.changeObj(this.value)
      let list = []
      list.push(this.curPoint)
      this.curdataList.features  = this.changeObj(list)
      this.initDiv()
    })
    
  },
  methods: {
    // 调整点标注结构
    changeObj (data) {
      let list = []
      for (let i in data) {
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: data[i].center
          },
          properties: data[i]
        }
        list.push(obj)
      }
      return list
    },
    initDiv () {
      // 访问令牌  这个需要自己去mapbox官网申请
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      this.DmapCon = new mapboxgl.Map({
        container: 'DMap',
        style: 'dark',
        center: this.pointCenter,
        zoom: this.zoom,
        // maxZoom:1.7,
        pitch: 0,
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        token: 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      })
      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
      document.getElementById('geocoder').appendChild(geocoder.onAdd(this.DmapCon))

      this.DmapBox = new Scene({
        id: 'DMap',
        map: new Mapbox({
          mapInstance: this.DmapCon
        })
      })
      this.DmapBox.on('loaded', () => {
        this.initPoint()
        this.initCurPoint()
      })
      // this.initMapBox()
      //     return '';
      // });
    },
    // 切换定位
    flyTo () {
      let arr = []
      if (this.searchVal != '') {
        arr = this.searchVal.split(',')
        this.DmapCon.flyTo({ center: [Number(arr[0]), Number(arr[1])] })
      }
    },
    //生成当前的地震点
    initCurPoint(){
      let that = this
      that.curPointLayer = new PointLayer({ zIndex: 3 })
        .source(that.curdataList)
        .shape('circle')
        .size(50)
        .color('#ed4014')
        .active(true)
        .animate(true)
        .style({
          strokeWidth: 0
        })
      that.DmapBox.addLayer(that.curPointLayer)
      // that.curPointLayer.on('click', (e) => {
      //   that.modelData = e.feature.properties
      //   that.modalT = true
      // })
      that.curPointLayer.on('mousemove', e => {
        const popup = new Popup({
          offsets: [ 0, 0 ],
          closeButton: false
        })
          .setLnglat(e.lngLat)
          .setHTML(`<span>位置: ${e.feature.properties.place}</span>
                    <br><span>深度: ${e.feature.properties.depth}</span>
                    <br><span>震级: ${e.feature.properties.mag}</span>
                    <br><span>时间: ${e.feature.properties.time}</span>`)
        that.DmapBox.addPopup(popup)
      })
    },
    // 生成网格点
    initPoint(){
      let that = this
      that.pointLayer = new PointLayer({ zIndex: 3 })
        .source(that.dataList)
        .shape('circle')
        // .size('dist', [5, 15])
        .size(8)
        .color('dist', [
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#CEF8D6'
        ])
      that.DmapBox.addLayer(that.pointLayer)
      // that.pointLayer.on('click', (e) => {
      //   that.modelData = e.feature.properties
      //   that.modalT = true
      // })
      that.pointLayer.on('mousemove', e => {
        let type = e.feature.properties.grid_SJ_PGA?'grid_SJ_PGA':'grid_CZ_PGA'
        const popup = new Popup({
          offsets: [ 0, 0 ],
          closeButton: false
        })
          .setLnglat(e.lngLat)
          .setHTML(`<span>震源位置: ${e.feature.properties.place}</span>
                    <br><span>震源经纬度: ${e.feature.properties.center}</span>
                    <br><span>震源距(km): ${e.feature.properties.dist}</span>
                    <br><span>VS30(m/s): ${e.feature.properties.grid_VS30_JHIS}</span>
                    <br><span>PGA(g): ${e.feature.properties[type]}</span>
                    <br><span>房屋均损失程度: ${e.feature.properties.dr_mean}</span>
                    <br><span>损失估计(美元): ${Number(e.feature.properties.loss_mean)}</span>`)
        that.DmapBox.addPopup(popup)
      })
    },
    updatePoint (data) {
      let that = this
      that.pointLayer.setData(data)
    },
  },

  beforeDestroy () {
    this.DmapBox = null
    this.DmapCon = null
  }
}
</script>
