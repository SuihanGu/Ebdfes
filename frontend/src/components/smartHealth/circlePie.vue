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
      updateData (data) {
        if(this.dom!=null){
          this.dom.clear()
        }
        let that = this
        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                shadowBlur: 0,
                shadowColor: '#203665'
            }
        }
        let option = {
            series: [
                // {
                //     name: '第一个圆环',
                //     type: 'pie',
                //     clockWise: false,
                //     radius: [45, 55],
                //     itemStyle: dataStyle,
                //     hoverAnimation: false,
                //     center: ['15%', '50%'],
                //     data: [{
                //         value: 25,
                //         label: {
                //             normal: {
                //                 rich: {
                //                     a: {
                //                         color: '#3a7ad5',
                //                         align: 'center',
                //                         fontSize: 14,
                //                         fontWeight: "bold"
                //                     },
                //                     b: {
                //                         color: '#fff',
                //                         align: 'center',
                //                         fontSize: 12
                //                     }
                //                 },
                //                 formatter: function(params){
                //                     return "{b|饮用水质}\n\n"+"{a|"+params.value+"个}"+"\n\n{b|增长2%}";
                //                 },
                //                 position: 'center',
                //                 show: true,
                //                 textStyle: {
                //                     fontSize: '12',
                //                     fontWeight: 'normal',
                //                     color: '#fff'
                //                 }
                //             }
                //         },
                //         itemStyle: {
                //             normal: {
                //                 color: '#2c6cc4',
                //                 shadowColor: '#2c6cc4',
                //                 shadowBlur: 0
                //             }
                //         }
                //     }, {
                //         value: 75,
                //         name: 'invisible',
                //         itemStyle: {
                //             normal: {
                //                 color: '#24375c'
                //             },
                //             emphasis: {
                //                 color: '#24375c'
                //             }
                //         }
                //     }]
                // }, {
                //     name: '第二个圆环',
                //     type: 'pie',
                //     clockWise: false,
                //     radius: [45, 55],
                //     itemStyle: dataStyle,
                //     hoverAnimation: false,
                //     center: ['50%', '50%'],
                //     data: [{
                //         value: 50,
                //         label: {
                //             normal: {
                //                 rich: {
                //                     a: {
                //                         color: '#d03e93',
                //                         align: 'center',
                //                         fontSize: 14,
                //                         fontWeight: "bold"
                //                     },
                //                     b: {
                //                         color: '#fff',
                //                         align: 'center',
                //                         fontSize: 12
                //                     }
                //                 },
                //                 formatter: function(params){
                //                     return "{b|生活用水}\n\n"+"{a|"+params.value+"个}"+"\n\n{b|增长2%}";
                //                 },
                //                 position: 'center',
                //                 show: true,
                //                 textStyle: {
                //                     fontSize: '12',
                //                     fontWeight: 'normal',
                //                     color: '#fff'
                //                 }
                //             }
                //         },
                //         itemStyle: {
                //             normal: {
                //                 color: '#ef45ac',
                //                 shadowColor: '#ef45ac',
                //                 shadowBlur: 0
                //             }
                //         }
                //     }, {
                //         value: 50,
                //         name: 'invisible',
                //         itemStyle: {
                //             normal: {
                //                 color: '#412a4e'
                //             },
                //             emphasis: {
                //                 color: '#412a4e'
                //             }
                //         }
                //     }]
                // }, {
                //     name: '第三个圆环',
                //     type: 'pie',
                //     clockWise: false,
                //     radius: [45, 55],
                //     itemStyle: dataStyle,
                //     hoverAnimation: false,
                //     center: ['85%', '50%'],
                //     data: [{
                //         value: 75,
                //         label: {
                //             normal: {
                //                 rich: {
                //                     a: {
                //                         color: '#603dd0',
                //                         align: 'center',
                //                         fontSize: 14,
                //                         fontWeight: "bold"
                //                     },
                //                     b: {
                //                         color: '#fff',
                //                         align: 'center',
                //                         fontSize: 12
                //                     }
                //                 },
                //                 formatter: function(params){
                //                     return "{b|自来水}\n\n"+"{a|"+params.value+"个}"+"\n\n{b|增长2%}";
                //                 },
                //                 position: 'center',
                //                 show: true,
                //                 textStyle: {
                //                     fontSize: '12',
                //                     fontWeight: 'normal',
                //                     color: '#fff'
                //                 }
                //             }
                //         },
                //         itemStyle: {
                //             normal: {
                //                 color: '#613fd1',
                //                 shadowColor: '#613fd1',
                //                 shadowBlur: 0
                //             }
                //         }
                //     }, {
                //         value: 25,
                //         name: 'invisible',
                //         itemStyle: {
                //             normal: {
                //                 color: '#453284'
                //             },
                //             emphasis: {
                //                 color: '#453284'
                //             }
                //         }
                //     }]
	            // }
            ]
        }
        for(let i in data){
            let obj = {
                name: 'circle'+i,
                type: 'pie',
                clockWise: false,
                radius: [45, 55],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: [(15+35*i)+'%', '50%'],
                data: [
                    {
                        value: data[i].value,
                        label: {
                            normal: {
                                rich: {
                                    a: {
                                        color: that.colorList[i],
                                        align: 'center',
                                        fontSize: 14,
                                        fontWeight: "bold"
                                    },
                                    b: {
                                        color: '#fff',
                                        align: 'center',
                                        fontSize: 12
                                    }
                                },
                                formatter: function(params){
                                    return `{b|${data[i].name}}\n\n{a|${data[i].num}个}\n\n{b|增长${data[i].value}%}`;
                                },
                                position: 'center',
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'normal',
                                    color: '#fff'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: that.colorList[i],
                                shadowColor: that.colorList[i],
                                shadowBlur: 0
                            }
                        }
                    }, {
                        value: 100-data[i].value,
                        name: 'invisible',
                        itemStyle: {
                            normal: {
                                color: '#24375c'
                            },
                            emphasis: {
                                color: '#24375c'
                            }
                        }
                    }
                ]
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
  