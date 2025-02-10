<template>
    <div ref="dom" class="charts chart-bar"></div>
  </template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'citytMap',
  props: ['pointCenter', 'cityGEOJson', 'cityZoom', 'pointCenter'],
  data () {
    return {
      dom: null
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
      echarts.registerMap('区域地图', that.cityGEOJson)
      var option = {
        series: [
          {
            type: 'map',
            itemStyle: {
              opacity: 1,
              borderWidth: 1,
              borderColor: '#a0cfff', // 边框颜色
              areaColor: '#337ecc66', // 地图区域颜色
              shadowColor: '#000'
            },
            label: {
              color: '#fff',
              fontWeight: 'bold',
              show: false
            },
            emphasis: {
              itemStyle: {
                show: 'true',
                borderWidth: 1,
                borderColor: '#a0cfff', // 边框颜色
                areaColor: '#2db7f5' // 鼠标移上去的颜色
              },
              label: {
                color: '#fff',
                fontWeight: 'bold',
                show: true
              }
            },
            center: that.pointCenter ? that.pointCenter : null,
            zoom: that.cityZoom,
            roam: true,
            map: '区域地图' // 使用
            // data: this.difficultData //热力图数据   不同区域 不同的底色
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            symbolSize: 5,
            rippleEffect: { // 坐标点动画
              period: 3,
              scale: 5,
              brushType: 'fill'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: 'orange',
                fontWeight: 'bold',
                fontSize: 18
              }
            },
            data: [],
            itemStyle: { // 坐标点颜色
              normal: {
                show: true,
                color: 'orange',
                shadowBlur: 10,
                shadowColor: '#fff'
              }
            }
          }
        ]
      }
      that.dom = echarts.init(that.$refs.dom, 'tdTheme')
      that.dom.setOption(option)
      let currentIndex = -1
      let areaId = that.cityGEOJson.features[0].properties.id
      let areaData = that.cityGEOJson.features[0].properties
      that.$emit('areaIdChange', areaId, areaData)
      that.cityTimer = setInterval(() => {
        // 取消之前高亮的图形
        that.dom.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        currentIndex = (currentIndex + 1) % 10
        // 高亮当前图形
        that.dom.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        let areaId = that.cityGEOJson.features[currentIndex].properties.id
        let areaData = that.cityGEOJson.features[currentIndex].properties
        that.$emit('areaIdChange', areaId, areaData)
      }, 3000)
      on(window, 'resize', that.resize)
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
