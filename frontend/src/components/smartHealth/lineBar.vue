<template>
    <div ref="dom" class="charts chart-bar"></div>
  </template>
  
  <script>
  import echarts from 'echarts'
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
import { compare } from '@/untils/untilsPublic'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartBar',
    data () {
      return {
        dom: null,
        colorList: ['#408CFF', '#FF7AF3','#25D096'],
      }
    },
    methods: {
      updateData (data,unit) {
        if(this.dom!=null){
          this.dom.clear()
        }
        var array = Object.values(data.reduce((res, item) => {
            res[item.name] ? res[item.name].push(item) : res[item.name] = [item];
            return res;
        }, {}));
        let xAxisData=array[0].map(_ => _.time)
        let that = this
        let option = {
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                color: '#fff',
                interval:0, 
                rotate:38 
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
            axisPointer: {
                type: 'cross',
                label: {
                backgroundColor: '#6a7985'
                }
            },
          },
          grid: { // 让图表占满容器
            top: 20,
            right: 50,
          },
          yAxis: [],
          legend:{
            data:[],
            top:'bottom',
            textStyle:{
                color:'#fff'
            }
          },
          series: []
        }
        for(let i in array){
            let seriesData = array[i].map(_ => _.value)
            option.legend.data.push(array[i][0].name)
            let obj2 = {
                type: 'value',
                name:array[i][0].name,
                axisTick: {
                    show: false
                },
                nameTextStyle:{
                    color: that.colorList[i],
                },
                nameLocation:'center',
                splitNumber:3,
                axisLabel: {
                    color: that.colorList[i],
                    formatter: function (value, index) {
                        return value + unit[i];
                    }
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
            }
            option.yAxis.push(obj2)
            let obj={
                name: array[i][0].name,
                type: i==0?'bar':'line',
                data: seriesData,
                itemStyle: {
                    color: that.colorList[i]
                },
                yAxisIndex: i,
                tooltip: {
                    formatter: function (value) {
                        return value + unit[i];
                    }
                },
            }
            option.series.push(obj)
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
  