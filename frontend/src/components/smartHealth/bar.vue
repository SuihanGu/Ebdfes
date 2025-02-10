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
        colorList: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
      }
    },
    methods: {
      updateData (data,unit) {
        if(this.dom!=null){
          this.dom.clear()
        }
        let xAxisData=data.map(_ => _.time)
        let that = this
        let seriesData = data.map(_ => _.value)
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
            right: 20,
            bottom: 30
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            splitNumber:3,
            axisLabel: {
              color: '#fff',
              formatter: function (value, index) {
                return value + unit;
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
          },
          series: [{
            data: seriesData,
            type: 'bar',
            itemStyle: {
                color: function (param) {
                    if(param.dataIndex>that.colorList.length-1){
                        return that.colorList[param.dataIndex%(that.colorList.length-1)];
                    }else{
                        return that.colorList[param.dataIndex];
                    }
                }
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            tooltip: {
                formatter: function (value) {
                    return value + unit;
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
  