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
  props: ['value', 'text', 'subtext', 'color'],
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      clearInterval(this.timer6)
      let legend = this.value.map(_ => _.name)
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center',
          y: 10,
          textStyle: {
            color: this.color
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 'bottom',
          data: legend,
          textStyle: {
            color: this.color
          }
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            data: this.value,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(255, 255, 255,0.5)'
              }
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      let currentIndex = -1
      this.timer6 = setInterval(() => {
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
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    clearInterval(this.timer6)
  }
}
</script>
