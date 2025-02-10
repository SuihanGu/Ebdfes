<template>
    <div id="map_container" ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
let map = null
export default {
  name: 'mapChart',
  props: ['value', 'text', 'subtext', 'valueType'],
  data () {
    return {
      dom: null
    }
  },
  watch: {
    value (cur, old) {
      this.$nextTick(() => {
        map = null
        this.initChart()
      })
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initChart () {
      map = initMap()
      var point = new BMapGL.Point(this.value[0].center[0], this.value[0].center[1])
      map.centerAndZoom(point, 12)
      var view = new mapvgl.View({
        map: map
      })
      var data = []
      for (var i = 0; i < this.value.length; i++) {
        var item = this.value[i]
        data.push({
          geometry: {
            type: 'Point',
            coordinates: item.center
          },
          properties: {
            count: item[this.valueType]
          }
        })
      }
      var heatmap = new mapvgl.HeatmapLayer({
        size: 600, // 单个点绘制大小
        max: 40, // 最大阈值
        height: 0, // 最大高度，默认为0
        unit: 'm', // 单位，m:米，px: 像素
        gradient: { // 对应比例渐变色
          0.25: 'rgba(0, 0, 255, 1)',
          0.55: 'rgba(0, 255, 0, 1)',
          0.85: 'rgba(255, 255, 0, 1)',
          1: 'rgba(255, 0, 0, 1)'
        }
      })
      view.addLayer(heatmap)
      heatmap.setData(data)
    }
  },

  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
