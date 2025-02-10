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
  props: {
    value: Array,
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
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let option = {

      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    updateData (data1, data2, val1, val2) {
      let that = this
      let newarray = data1.result.map(function (c, i) { return [ c, data2.result[i] ] })
      let max = Math.max.apply(null, data1.result)
      let min = Math.min.apply(null, data1.result)
      let option = {
        backgroundColor: 'rgba(0, 45, 104, 0.15)',
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>: {c}'
        },
        toolbox: {
          show: true,
          left: 10,
          orient: 'vertical',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            // magicType: {
            //     type: ['line', 'bar'],
            //     title:{
            //         line: '切换为过程线',
            //         bar: '切换为分布图',
            //     }
            // },
            restore: {},
            saveAsImage: {}
          },
          iconStyle: {
            borderColor: '#fff'
          },
          emphasis: {
            iconStyle: {
              borderColor: '#14c8d4'
            }
          }
        },
        title: {
          left: 'center',
          text: '相关图',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          name: data1.val,
          nameLocation: 'center',
          nameTextStyle: {
            color: '#fff',
            fontWeight: 'bold'
          },
          nameGap: 35,
          boundaryGap: false,
          axisLine: {
            onZero: false,
            show: true, // 这个是需要主动添加上去的，默认是false
            symbol: ['none', 'arrow'] // 只在末端显示箭头
          },
          axisLabel: {
            color: '#fff'
          },
          splitLine: { show: false }
        },
        yAxis: {
          name: data2.val,
          nameLocation: 'center',
          nameTextStyle: {
            color: '#fff',
            fontWeight: 'bold'
          },
          nameGap: 50,
          minorSplitLine: {
            show: false
          },
          axisLine: {
            onZero: false,
            show: true, // 这个是需要主动添加上去的，默认是false
            symbol: ['none', 'arrow'] // 只在末端显示箭头
          },
          splitLine: { show: false },
          axisLabel: {
            color: '#fff'
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'inside',
            filterMode: 'none',
            xAxisIndex: [0]
          },
          {
            show: true,
            type: 'inside',
            filterMode: 'none',
            yAxisIndex: [0]
          }
        ],
        series: [
          {
            name: '实测点',
            type: 'scatter',
            data: newarray
          },
          {
            type: 'line',
            showSymbol: false,
            clip: true,
            data: that.generateData(val1, val2, max, min)
          }
        ]
      }
      this.dom.setOption(option)
    },
    generateData (val1, val2, max, min) {
      let data = []
      let i = 0
      if (min<0) {
        i = min
      }
      for (i; i < max; i += 0.1) {
        data.push([i, this.func(val1, val2, i)])
      }
      return data
    },
    func (val1, val2, x) {
      let y = x * val1 + val2
      return y
    },
    parentUpdate (data1, data2, val1, val2) {
      this.dom.dispose()
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      on(window, 'resize', this.resize)
      this.updateData(data1, data2, val1, val2)
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
