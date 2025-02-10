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
      }
    },
    methods: {
      updateData (data,unit,type,untils) {
        if(this.dom!=null){
          this.dom.clear()
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        var array = Object.values(data.reduce((res, item) => {
            res[item.name] ? res[item.name].push(item) : res[item.name] = [item];
            return res;
        }, {}));
        let xAxisData=array[0].map(_ => _.time)
        let option = {
          xAxis: {
            name: untils==undefined?'':untils[1],
            nameLocation:'middle',
            nameTextStyle: {
              color: '#fff',
              padding:10,
            },
            type: 'category',
            data: xAxisData,
            axisLabel: {
              color: '#fff',
              interval:'auto', 
              rotate:38,
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
            // top: 20,
            right: 20,
            left:60,
          },
          yAxis: {
            name: untils==undefined?'':untils[0],
            type: 'value',
            axisTick: {
              show: false
            },
            // name:type==3||type==4||type==5?unit:'',
            nameTextStyle:{
              color:'#fff',
            },
            splitNumber:3,
            axisLabel: {
              color: '#fff',
              formatter: function (value, index) {
                return value + (type!==3&&type!==4&&type!==5?unit:'');
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
          legend:{
            data:[],
            top:'bottom',
            textStyle:{
                color:'#fff'
            },
            show: untils==undefined?true:false,
          },
          series: []
        }
        if(type!==1){
            option.xAxis.axisLabel.rotate=0
        }
        if(type==3){
          option.legend.show=false
          option.grid.bottom=30
        }
        for(let i in array){
            let seriesData = array[i].map(_ => _.value)
            option.legend.data.push(array[i][0].name)
            let obj={
                name: array[i][0].name,
                type: 'line',
                data: seriesData,
                smooth:type!==3?true:false,
                tooltip: {
                    formatter: function (value) {
                        return value + unit;
                    }
                },
            }
            if(type==1){
              obj.areaStyle={}
            }
            if(type==2||type==5){
                obj.symbol='none'
            }
            if(type==3){
              obj.itemStyle = {
                normal : {
                    lineStyle:{
                        width:3,//折线宽度
                    },
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 1,
                        color: '#508ff6' // 0% 处的颜色
                    }, {
                        offset: 0,
                        color: '#2c137a' // 100% 处的颜色
                    }], false),
                    opacity: 0.4
                }
              }
            }
            option.series.push(obj)
        }
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
  