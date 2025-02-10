<template>
    <div ref="dom" class="charts chart-bar"></div>
  </template>
  
  <script>
import * as echarts from 'echarts5'
import ecStat from 'echarts-stat'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
//   echarts.registerTheme('tdTheme', tdTheme)
echarts.registerTransform(ecStat.transform.histogram);
  export default {
    name: 'ChartBar',
    data () {
      return {
        dom: null,
      }
    },
    methods: {
      updateData (list,lineData,xlabel,ylabel) {
        let that = this
        if(that.dom!=null){
          that.dom.clear()
        }
        var bins = ecStat.histogram(list);
        var min = Infinity;
        var max = -Infinity;
        var data = echarts.util.map(bins.data, function (item, index) {
            // 左刻度
            var x0 = bins.bins[index].x0;
            // 右刻度
            var x1 = bins.bins[index].x1;
            // 获得数据集中最值
            min = Math.min(min, x0);
            max = Math.max(max, x1);
            // item[0]代表刻度的中间值，item[1]代表出现的次数
            return [x0, x1, item[1]];
        });
          // 自定义渲染效果
        function renderItem(params, api) {
            // 这个根据自己的需求适当调节
            var yValue = api.value(2);
            var start = api.coord([api.value(0), yValue]);
            var size = api.size([api.value(1) - api.value(0), yValue]);
            var style = api.style();

            return {
                // 矩形及配置
                type: 'rect',
                shape: {
                    x: start[0] + 1,
                    y: start[1],
                    width: size[0] - 2,
                    height: size[1]
                },
                style: style
            };
        }
        let option = {
          xAxis: [
            {
              min: 0,
              max: max,
              gridIndex: 0,
              axisLabel: {
                  color: '#858A94',
              },
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              name:xlabel,
              nameLocation:'center',
              nameTextStyle:{
                  color:'#38FCBE',
                  padding:10,
              },
              splitNumber:3,
              splitLine: { show: false }
            }
          ],
          tooltip: {
              trigger: 'axis',
              backgroundColor:'rgba(50,50,50,0.7)',
              borderColor:'rgba(50,50,50,0.7)',
              textStyle:{
                  color:"#fff"
              },
              formatter: function (params){
                return params[0].value[0]+'~'+params[0].value[1]+'<br />'+params[0].seriesName+params[0].value[2]/10
              }
          },
          grid: { // 让图表占满容器
              top: 20,
              right: 10,
              bottom: 60
          },
          yAxis: [{
              gridIndex: 0,
              axisTick: {
                  show: false
              },
              name:ylabel,
              nameLocation:'center',
              nameTextStyle:{
                  color:'#38FCBE',
                  padding:10,
              },
              splitNumber:3,
              axisLabel: {
                color: '#858A94',
                formatter: function (value){
                  return value/10
                }
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
          }],
          series: [{
            markLine: {
                data: [
                    { 
                        xAxis: lineData,
                        lineStyle:{
                            color:"#ed4014"
                        },
                        label:{
                            distance:[50,-50],
                            formatter: function (params){
                                return '均值: '+lineData+'亿元'
                            }
                        }
                    }
                ]
            },
            name:ylabel+'：',
            type: 'custom',
            renderItem: renderItem,
            encode: {
                // 表示将data中的data[0]和data[1]映射到x轴
                x: [0, 1],
                // 表示将data中的data[2]映射到y轴
                y: 2,
                // 表示将data中的data[2]映射到tooltip
                tooltip: 2,
                // 表示将data中的data[2]映射到label
                label: 2
            },
            data: data,
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              //通常情况下：
              normal:{  
                borderRadius: [5, 5, 0, 0] , // 重点
                opacity:0.95,
                color: function (params){
                  let color=params.dataIndex%2==0?new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: 'rgba(73, 240, 255,1)' },
                      { offset: 1, color: 'rgba(73, 240, 255,0.65)' },
                    ]):new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: 'rgba(14, 139, 255,1)' },
                      { offset: 1, color: 'rgba(14, 139, 255,0.65)' }
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
          }]
        }
        that.dom = echarts.init(that.$refs.dom, 'tdTheme')
        that.dom.setOption(option)
        on(window, 'resize', that.resize)
      },
      resize () {
        if (this.dom != null) {
          this.dom.setOption({
            grid: { // 让图表占满容器
                top: 20,
                right: 20,
                bottom: 60
            },
          })
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
  