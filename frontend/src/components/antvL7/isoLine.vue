<style lang="less">
  @import "./index.less";
</style>
<template>
  <div id="isoLine"></div>
</template>

<script>
import { Scene, LineLayer, Mapbox } from '@antv/l7'
import { TouchRotateHandler } from '@antv/l7-map/es/handler/touch'
export default {
  name: 'isoLine',
  props: ['value', 'pointCenter'],
  data () {
    return {
      isomapCon:null,
      isoLine: null,
      lineLayer: null,
      colorList:[
        '#094D4A',
        '#146968',
        '#1D7F7E',
        '#289899',
        '#34B6B7',
        '#4AC5AF',
        '#5FD3A6',
        '#7BE39E',
        '#A1EDB8',
        '#CEF8D6'
      ]
    }
  },
  watch: {
    value (cur, old) {
      // this.isomapCon = null
      this.initDiv(cur)
      
    }
    // value: {
    //   deep: true, // 深度监听设置为 true
    //   handler: function (cur, old) {
    //     this.initDiv(cur)
    //   }

    // }
  },
  mounted () {
    this.isomapCon = null
    this.initDiv(this.value)
  },
  methods: {
    initDiv (data) {
      let that = this
      // 访问令牌  这个需要自己去mapbox官网申请
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      this.isomapCon = new mapboxgl.Map({
        container: 'isoLine',
        center: that.pointCenter,
        zoom: 3,
        // maxZoom:1.7,
        style: 'mapbox://styles/mapbox/dark-v10',
        token: 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      })
      that.isoLine = new Scene({
        id: 'isoLine', 
        map: new Mapbox({
          mapInstance: that.isomapCon
        }),
      })
      that.isoLine.on('loaded', () => {
        that.lineLayer = new LineLayer({})
          .source(data)
          .size(1)
          .shape('line')
          .scale('PGA', {
            type: 'quantize'
          })
          .style({
            heightfixed: true
          })
          // .animate({
          //     trailLength: 1.5,
          // })
          .color('PGA',
            that.colorList.reverse()
          )
        that.isoLine.addLayer(that.lineLayer)
      })
    }
  },

  beforeDestroy () {
    this.isomapCon = null
  }
}
</script>
