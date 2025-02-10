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
    value: {
      deep: true, // true为进行深度监听,false为不进行深度监听
      handler (cur, old) {
        if (this.dom == null) {
          this.initChart()
        } else {
          let lineData = this.value.map(item => {
            return item.rainArea
          })
          let barData = this.value.map(item => {
            return item.rainVal
          })
          this.dom.setOption({
            series: [
              {
                data: lineData
              }, {
                data: barData
              }
            ]
          })
        }
      }
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
      let category = this.value.map(item => {
        return item.cityName
      })
      let lineData = this.value.map(item => {
        return item.rainArea
      })
      let barData = this.value.map(item => {
        return item.rainVal
      })
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          data: category,
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          textStyle: {
            color: '#fff'
          }
        },
        yAxis: {
          textStyle: {
            color: '#fff'
          },
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        grid: { // 让图表占满容器
          top: 20,
          right: 10,
          bottom: 30
        },
        series: [
          {
            name: '降雨面积',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: lineData
          },
          {
            name: '降雨量',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              borderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#14c8d4' },
                { offset: 1, color: '#43eec6' }
              ])
            },
            data: barData
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      let currentIndex = -1
      this.timerbar = setInterval(() => {
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
    clearInterval(this.timerbar)
  }
}
</script>
