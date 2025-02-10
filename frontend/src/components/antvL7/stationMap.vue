<style lang="less">
  @import "./index.less";
</style>
<template>
    <div style="position: relative;" class="lmap">
        <Row class="inpubox">
            <Col span="12">
                <div id='geocoder2' class='geocoder2'></div>
            </Col>
            <Col span="12">
                <Input prefix="ios-search" placeholder="网格搜索，例：120, 30" @on-enter="flyTo" v-model="searchVal"/>
            </Col>
        </Row>
        <div id="stationMap"></div>
        <!-- <div class="colorBox"></div> -->
    </div>

</template>

<script>
import { Scene, PolygonLayer, LineLayer, PointLayer, Mapbox,Popup } from '@antv/l7'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
export default {
  name: 'stationMap',
  props: ['value', 'text', 'subtext', 'pointCenter', 'zoom','curPoint'],
  data () {
    return {
      stationMapBox: null,
      dataList: {
        type: 'FeatureCollection',
        features: []
      },
      StationmapCon: null,
      searchVal: '139.57651879857946, 36.20283328532015',
      pointLayer:null,
      curPointLayer:null,
      curdataList: {
        type: 'FeatureCollection',
        features: []
      },
    }
  },
  watch: {
    value (cur, old) {
      // document.getElementById('geocoder2').innerHTML = ''
      this.dataList.features = this.changeObj(cur)
      let data = JSON.parse(JSON.stringify(this.dataList))
      if (this.StationmapCon == null) {
        let list = []
        list.push(this.curPoint)
        this.curdataList.features  = this.changeObj2(list)
        this.dataList.features = this.changeObj(this.value)
        this.initDiv()
      } else {
        this.updatePoint(data)
      }
      // this.StationmapCon = null
    }
  },
  mounted () {
    document.getElementById('geocoder2').innerHTML = ''
    this.StationmapCon = null
    this.dataList.features = this.changeObj(this.value)
    let list = []
    list.push(this.curPoint)
    this.curdataList.features  = this.changeObj2(list)
    this.initDiv()
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
            coordinates: [data[i].stationLongitude,data[i].stationLatitude]
          },
          properties: data[i]
        }
        list.push(obj)
      }
      return list
    },
    // 调整点标注结构
    changeObj2(data) {
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
      this.StationmapCon = new mapboxgl.Map({
        container: 'stationMap',
        style: 'dark',
        center: this.curPoint.center,
        zoom: 2.3,
        // maxZoom:1.7,
        style: 'mapbox://styles/mapbox/streets-v11',
        token: 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      })
      // this.StationmapCon.on('load', () => {
      //   this.StationmapCon.addSource('lines', {
      //     'type': 'geojson',
      //     'data': this.dataList
      //   })
      //   this.StationmapCon.addLayer({
      //     'id': 'lines',
      //     'type': 'line',
      //     'source': 'lines',
      //     'paint': {
      //       'line-width': 10,
      //       'line-color': ['get', 'color']
      //     }
      //   })
      // })
      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
      document.getElementById('geocoder2').appendChild(geocoder.onAdd(this.StationmapCon))
      this.stationMapBox = new Scene({
        id: 'stationMap',
        map: new Mapbox({
          mapInstance: this.StationmapCon
        })
      })
      this.stationMapBox.on('loaded', () => {
        this.initPoint()
        this.initCurPoint()
      })
      
    },
    // 切换定位
    flyTo () {
      let arr = []
      if (this.searchVal != '') {
        arr = this.searchVal.split(',')
        this.StationmapCon.flyTo({ center: [Number(arr[0]), Number(arr[1])], zoom: 13 })
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
      that.stationMapBox.addLayer(that.curPointLayer)
      // that.curPointLayer.on('click', (e) => {
      //   that.modelData = e.feature.properties
      //   that.modalT = true
      // })
      const popup = new Popup({
        offsets: [ 0, 10 ],
        closeButton: false
      })
        .setLnglat(that.curPoint.center)
        .setHTML(`<span>位置: ${that.curPoint.place}</span>
                  <br><span>深度: ${that.curPoint.depth}</span>
                  <br><span>震级: ${that.curPoint.mag}</span>
                  <br><span>时间: ${that.curPoint.time}</span>`)
      that.stationMapBox.addPopup(popup)
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
        that.stationMapBox.addPopup(popup)
      })
    },
    // 生成网格点
    initPoint(){
      let that = this
      let type = that.dataList
      that.pointLayer = new PointLayer({ zIndex: 3 })
        .source(that.dataList)
        .shape('circle')
        .size(5)
        .color('pga', [
          '#FF4818',
          '#F7B74A',
          '#FFF598',
          '#91EABC',
          '#2EA9A1',
          '#206C7C'
        ])
      that.pointLayer.on('click', (e) => {
        let info = e.feature.properties
        that.$emit("getstationDetail", info);
      })
      that.stationMapBox.addLayer(that.pointLayer)
      
      // that.pointLayer.on('click', (e) => {
      //   that.modelData = e.feature.properties
      //   that.modalT = true
      // })
      // that.pointLayer.on('mousemove', e => {
      //   let type = e.feature.properties.grid_sj_PGA?'grid_sj_PGA':'grid_cz_PGA'
      //   const popup = new Popup({
      //     offsets: [ 0, 0 ],
      //     closeButton: false
      //   })
      //     .setLnglat(e.lngLat)
      //     .setHTML(`<span>震源位置: ${e.feature.properties.place}</span>
      //               <br><span>震源经纬度: ${e.feature.properties.center}</span>
      //               <br><span>震源距(km): ${e.feature.properties.dist}</span>
      //               <br><span>VS30(m/s): ${e.feature.properties.grid_VS30_JHIS}</span>
      //               <br><span>PGA(g): ${e.feature.properties[type]}</span>
      //               <br><span>房屋均损失程度: ${e.feature.properties.dr_mean}</span>
      //               <br><span>损失估计(亿美元): ${e.feature.properties.loss_mean}</span>`)
      //   that.DmapBox.addPopup(popup)
      // })
    },
    updatePoint (data) {
      let that = this
      that.pointLayer.setData(data)
    },
  },

  beforeDestroy () {
    // document.getElementById('geocoder2').innerHTML = ''
    this.stationMapBox = null
    this.StationmapCon = null
  }
}
</script>
<style>
canvas.mapboxgl-canvas {
  width: 100% !important;
}
</style>
