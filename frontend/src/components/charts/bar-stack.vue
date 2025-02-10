<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLineStack',
  props: ['value', 'text', 'subtext'],
  data () {
    return {
      dom: null,
      timerline2: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.initBarRace(this.value)
    })
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initBarRace (data) {
      if (this.timerline2 != null) {
        clearInterval(this.timerline2)
      }
      let arr = Object.values(data.reduce((res, item) => {
        res[item.xl] ? res[item.xl].push(item) : res[item.xl] = [item]
        return res
      }, {}))
      let xd = arr[0].map(_ => _.name)
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top: 'bottom'
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          data: xd
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false }
        },
        series: []
      }
      for (let i in arr) {
        let obj = {
          name: arr[i][0].xl,
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: arr[i]
        }
        option.series.push(obj)
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      let currentIndex = -1
      this.timerline2 = setInterval(() => {
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
      }, 3000)
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    clearInterval(this.timerline2)
  }
}
</script>
