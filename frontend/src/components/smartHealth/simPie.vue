<template>
    <div ref="dom" class="charts chart-bar"></div>
  </template>
  
  <script>
  import echarts from 'echarts'
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
  echarts.registerTheme('tdTheme', tdTheme)
import moment from 'moment'
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
        let total=0;
        for(let i in data){
            total=total+data[i].value
        }
        let option = {
            title: {
                subtext: `设备总数:${total}个\r\r\r统计时间:${moment().format('YYYY-MM-DD')}`,
                x: 'center',
                subtextStyle: {
                    color: '#fff'
                }
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
            legend: {
                top:'bottom',
                formatter: function (name) {
                    let num=data.filter(item => item.name == name)[0].value
                    return name+'：'+num;
                }
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
                radius: '50%',
                label: {
                    formatter: '{b}:{d}%',
                    color:'#fff'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
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
  