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
    initBarRace (data, type) {
      if (this.timerline2 != null) {
        clearInterval(this.timerline2)
      }
      var option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center',
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
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
          bottom: '15%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [],
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          }
        ]
      }
      if (type == 'lines3') {
        option.legend = {
          type: 'scroll',
          orient: 'vertical',
          left: 'left',
          right: 20,
          top: 20,
          bottom: 20,
          data: []
        }
        option.grid.left = '10%'
      }
      let seriesData = []
      // let drData = []
      for (let i in data) {
        let drData = []
        for (let j in data[i]) {
          let typeFiled=data[i][j].typeFiled
          seriesData.push(data[i][j].rate * 1)
          drData.push(data[i][j][typeFiled] * 1)
        }
        option.series.push(
          {
            name: i,
            type: 'line',
            data: drData
          }
        )
        if (type == 'lines3') {
          option.legend.data.push(i)
        }
        // drData.push(data[i].dr*1)
      }
      let newArr = [...new Set(seriesData)]
      option.xAxis = {
        type: 'category',
        boundaryGap: false,
        data: newArr,
        splitLine: {
          show: false // 不显示坐标轴刻度线
        }
      }

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)

      this.dom.on('legendselectchanged', function (params) {
        var selected = params.selected
        var setiesName = params.name
      })
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
    },
    // 清除图层
    delLayer () {
      if (this.dom != null) {
        this.dom.dispose()
      }
      clearInterval(this.timerline2)
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    clearInterval(this.timerline2)
  }
}
</script>
