<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String,
    color: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    updateData (xAxisData, seriesData) {
      let option = {
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            color: this.color
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: this.color
          },
          splitLine: { show: false }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [{
          data: seriesData,
          type: 'bar',
          showBackground: true,
          realtimeSort: true,
          label: {
            show: true,
            position: 'top',
            valueAnimation: true
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          }
        }]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      // this.timer = setTimeout(()=>{
      //   this.$emit("getzzData");
      // },1000)
    },
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    clearTimeout(this.timer)
  }
}
</script>
