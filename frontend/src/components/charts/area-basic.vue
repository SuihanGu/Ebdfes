<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBarRace',
  props: ['value'],
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
          this.initBarRace()
        } else {
          let data = this.value.map(item => {
            return item.value
          })
          this.dom.setOption({
            series: [
              {
                data: data
              }
            ]
          })
        }
      }
    }
  },
  mounted () {
    clearInterval(this.timer2)
    this.initBarRace()
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initBarRace () {
      let timedata = this.value.map(item => {
        return item.label
      })
      let data = this.value.map(item => {
        return item.value
      })
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: { show: false },
          data: timedata
        },
        yAxis: {
          splitLine: { show: false },
          type: 'value'
        },
        grid: { // 让图表占满容器
          top: 20,
          right: 20,
          bottom: 30
        },
        series: [
          {
            data: data,
            type: 'line',
            lineStyle: {
              width: 1
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236,0)'
                }
              ])
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      let currentIndex = -1
      this.timer2 = setInterval(() => {
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
    clearInterval(this.timer2)
  }
}
</script>
