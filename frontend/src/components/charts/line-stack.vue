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
  props: {
    value: Array,
    xAxisValue: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null,
      barRaceData: [],
      xAxisData: null,
      yAxisData: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      clearInterval(this.timer3)
      let arr = this.value.map(_ => _.name)
      this.yAxisData = arr.filter(function (item, index) {
        return arr.indexOf(item) === index // 因为indexOf 只能查找到第一个
      })
      let arr2 = this.value.map(_ => _.text)
      this.xAxisData = arr2.filter(function (item, index) {
        return arr2.indexOf(item) === index // 因为indexOf 只能查找到第一个
      })
      for (let i in this.yAxisData) {
        let arr3 = this.value.map((item) => {
          if (this.yAxisData[i] == item.name) {
            return item.value
          }
        }).filter(function (op, index) {
          return op != undefined // 因为indexOf 只能查找到第一个
        })
        this.barRaceData.push(arr3)
      }
      this.initBarRace()
    })
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    initBarRace () {
      let seriesData = []
      for (let i in this.barRaceData) {
        seriesData.push({
          name: this.yAxisData[i],
          type: 'line',
          stack: 'Total',
          data: this.barRaceData[i],
          lineStyle: {
            normal: {
              width: 4
            }
          },
          animationDelay: function (idx) {
            return idx * 10
          }
        })
      }
      var option = {
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
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData,
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
        grid: {
          top: '15%',
          left: '10%',
          right: '3%',
          bottom: '1%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: seriesData,
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff'
          },
          data: this.yAxisData
        },
        animationDurationUpdate: 3000
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      this.timer3 = setInterval(() => {
        this.run()
      }, 3000)
    },
    run () {
      for (var i = 0; i < this.barRaceData.length; ++i) {
        for (let j in this.barRaceData[i]) {
          this.barRaceData[i][j] += Math.round(Math.random() * 200)
        }
      }
      let seriesData = []
      for (let i in this.barRaceData) {
        seriesData.push({
          name: this.yAxisData[i],
          type: 'line',
          stack: 'Total',
          data: this.barRaceData[i],
          lineStyle: {
            normal: {
              width: 4
            }
          }
        })
      }
      this.dom.setOption({
        series: seriesData
      })
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    clearInterval(this.timer3)
  }
}
</script>
