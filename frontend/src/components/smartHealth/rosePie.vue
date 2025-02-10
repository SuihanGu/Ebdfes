<template>
    <div ref="dom" class="charts chart-bar"></div>
  </template>
  
  <script>
  import echarts from 'echarts'
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartBar',
    data () {
      return {
        dom: null,
      }
    },
    methods: {
      updateData (data) {
        let that = this
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                backgroundColor: '#6a7985'
                }
            },
          },
          grid: { // 让图表占满容器
            top: 20,
            right: 20,
            bottom: 30
          },
          series: [{
            data: data,
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
          }]
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
        setTimeout(()=>{
          this.resize()
        },400)
        // this.timer = setTimeout(()=>{
        //   this.$emit("getzzData");
        // },1000)
      },
      resize () {
        if (this.dom != null) {
          this.dom.resize()
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
  
      })
    },
    beforeDestroy () {
      off(window, 'resize', this.resize)
      clearTimeout(this.timer)
    }
  }
  </script>
  