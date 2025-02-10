<template>
    <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: ['value', 'text', 'subtext'],
  data () {
    return {
      dom: null
    }
  },
  watch: {
    value (cur, old) {
      this.$nextTick(() => {
        if (this.dom == null) {
          this.initChart()
        } else {
          this.dom.setOption({
            series: [
              {
                data: this.value.map(_ => Object.values(_) * 1)
              }
            ]
          })
        }
      })
    }
  },
  mounted () {
    clearInterval(this.timerRain)
    this.initChart()
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initChart () {
      let option = {
        grid: {
          top: 20,
          right: 20,
          bottom: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Rainfall'],
          textStyle: {
            color: '#fff'
          }
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          data: []
        },
        yAxis: {
          name: '降雨量(mm)',
          nameLocation: 'start',
          alignTicks: true,
          type: 'value',
          splitLine: { show: false },
          inverse: true
        },
        series: [
          {
            name: '降雨量',
            type: 'line',
            yAxisIndex: 1,
            areaStyle: {},
            lineStyle: {
              width: 1
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    },
    initChart (list) {
      if (this.timerRain) {
        clearInterval(this.timerRain)
      }
      let xAxisData = []
      let data = []
      for (let i in list) {
        xAxisData.push((list[i].longitude * 1).toFixed(2) + '\n' + (list[i].latitude * 1).toFixed(2))
        data.push((list[i].rain * 1).toFixed(3) * 1)
      }
      let option = {
        xAxis: {
          data: xAxisData
        },
        series: [{
          data
        }]
      }
      this.dom.setOption(option)
      let currentIndex = -1
      this.timerRain = setInterval(() => {
        var dataLen = option.series[0].data.length
        // 取消之前高亮的图形
        this.dom.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        currentIndex = (currentIndex + 1) % dataLen
        // 高亮当前图形
        this.dom.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
        // 显示 tooltip
        this.dom.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
      }, 1000)
    }
  },

  beforeDestroy () {
    off(window, 'resize', this.resize)
    clearInterval(this.timerRain)
  }
}
</script>
