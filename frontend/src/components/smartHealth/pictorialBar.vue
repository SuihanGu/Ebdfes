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
      updateData (data,ylabel) {
        if(this.dom!=null){
          this.dom.clear()
        }
        let xAxisData=data.map(_ => _.name)
        let that = this
        let seriesData = data.map(_ => _.value)
        let option = {
          xAxis: {
            type: 'category',
            data: xAxisData,
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
            trigger: 'axis',
            backgroundColor:'rgba(50,50,50,0.7)',
            borderColor:'rgba(50,50,50,0.7)',
            textStyle:{
              color:"#fff"
            },
          },
          grid: { // 让图表占满容器
            // top: 20,
            right: 20,
            bottom: 30
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            name:ylabel,
            nameLocation:'center',
            nameTextStyle:{
              color:'#fff',
              padding:8,
            },
            splitNumber:3,
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
                    color:'#172C5A'
                }
            }
          },
          series: [{
            data: seriesData,
            type: 'bar',
            barWidth: 30,
            label:{
                show:true,
                distance:20,
                position: 'outside',
                padding:[4,16],
                borderRadius:10,
                color:'#fff',
                backgroundColor:'rgba(0, 233, 234,0.25)'
            },
            labelLine:{
                show:true,
                lineStyle:{
                    color:'rgba(0, 233, 234,0.45)',
                    width:1,
                    type:'solid',
                }
            },
            itemStyle: {
                borderRadius:15, // 重点
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00EFFD' },
                  { offset: 1, color: '#085DE1' }
                ])
                
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
  