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
            type: 'value',
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
                        xAxis: lineData,
                        lineStyle:{
                            color:"#ed4014"
                        },
                        label:{
                            distance:[-150,-50],
                            formatter: function (params){
                                return '均值: '+lineData+'人'
                            }
                        }
                    }
                ]
            },
            name:ylabel+'：',
            data: data,
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                //通常情况下：
                normal:{  
                    borderRadius: [5, 5, 0, 0] , // 重点
                    color: function (params){
                      let color=params.dataIndex%2==0?new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 1, color: 'rgba(255, 170, 69,0.95)' },
                            { offset: 0, color: 'rgba(106, 60, 231,0.45)' }
                        ]):new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00EFFD' },
                            { offset: 1, color: '#085DE1' }
                        ])
                      return color;
                    }
                },
                //鼠标悬停时：
                emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#085DE1' },
                    { offset: 1, color: '#00EFFD' }
                ])
              }
            },
          }]
        }
        if(data.length>80){
            option.dataZoom=[
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 40,
                    height:15
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 0,
                    end: 40,
                    height:15
                }
            ]
            option.grid.bottom=75
        }
        that.dom = echarts.init(that.$refs.dom, 'tdTheme')
        that.dom.setOption(option)
        on(window, 'resize', that.resize)
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
  