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
                data: cur.map(item => {
                  return [item.year, item.val * 1, item.name]
                })
              }
            ]
          })
        }
      })
    }
  },
  mounted () {
    clearInterval(this.staxkTimer)
    this.initChart()
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initChart () {
      let seriesData = this.value.map(item => {
        return [item.year, item.val * 1, item.name]
      })
      let nameList = this.value.map(item => {
        return item.name
      })
      nameList = [...new Set(nameList)] // es6去重
      let colorList = this.value.map(item => {
        return item.color
      })
      colorList = [...new Set(colorList)] // es6去重
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: 'rgba(0,0,0,0.2)',
              width: 1,
              type: 'solid'
            }
          }
        },
        legend: {
          data: nameList,
          textStyle: {
            color: '#fff'
          }
        },
        singleAxis: {
          top: 50,
          bottom: 50,
          axisTick: {},
          axisLabel: {},
          type: 'time',
          axisPointer: {
            animation: true,
            label: {
              show: true
            }
          },
          splitLine: {
            show: false
          },
          textStyle: {
            color: '#fff'
          }
        },
        animationDurationUpdate: 800,
        series: [
          {
            type: 'themeRiver',
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.8)'
              }
            },
            label: {
              color: '#fff'
            },
            data: seriesData
          }]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      let currentIndex = -1
      this.staxkTimer = setInterval(() => {
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
    clearInterval(this.staxkTimer)
  }
}
</script>
