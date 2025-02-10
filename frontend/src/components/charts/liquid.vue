
<template>
    <div style="width:100%%;height:100%;display:flex;">
        <div ref="dom0" class="charts chart-bar" style="width:25%;height:100%"></div>
        <div ref="dom1" class="charts chart-bar" style="width:25%;height:100%"></div>
        <div ref="dom2" class="charts chart-bar" style="width:25%;height:100%"></div>
        <div ref="dom3" class="charts chart-bar" style="width:25%;height:100%"></div>
    </div>
  </template>
  
  <script>
  import echarts from 'echarts'
  import 'echarts-liquidfill';
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
import { compare } from '@/untils/untilsPublic'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartBar',
    data () {
      return {
        dom0: null,
        dom1: null,
        dom2: null,
        dom3: null,
        colorList: ["#408CFF","#FF7AF3","#19be6b","#ff9900",],
      }
    },
    methods: {
      updateData (data) {
        if(this.dom0!=null){
          this.dom0.clear()
          this.dom1.clear()
          this.dom2.clear()
          this.dom3.clear()
        }
        let that = this
        for(let i in data){
            let option = {
                series: [
                    {
                        type: 'liquidFill',
                        shape: 'circle',
                        radius: '80%',
                        center: ['50%', '50%'],
                        data: [data[i].value/100],
                        // 球体配置
                        outline: {
                        borderDistance: 0,
                        itemStyle: {
                            borderWidth: 2,
                            borderColor: '#3dfff6',
                            shadowBlur: 20,
                            shadowColor: '#12786f'
                        }
                        },
                        color: ['rgba(50, 255, 238, .6)', 'rgba(154, 255, 247, .6)'],
                        backgroundStyle: {
                            color: 'transparent',
                        },

                        label: {
                        show: true,
                        textStyle: {
                            color: '#12786f',
                            insideColor: '#12786f',
                            fontSize: 16
                        }
                        },
                        label: {
                        show: true,
                        textStyle: {
                            color: '#12786f',
                            insideColor: '#12786f',
                            fontSize: 18
                        },
                        formatter: params => {
                            return `${(params.value * 100).toFixed(0)}%\n {a|${data[i].name}}`
                        },
                        rich: {
                            a: {
                            fontSize: 20,
                            }
                        }
                        }
                    },
                ]
            }

            this['dom'+i] = echarts.init(this.$refs['dom'+i], 'tdTheme')
            this['dom'+i].setOption(option)
        }
        
        on(window, 'resize', this.resize)
        setTimeout(()=>{
          this.resize()
        },400)
      },
      resize () {
        if (this.dom0 != null) {
          this.dom0.resize()
          this.dom1.resize()
          this.dom2.resize()
          this.dom3.resize()

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