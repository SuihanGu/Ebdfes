<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>
  
  <script>
  import echarts from 'echarts'
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
import { compare } from '@/untils/untilsPublic'
import { flow } from '@antv/l7'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartBar',
    data () {
      return {
        dom: null,
      }
    },
    methods: {
      updateData (data,unit,type) {
        if(this.dom!=null){
          this.dom.clear()
        }
        var array = Object.values(data.reduce((res, item) => {
            res[item.name] ? res[item.name].push(item) : res[item.name] = [item];
            return res;
        }, {}));
        let xAxisData=array[0].map(_ => _.time)
        let that = this
        let xAxis={
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
        }
        let yAxis = {
          type: 'value',
          axisTick: {
            show: false
          },
          name:type=='y'?unit:'',
          // nameLocation:'end',
          nameTextStyle:{
            color:'#fff',
            padding:8,
          },
          splitNumber:3,
          axisLabel: {
            color: '#fff',
            formatter: function (value, index) {
              return value +  (type!=='y'?unit:'');
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
        let option = {
          xAxis:null,
          yAxis:null,
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
            left:60,
          },
          legend:{
            data:[],
            top:'bottom',
            textStyle:{
                color:'#fff'
            }
          },
          series: []
        }
        if(type=='none'){
          xAxis.axisLabel.rotate=0
        }
        if(type=='y'){
          option.xAxis=yAxis
          option.yAxis=xAxis
        }else{
          option.xAxis=xAxis
          option.yAxis=yAxis
        }
        for(let i in array){
            let seriesData = array[i].map(_ => _.value)
            option.legend.data.push(array[i][0].name)
            let obj={
                name: array[i][0].name,
                type: 'bar',
                label: {
                  show: type=='y'?true:false
                },
                data: seriesData,
                tooltip: {
                    formatter: function (value) {
                        return value + (type!=='y'?unit:'');
                    }
                },
            }
            if(type!=='none'){
              if(type!='y'){
                obj.markLine={
                  data: [{ type: 'average', name: 'Avg' }]
                }
              }else{
                obj.stack='total'
              }
            }
            
            option.series.push(obj)
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
  