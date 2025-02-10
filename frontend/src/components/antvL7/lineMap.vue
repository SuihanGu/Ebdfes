<style lang="less">
  @import "./index.less";
</style>
<template>
    <div style="position: relative;" class="lmap">
        <Row class="inpubox">
            <Col span="12">
                <div id='geocoder3' class='geocoder3'></div>
            </Col>
            <Col span="12">
                <Input prefix="ios-search" placeholder="网格搜索，例：120, 30" @on-enter="flyTo" v-model="searchVal"/>
            </Col>
        </Row>
        <div id="Linemap"></div>
        <div class="colorBox">
          <div class="colorInfo"></div>
        </div>
    </div>

</template>

<script>
import { Scene, PolygonLayer, LineLayer, PointLayer, Mapbox } from '@antv/l7'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
export default {
  name: 'Linemap',
  props: ['value', 'text', 'subtext', 'pointCenter', 'zoom'],
  data () {
    return {
      LinemapBox: null,
      dataList: {},
      LinemapCon: null,
      searchVal: '139.57651879857946, 36.20283328532015'
    }
  },
  watch: {
    value (cur, old) {
      this.LinemapCon = null
      this.changeObj(cur)
    }
  },
  mounted () {
    document.getElementById('geocoder3').innerHTML = ''
    this.LinemapCon = null
    this.changeObj(this.value)
  },
  methods: {

    // 调整点标注结构
    changeObj (data) {
      let list = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {
              'color': '#01f736' // red
            },
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [139.56991466448716, 36.212687772653396],
                [139.57063647114745, 36.210991270819335],
                [139.572745570778, 36.20764611896749]
              ]
            }
          }, {
            'type': 'Feature',
            'properties': {
              'color': '#f73201' // red
            },
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [139.572745570778, 36.20764611896749],
                [139.57651879857946, 36.20283328532015]
              ]
            }
          }, {
            'type': 'Feature',
            'properties': {
              'color': '#01b1f7' // red
            },
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [139.57651879857946, 36.20283328532015],
                [139.57935768642068, 36.19890612355029],
                [139.58346053923793, 36.191300256295264]
              ]
            }
          }
        ]
      }
      this.dataList = list
      this.initDiv()
    },
    initDiv () {
      // 访问令牌  这个需要自己去mapbox官网申请
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      this.LinemapCon = new mapboxgl.Map({
        container: 'Linemap',
        style: 'dark',
        center: [139.46, 35.42],
        zoom: 4,
        // maxZoom:1.7,
        style: 'mapbox://styles/mapbox/streets-v11',
        token: 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      })
      this.LinemapCon.on('load', () => {
        this.LinemapCon.addSource('lines', {
          'type': 'geojson',
          'data': this.dataList
        })
        this.LinemapCon.addLayer({
          'id': 'lines',
          'type': 'line',
          'source': 'lines',
          'paint': {
            'line-width': 10,
            'line-color': ['get', 'color']
          }
        })
        
      })
      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
      document.getElementById('geocoder3').appendChild(geocoder.onAdd(this.LinemapCon))
      this.initMapBox()
    },
    // 切换定位
    flyTo () {
      let arr = []
      if (this.searchVal != '') {
        arr = this.searchVal.split(',')
        this.LinemapCon.flyTo({ center: [Number(arr[0]), Number(arr[1])], zoom: 13 })
      }
    },
    initMapBox () {

    }
  },

  beforeDestroy () {
    // document.getElementById('geocoder3').innerHTML = ''
    this.LinemapBox = null
    this.LinemapCon = null
  }
}
</script>
<style>
canvas.mapboxgl-canvas {
  width: 100% !important;
}
</style>