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
  props: ['value', 'checkTree', 'checkPreTree', 'selectParent', 'taborpic'],
  data () {
    return {
      dom: null
    }
  },
  watch: {
  },
  mounted () {
    this.dom = echarts.init(this.$refs.dom, 'tdTheme')
    on(window, 'resize', this.resize)
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    updateData (data1, data2, data3) {
      let that = this
      let option = {
        backgroundColor: 'rgba(0, 45, 104, 0.15)',
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          textStyle: {
            color: '#fff'
          }
        },
        toolbox: {
          show: true,
          left: 10,
          orient: 'vertical',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            magicType: {
              type: ['line', 'bar'],
              title: {
                line: '切换为过程线',
                bar: '切换为分布图'
              }
            },
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
        title: [],
        grid: [],
        xAxis: [],
        yAxis: [],
        series: []
      }
      if (that.taborpic[0] == '01') {
        option.tooltip = {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0]
            let nn = params.dataIndex
            return data1[0][nn].loctime + '<br />' + params.seriesName + ':' + params.value
          }
        }
      }
      for (let i in data2) {
        let op = data2[i]
        let axD = (data1[i].map(item => { return item.loctime })).map(function (str) {
          return str.replace(' ', '\n')
        })
        // if (that.taborpic[0] == '01') {
        //   axD = data1[i].map((item, index) => { return index })
        // }
        let xa = {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            onZero: false
          },
          axisLabel: {
            color: '#fff'
          },
          offset: -5,
          splitLine: { show: false },
          data: axD,
          gridIndex: i
        }
        let ya = {
          type: 'value',
          splitLine: { show: false },
          axisLabel: {
            color: '#fff'
          },
          gridIndex: i
        }
        let h = parseInt(100 / data2.length) - 1
        let gd = {
          height: (h - 6) + '%'
        }
        if (data2.length>1) {
          gd.top = (h * i + 2) + '%'
        } else {
          gd.height = '77%'
        }

        // let title = that.selectParent.children[0] ? that.selectParent.children[0].name + '_' : ''
        // let tt = {
        //   left: 'center',
        //   text: `${that.selectParent.name}_${title}${data3[i].name}`,
        //   textStyle: {
        //     color: '#fff'
        //   }
        // }
        // if (i>0) {
        //   tt.top = (h * i) + '%'
        // }
        option.xAxis.push(xa)
        option.yAxis.push(ya)
        option.grid.push(gd)
        // option.title.push(tt)
        for (let j in op) {
          let obj = {
            name: op[j].name,
            type: 'line',
            data: data1[i].map(item => {
              return item[op[j].fieldname]
            }),
            xAxisIndex: i * 1,
            yAxisIndex: i * 1,
            showSymbol: false,
            // animationDuration: 4000,
            lineStyle: {
              width: 1
            }
          }
          option.series.push(obj)
        }
      }
      that.dom.setOption(option, true)
    },
    updateCur (data1, data2, data3) {
      this.updateData(data1, data2, data3)
    },
    parentUpdate (data1, data2, data3) {
      this.dom.dispose()
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      on(window, 'resize', this.resize)
      this.updateData(data1, data2, data3)
    }
  },
  beforeDestroy () {
    this.dom && this.dom.dispose()
    off(window, 'resize', this.resize)
  }
}
</script>
