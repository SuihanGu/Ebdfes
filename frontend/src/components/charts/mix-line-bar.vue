<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null,
      num: 5
    }
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    intBarChart () {
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
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '20%',
          left: '8%',
          right: '3%',
          bottom: '1%',
          containLabel: true
        },
        // toolbox: {
        //     feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //     }
        // },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff'
          },
          data: ['Evaporation', 'Precipitation', 'Temperature']
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              color: '#fff'
            }

          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Precipitation',

            max: 'dataMax',
            // interval: 50,
            axisLabel: {
              formatter: '{value} ml'
            },
            axisLabel: {
              color: '#fff'
            },
            splitLine: {
              show: false // 不显示坐标轴刻度线
            }
          },
          {
            type: 'value',
            name: 'Temperature',

            max: 'dataMax',
            // interval: 5,
            axisLabel: {
              formatter: '{value} °C'
            },
            splitLine: {
              show: false // 不显示坐标轴刻度线
            }
          }
        ],
        animationDurationUpdate: 800,
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              }
            },
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            }
          },
          {
            name: 'Precipitation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              }
            },
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#B0F26D' },
                { offset: 0.5, color: '#59EA3A' },
                { offset: 1, color: '#59EA3A' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#59EA3A' },
                  { offset: 0.7, color: '#59EA3A' },
                  { offset: 1, color: '#B0F26D' }
                ])
              }
            }
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' °C'
              }
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      // this.timer = setInterval(()=>{
      //     this.num+=5
      //     this.run();
      // }, 2000);
      let currentIndex = -1
      this.timer4 = setInterval(() => {
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
    },
    run () {
      this.dom.setOption({
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              }
            },
            data: [
              2.9 * this.num, 4.9 * this.num, 7.0 * this.num, 23.2 * this.num, 25.6 * this.num, 76.7 * this.num, 135.6 * this.num,
              162.2 * this.num, 32.6 * this.num, 20.0 * this.num, 6.4 * this.num, 3.3 * this.num
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              }
            },
            data: [
              2.6 * this.num, 5.9 * this.num, 9.0 * this.num, 26.4 * this.num, 28.7 * this.num, 70.7 * this.num,
              175.6 * this.num, 182.2 * this.num, 48.7 * this.num, 18.8 * this.num, 6.0 * this.num, 2.3 * this.num
            ]
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' °C'
              }
            },
            data: [2.0 * this.num, 2.2 * this.num, 3.3 * this.num, 4.5 * this.num, 6.3 * this.num, 10.2 * this.num,
              20.3 * this.num, 23.4 * this.num, 23.0 * this.num, 16.5 * this.num, 12.0 * this.num, 6.2 * this.num]
          }
        ]
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      clearInterval(this.timer4)
      this.intBarChart()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    // clearInterval(this.timer)
    clearInterval(this.timer4)
  }
}
</script>
