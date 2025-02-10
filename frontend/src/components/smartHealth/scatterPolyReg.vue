<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>
  
  <script>
  import * as echarts from 'echarts5'
  import ecStat from 'echarts-stat'
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
  echarts.registerTheme('tdTheme', tdTheme)
  echarts.registerTransform(ecStat.transform.regression)
  export default {
    name: 'ChartBar',
    data () {
      return {
        dom: null,
      }
    },
    methods: {
      updateData (data2,min,max1,max2) {
        if(this.dom!=null){
          this.dom.clear()
        }
        max1=(max1.toFixed(3))*1
        max2=(max2.toFixed(3))*1
        // let seriesData = data1.map(_ => _.value)
        let option = {
            dataset: [
                {
                    source: data2
                },
                {
                    transform: {
                        type: 'ecStat:regression',
                        config: { method: 'polynomial', order: 3 }
                    }
                }
            ],
            xAxis: {
                type: 'value',
                min,
                max:max2,
                axisLabel: {
                    color: '#fff',
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: { show: false }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor:'rgba(50,50,50,0.7)',
                borderColor:'rgba(50,50,50,0.7)',
                textStyle:{
                    color:"#fff"
                },
            },
            grid: { // 让图表占满容器
                top: 20,
                right: 20,
                bottom: 30
            },
            yAxis: {
                type: 'value',
                min,
                max:max1,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#fff',
                },
                axisLine:{
                    lineStyle:{
                        color:'#172C5A'
                    }
                },
                splitLine: { 
                    lineStyle:{
                        color:'#172C5A',
                        type: 'dashed'
                    }
                },
            },
            series: [
                {
                    name: '最小最大值回归分析',
                    type: 'scatter',
                    itemStyle: {
                      color: '#a90000'
                    },
                    tooltip:{
                      formatter: function(params) {
                        return '[x,y]: '+'['+params.value[0]+','+params.value[1]+']'
                      }
                    }
                },{
                    name: '最小最大值回归分析',
                    type: 'line',
                    smooth: true,
                    datasetIndex: 1,
                    symbolSize: 0.1,
                    symbol: 'circle',
                    label: { show: true, fontSize: 16 },
                    labelLayout: { dx: -20 },
                    encode: { label: 2, tooltip: 1 },
                    tooltip:{
                      formatter: function(params) {
                        return '最小最大值回归分析: '+params.value[1]
                      }
                    }
                }
            ]
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
        setTimeout(()=>{
          this.resize()
        },400)
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
  