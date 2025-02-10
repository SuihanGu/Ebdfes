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
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null,
      barRaceData: null,
      xAxisData: null
    }
  },
  mounted () {
    clearInterval(this.timer2)
    this.$nextTick(() => {
      this.xAxisData = Object.keys(this.value)
      this.barRaceData = Object.values(this.value)
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
      var option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          axisLabel: {
            color: '#fff'
          },
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: this.xAxisData.length - 1 // only the largest 3 bars will be displayed
        },
        yAxis: {
          max: 'dataMax',
          axisLabel: {
            color: '#fff'
          }
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        series: [
          {
            realtimeSort: true,
            name: this.text,
            type: 'bar',
            data: this.barRaceData,
            label: {
              show: true,
              position: 'top',
              valueAnimation: true,
              color: '#fff'
            },
            barWidth: 40, // 柱图宽度
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#2d8cf0' },
                { offset: 1, color: '#2d8cf0' }
              ]),
              opacity: 0.85,
              barBorderRadius: 5,
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#73c0de',
              shadowColor: '#5470c6',
              shadowBlur: 3

            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2d8cf0' },
                  { offset: 0.7, color: '#2d8cf0' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            }
          }
        ],
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
          }
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
      this.timer2 = setInterval(() => {
        this.run()
      }, 3000)
    },
    run () {
      for (var i = 0; i < this.barRaceData.length; ++i) {
        if (Math.random() > 0.9) {
          this.barRaceData[i] += Math.round(Math.random() * 2000)
        } else {
          this.barRaceData[i] += Math.round(Math.random() * 2000)
        }
      }
      this.dom.setOption({
        series: [
          {
            type: 'bar',
            realtimeSort: true,
            data: this.barRaceData
          }
        ]
      })
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    clearInterval(this.timer2)
  }
}
</script>
