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
        let salvProMax = [seriesData[0]]
        let option = {
          yAxis: {
            type: 'category',
            inverse: true,
            data: xAxisData,
            axisLabel: {
                show: true,
	            textStyle: {
	                color: '#fff'
	            },
            },
            splitLine: {
	            show: false
	        },
	        axisTick: {
	            show: false
	        },
	        axisLine: {
	            show: false
	        },
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor:'rgba(50,50,50,0.7)',
            borderColor:'rgba(50,50,50,0.7)',
            textStyle:{
              color:"#fff"
            },
            formatter: function(params) {
	            return params[0].name  + ' : ' + params[0].value
	          }
          },
          grid: { // 让图表占满容器
            left: '2%',
	        right: '2%',
	        bottom: '-6%',
	        top: '8%',
            containLabel: true
          },
          xAxis: {
            show: false,
	        type: 'value'
          },
          series: [
          {
	            name: '背景',
	            type: 'bar',
	            barWidth: 10,
	            barGap: '-100%',
	            data: salvProMax,
	            itemStyle: {
	                normal: {
	                    color: 'rgba(24,31,68,1)',
	                    barBorderRadius: 30,
	                }
	            },
	        },{
                name:'值',
                data: seriesData,
                type: 'bar',
                barWidth: 15,
                label:{
                    show:true,
                    position: 'outside',
                    borderRadius:10,
                    color:'#fff',
                },
                itemStyle: {
                    borderRadius:15, // 重点
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0,  [
                    { offset: 0, color: '#00EFFD' },
                    { offset: 1, color: '#085DE1' }
                    ])
                    
                },
                emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0,  [
                        { offset: 0, color: '#085DE1' },
                        { offset: 1, color: '#00EFFD' }
                    ])
                }
                },
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
  