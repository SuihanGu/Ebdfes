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
      let seriesData = []
      let drData = []
      for (let i in data) {
        seriesData.push(data[i].ep * 1)
        drData.push(data[i].dr * 1)
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
          data: seriesData,
          splitLine: {
            show: false // 不显示坐标轴刻度线
          }
        },
        yAxis: {
          type: 'value',
          name: '万元'
          // splitLine: {
          //   show: false // 不显示坐标轴刻度线
          // }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '最大超越概率损失',
            type: 'line',
            data: drData
          }
        ],
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        legend: {
          data: ['最大超越概率损失']
        }

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
