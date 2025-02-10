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
    clearInterval(this.timer1)
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initChart () {
      let xAxisData = this.value.map(_ => Object.keys(_))
      let seriesData = this.value.map(_ => Object.values(_) * 1)

      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false // 不显示坐标轴刻度线
          }
        },
        yAxis: {
          max: 'dataMax',
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false // 不显示坐标轴刻度线
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        animationDurationUpdate: 800,
        series: [
          {
            name: '总体损失（亿）',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: '#188df0'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            data: seriesData
          }]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      let currentIndex = -1
      this.timer1 = setInterval(() => {
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
    clearInterval(this.timer1)
  }
}
</script>
