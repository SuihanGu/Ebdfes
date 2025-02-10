<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>
  
  <script>
  import * as echarts from 'echarts5'
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
        let seriesdata=[]
        for(let i in array){
          for(let j in array[i]){
            let arr = [j*1,i*1,array[i][j].value]
            seriesdata.push(arr)
          }
        }
        let res = new Map()
        let yAxisData=data.map(_ => _.name).filter((item) => !res.has(item) && res.set(item, 1))
        let xAxisData=data.map(_ => _.time).filter((item) => !res.has(item) && res.set(item, 1))
        let that = this
        let option = {
          grid: { // 让图表占满容器
            top: 20,
            right: 50,
            left:60,
            bottom:30
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                color: '#fff',
                interval:0, 
                rotate:38 
            },
          },
          yAxis: {
            type: 'category',
            data: yAxisData,
            axisLabel: {
                color: '#fff',
            },
            splitArea: {
              show: true
            }
          },
          visualMap: {
            min: -1,
            max: 1,
            show:false,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            color:['#19be6b','#c5c8ce','#ed4014'],
          },
          series: [
            {
              name: '',
              type: 'heatmap',
              data: seriesdata,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
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
  