<template>
    <div style="position: relative;">
        <div ref="dom" class="charts chart-bar" style="width: 100%;height:100%;"></div>
        <div class="layerBox1">
            <div class="layer" v-for="(item,i) in layerList"
            @click="changeLayer(item.val)" :key="i+'layer'"
            :class="layerAct==item.val ? 'layerAct':''">{{item.label}}</div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-gl'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import shaoguan from '@/untils/shaoguan' // 韶关市
import beijiang from '@/untils/beijiang' // 韶关市
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'hsMap',
  props: ['pointCenter', 'pointDataList', 'activeTab'],
  data () {
    return {
      dom: null,
      layerAct: 0,
      mapBoxMap: null,
      pointBox: {
        name: '点',
        type: 'scatter3D',
        coordinateSystem: 'mapbox',
        symbol: 'pin',
        symbolSize: 30,
        label: {},
        itemStyle: {
          normal: {
            color: '#F62157' // 标志颜色
          }
        },
        emphasis: {
          scale: true
        },
        // zlevel: 10,
        data: null
      },
      lineBox: {
        type: 'lines',
        coordinateSystem: 'bmap',
        data: [],
        polyline: true,
        lineStyle: {
          color: 'purple',
          opacity: 0.6,
          width: 1
        }
      },
      layerList: [],
      layerList1: [
        {
          label: '河道抢险',
          val: 0
        }, {
          label: '积水点位',
          val: 1
        }, {
          label: '水文站分布',
          val: 2
        }
      ], // 应急响应
      layerList2: [
        {
          label: '河流监测',
          val: 0
        }, {
          label: '实时降雨量',
          val: 1
        }
      ], // 实时监测
      layerList3: [
        {
          label: '河流监测',
          val: 0
        }, {
          label: '实时降雨量',
          val: 1
        }
      ]// 气象预警
    }
  },
  watch: {
  },
  mounted () {
    //   clearInterval(this.timer2)
    this.$nextTick(() => {
      switch (this.activeTab) {
        case 0:
          this.layerList = this.layerList1
          break
        case 1:
          this.layerList = this.layerList2
          break
        case 2:
          this.layerList = this.layerList3
          break
      }
      this.initBasicMap()
    })
  },
  methods: {
    resize () {
      if (this.dom != null) {
        this.dom.resize()
      }
    },
    changeLayer (cur) {
      let that = this
      switch (that.activeTab) {
        case 0:
          switch (cur) {
            case 0:
              that.dom.setOption({
                series: [
                  {
                    data: null
                  }
                ]
              })
              break
            case 1:
              for (let i in that.pointDataList) {
                that.pointDataList[i].value.push(that.pointDataList[i].riverVal)
                that.pointDataList[i].value.push(i)
              }
              that.dom.setOption({
                visualMap: {
                  inRange: {
                    color: [
                      '#80ffa5'
                    ]
                  }
                },
                series: [
                  {
                    type: 'bar3D',
                    shading: 'realistic',
                    coordinateSystem: 'mapbox',
                    barSize: 1,
                    silent: true,
                    data: that.pointDataList,
                    label: {
                      formatter: function (params) {
                        var index = params.value[3]
                        let ret = `${that.pointDataList[index].riverVal}mm`
                        return ret
                      },
                      position: 'top', //
                      distance: 0,
                      show: true,
                      textStyle: {
                        backgroundColor: 'rgba(0,0,0,0.65)', // 背景颜色
                        color: '#fff',
                        padding: 10,
                        borderRadius: [5, 5, 5, 5],
                        fontSize: 12
                      }
                    }
                  }
                ]
              })
              break
            case 2:
              for (let i in that.pointDataList) {
                that.pointDataList[i].value.push(2000)
                that.pointDataList[i].value.push(i)
              }
              that.dom.setOption({
                series: [
                  {
                    name: '点',
                    type: 'scatter3D',
                    coordinateSystem: 'mapbox',
                    symbol: 'pin',
                    symbolSize: 30,
                    label: {},
                    itemStyle: {
                      normal: {
                        color: '#F62157' // 标志颜色
                      }
                    },
                    emphasis: {
                      scale: true
                    },
                    // zlevel: 10,
                    data: that.pointDataList
                  }
                ]
              })
              break
          }
          break
        case 1:
          if (cur == 0) {
            for (let i in that.pointDataList) {
              that.pointDataList[i].value.push(2000)
              that.pointDataList[i].value.push(i)
            }
            that.dom.setOption({
              series: [
                {
                  data: that.pointDataList
                }
              ]
            })
          } else {
            that.dom.setOption({
              series: [
                {
                  data: null
                }
              ]
            })
          }
          break
        case 2:
          break
      }
      that.layerAct = cur
    },
    initBasicMap () {
      let that = this
      let mapData = [that.pointBox]
      switch (that.activeTab) {
        case 0:
          // for(let i in that.pointDataList){
          //     that.pointDataList[i].value.push(2000)
          //     that.pointDataList[i].value.push(i)
          // }
          // mapData[0].data = that.pointDataList
          break
        case 1:
          for (let i in that.pointDataList) {
            that.pointDataList[i].value.push(2000)
            that.pointDataList[i].value.push(i)
          }
          that.pointBox.data = that.pointDataList
          break
        case 2:
          for (let i in that.pointDataList) {
            that.pointDataList[i].value.push(2000)
            that.pointDataList[i].value.push(i)
          }
          mapData[0].data = that.pointDataList
          break
      }

      that.pointBox.label = {
        formatter: function (params) {
          var index = params.value[3]
          let ret = `河流水位：${that.pointDataList[index].riverVal}m\n\n流量：${that.pointDataList[index].riverll}m³/s`
          return ret
        },
        position: 'top', //
        distance: 0,
        show: true,
        textStyle: {
          backgroundColor: 'rgba(0,0,0,0.65)', // 背景颜色
          color: '#fff',
          padding: 10,
          borderRadius: [5, 5, 5, 5],
          fontSize: 12
        }
      }
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      var option = {
        mapbox: {
          center: that.pointCenter,
          zoom: 3,
          style: 'mapbox://styles/laijianying/cl8nrmu0b000515o6omf5p7wb',
          shading: 'realistic',
          light: {
            main: {
              intensity: 0.5,
              shadow: false
              // alpha: 10,
              // beta: -10
            },
            ambient: {
              intensity: 0.2
            },
            ambientCubemap: {
              // texture: './img_mapbox/sunlight.hdr',
              exposure: 1,
              diffuseIntensity: 0.5,
              specularIntensity: 2
            }
          },
          zlevel: 1
        },
        tooltip: {
          trigger: 'item'
        },
        series: mapData
      }
      that.dom = echarts.init(that.$refs.dom, 'tdTheme')
      that.dom.setOption(option)
      on(window, 'resize', that.resize)
      that.mapBoxMap = that.dom
        .getModel()
        .getComponent('mapbox3D')
        .getMapbox()
      var hoveredStateId = null

      that.mapBoxMap.on('load', () => {
        that.mapBoxMap.addSource('citymap', {
          type: 'geojson',
          data: shaoguan
        })
        that.mapBoxMap.addLayer(
          {
            id: 'layer_wheatNum2017',
            source: 'citymap',
            type: 'fill',
            layout: {
              // visibility: "none"
              visibility: 'visible'
            },
            paint: {
              'fill-color': '#2db7f5',
              // "fill-opacity": 0.1
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.75,
                0.45
              ]
            }
          },
          'waterway-label'
        )
        that.mapBoxMap.addLayer({
          'id': 'outline',
          'type': 'line',
          'source': 'citymap',
          'layout': {},
          'paint': {
            'line-color': '#a0cfff',
            'line-width': 3
          }
        })
        if (that.activeTab == 0) {
          that.mapBoxMap.addLayer({
            'id': 'beijiang',
            'type': 'line',
            'source': {
              'type': 'geojson',
              'data': beijiang
            },
            'layout': {
              'visibility': 'visible',
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#F7B74A',
              'line-width': 2
            }
          })
        }
        that.mapBoxMap.on('mouseenter', 'layer_wheatNum2017', function (e) {
          that.mapBoxMap.getCanvas().style.cursor = 'pointer'
        })

        that.mapBoxMap.on('mousemove', 'layer_wheatNum2017', function (e) {
          if (e.features.length > 0) {
            if (hoveredStateId) {
              that.mapBoxMap.setFeatureState(
                { source: 'citymap', id: hoveredStateId },
                { hover: false }
              )
            }
            hoveredStateId = e.features[0].id
            that.mapBoxMap.setFeatureState(
              { source: 'citymap', id: hoveredStateId },
              { hover: true }
            )
          }
          // popup
          //     .setLngLat(e.lngLat)
          //     // .setHTML(e.features[0].properties.id)
          //     .setHTML(
          //     "<h1 style='text-align:center;line-height: 50px'>" +
          //         e.features[0].properties.name +
          //         "</h1><h2>小麦产量:" +
          //         e.features[0].properties.id +
          //         "(吨)</h2>"
          //     )
          //     .addTo(map);
        })
        that.mapBoxMap.on('mouseleave', 'layer_wheatNum2017', function (e) {
          that.mapBoxMap.getCanvas().style.cursor = ''
          if (hoveredStateId) {
            that.mapBoxMap.setFeatureState(
              { source: 'citymap', id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = null

          // popup.remove();
        })
      })
      // that.timer2 = setInterval(() => {
      //     that.run()
      // }, 3000)
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
    //   clearInterval(this.timer2)
  }
}
</script>
  <style lang="less">
    .layerBox1{
        position: absolute;
        top: 7%;
        right: 25.5%;
        z-index: 100;
        .layer{
            background: linear-gradient(180deg, rgba(87, 195, 254, 0.65) 0%, rgba(89, 194, 254, 0.25) 100%);
            border: 1px solid;
            border-image: linear-gradient(270deg, rgba(89, 194, 254, 0), rgba(91, 194, 254, 1), rgba(89, 195, 254, 0)) 1 1;
            color: #fff;
            margin-top: 10px;
            cursor: pointer;
            padding: 3px;
            text-align: center;
        }
        .layer:hover,.layerAct{
            background: linear-gradient(180deg, rgba(244,63,63,.65) 0%, rgba(244,63,63,.25) 100%);
            border-image: linear-gradient(270deg, rgba(244,63,63,0), #f43f3f, rgba(244,63,63,0)) 1 1;
        }
    }
  </style>
