<template>
    <div ref="dom" class="charts chart-bar"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts5'
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
      updateData (data,lineData,xlabel,ylabel) {
        let that = this
        if(that.dom!=null){
          that.dom.clear()
        }
        let option = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:data.xData,
            axisLabel: {
              color: '#858A94',
            },
            axisTick: {
              show: true
            },
            axisLine: {
              show: true
            },
            name:xlabel,
            nameLocation:'center',
            nameTextStyle:{
              color:'#38FCBE',
              padding:10,
            },
            splitNumber:3,
            splitLine: { show: false }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor:'rgba(50,50,50,0.7)',
            borderColor:'rgba(50,50,50,0.7)',
            textStyle:{
              color:"#fff"
            },
          },
          grid: { // 让图表占满容器
            top: 20,
            right: 10,
            bottom: 55
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            name:ylabel,
            nameLocation:'center',
            nameTextStyle:{
              color:'#38FCBE',
              padding:10,
            },
            axisLabel: {
              color: '#858A94',
            },
            axisLine:{
                lineStyle:{
                    color:'#5D6C84'
                }
            },
            splitLine: { 
                lineStyle:{
                    color:'#5D6C84'
                }
            }
          },
          series: [{
            markLine: {
                data: [
                    { 
                        yAxis: lineData,
                        lineStyle:{
                            color:"#ed4014"
                        },
                        label:{
                            distance:[-150,-50],
                            formatter: function (params){
                                return '均值: '+lineData+'亿元'
                            }
                        }
                    }
                ]
            },
            name:ylabel+'：',
            data: data.list,
            type: 'line',
            lineStyle:{
                color:"#49F0FF",
                width:2,
            },
            symbol: 'none',
            smooth: false,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(73, 240, 255,1)' },
                    { offset: 1, color: 'rgba(73, 240, 255,0)' }
                ])
            },
          }]
        }
        if(data.list.length>80){
            option.dataZoom=[
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 5,
                    height:15
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 0,
                    end: 5,
                    height:15
                }
            ]
            option.grid.bottom=75
        }
        that.dom = echarts.init(that.$refs.dom, 'tdTheme')
        that.dom.setOption(option)
        on(window, 'resize', that.resize)
        setTimeout(()=>{
            that.resize()
        },400)
      },
      resize () {
        if (this.dom != null) {
          this.dom.resize()
        }
        this.$emit('resize')
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
  