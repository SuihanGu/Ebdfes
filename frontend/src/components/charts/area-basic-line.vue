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
          type: 'value',
          max: 10
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
                  color: 'rgb(255, 255, 255)'
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236,0)'
                }
              ])
            },
            markLine: {
              data: [
                {
                  yAxis: 9,
                  label: {
                    padding: [0, 0, 15, -60],
                    position: 'end',
                    formatter: (e) => {
                      return '保证水位'
                    }
                  },
                  lineStyle: {// 警戒线的样式，颜色，宽度，类型
                    color: '#80ffa5',
                    type: 'dashed', // 还有实线，
                    width: 2
                  }
                },
                {
                  yAxis: 7, // 警戒值
                  label: {
                    padding: [0, 0, 15, -60], // 警戒线标签名距离警戒线的位置
                    position: 'end', // 警戒线标签的定位，还有minddle等字段。
                    formatter: (e) => { // 自定义警戒线标签名
                      return '警戒水位'
                    }
                  },
                  lineStyle: {// 警戒线的样式，颜色，宽度，类型
                    color: 'red',
                    type: 'dashed', // 还有实线，
                    width: 2
                  }
                }
              ],
              silent: false, // 鼠标移入警戒线，警戒线会变粗，false不变，true变
              symbol: false

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
