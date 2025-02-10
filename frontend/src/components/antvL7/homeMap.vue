<template>
    <div style="position: relative;" class="indexHome">
        <div id="HomeMap"></div>
        <div class="layerBox">
          <div v-for="(item,index) in layerList" :key="index+'la'"  class="chackBox" @click="layerSH(item.variable,index)">
            <Icon type="md-eye" v-if="item.isShow" size="16"/>
            <Icon type="md-eye-off" v-else size="16" color="#ccc"/>
            <img :src="item.icon" alt="" srcset="">
            <div>
                {{item.txt}}
            </div>
          </div>
        </div>
        <div class="listBox">
          <Collapse accordion>
            <Panel name="1">
              <span style="font-weight: 800;font-size: 15px;">地震事件记录</span>
              <template #content>
                <div style="height: 330px;">
                  <vxe-table
                    size="mini"
                    show-header-overflow
                    show-overflow
                    :row-config="{isHover: true}"
                    :column-config="{resizable: true}"
                    :data="pointData"
                    @cell-click="cellDBLClickEvent"
                    height="300px">
                    <vxe-column v-for="(item,i) in columns1" :key="i+'dz'" :field="item.key" :title="item.title" :width="item.width">
                    </vxe-column>
                  </vxe-table>
                  <div style="margin-top: 8px;font-weight: 600;">
                    事件记录统计：{{ pointData.length }}条
                  </div>
                </div>
              </template>
            </Panel>
          </Collapse>
        </div>
    </div>
</template>

<script>
import { Scene, PolygonLayer, LineLayer, PointLayer, Mapbox, Popup } from '@antv/l7'
import Scroll from 'vue-seamless-scroll'

import { animate, linear } from 'popmotion'
import {
  shanzhutrack, tfhistorydata
} from '@/api/typhoon'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
export default {
  name: 'home',
  props: ['startData', 'DZData', 'pointCenter', 'zoom', 'curPoint', 'tfData'],
  components: {

  },
  data () {
    return {
      homeMap: null,
      HomemapCon: null,
      controlLanguage: null,
      columns1: [
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '深度',
          key: 'depth',
          align: 'center'
        },
        {
          title: '震级',
          key: 'mag',
          align: 'center'
        },
        {
          title: '位置',
          key: 'place'

        }
      ],
      columns3: [
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '最大淹没深度(m)',
          key: 'depth'
        },
        {
          title: '最大淹没范围(㎡)',
          key: 'range'
        }
      ],
      scrollData: { // 插件配置 ps：注意 limitMoveNum 开始无缝滚动的数据量、step 数值越大速度滚动越快、
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
	    },
      // 地震开始
      pointData: [],
      pointLayer2: null,
      curPointLayer: null, // 当前地震层
      curtextLayer: null,
      textLayer: null,
      dzLayer: true, // 图层控制
      // 地震结束
    }
  },
  watch: {
    DZData: { // 监听的对象
      deep: true, // 深度监听设置为 true
      handler: function (newV, oldV) {
        let data = JSON.parse(JSON.stringify(newV))
        let list = data.features, list2 = []
        for (let i in list) {
          list2.push(list[i].properties)
        }
        this.pointData = list2
        if (this.HomemapCon == null) {
          this.initMap()
        } else {
          this.updatePoint(data)
        }
      }
    },
    // curPoint: { // 监听的对象
    //   deep: true, // 深度监听设置为 true
    //   handler: function (newV, oldV) {
    //     let data = JSON.parse(JSON.stringify(newV))
    //     let list = data.features, list2 = []
    //     for (let i in list) {
    //       list2.push(list[i].properties)
    //     }
    //     this.pointData = list2
    //     if (this.HomemapCon == null) {
    //       this.initMap()
    //     } else {
    //       this.updateCurPoint(data)
    //     }
    //   }
    // }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    // 地图跳转
    mapFlyto (obj) {
      let that = this
      let center = [obj.longitude, obj.latitude]
      new mapboxgl.Marker().setLngLat(center).addTo(that.HomemapCon)
      that.HomemapCon.flyTo({ center, zoom: 3 })
    },
    initMap () {
      let that = this
      // 访问令牌  这个需要自己去mapbox官网申请
      mapboxgl.accessToken = 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      this.HomemapCon = new mapboxgl.Map({
        container: 'HomeMap',
        // center: that.pointCenter,
        zoom: that.zoom,
        // maxZoom:1.7,
        style: 'mapbox://styles/mapbox/light-v10',
        token: 'pk.eyJ1IjoibGFpamlhbnlpbmciLCJhIjoiY2w2ZDBrcnJsMDQwYjNpb2dkYXkwZXR5eCJ9.c0b-wNvr8xrqz7rrH_c_6A'
      })
      that.homeMap = new Scene({
        id: 'HomeMap',
        map: new Mapbox({
          mapInstance: that.HomemapCon
        })
      })
      that.controlLanguage = new MapboxLanguage({
        defaultLanguage: 'zh-Hans'
      })
      that.HomemapCon.addControl(that.controlLanguage)
      that.homeMap.on('loaded', () => {
        // that.initCurPoint()
      })
    },
    // 生成当前的地震点
    initCurPoint () {
      let that = this
      that.curPointLayer = new PointLayer({ zIndex: 3 })
        .source(that.curPoint)
        .shape('circle')
        .size('mag', mag => {
          return mag * 5
        })
        .color('caculated', caculated => {
          if (caculated == 3) {
            return '#19be6b'
          } else {
            return '#ed4014'
          }
        })
        .active(true)
        .animate(true)
        .style({
          strokeWidth: 0
        })
      that.homeMap.addLayer(that.curPointLayer)
      that.curtextLayer = new PointLayer({ zIndex: 3 })
        .source(that.curPoint)
        .shape('mag', 'text')
        .size('mag', mag => {
          return mag * 1 >= 5 ? 15 : 0
        })
        .color('#000')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          spacing: 2, // 字符间距
          padding: [ 1, 1 ] // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        })
      that.homeMap.addLayer(that.curtextLayer)
      that.curPointLayer.on('click', (e) => {
        let info = e.feature.properties
        if (info.caculated == 0) {
          that.$Notice.info({
            title: '应急响应',
            name: 'emergency' + info.eventid,
            render: h => {
              return h('div', '已反馈地震事件后果')
            }
          })
        } else if (info.caculated == 1) {
          that.$router.push({
            name: 'dzemergency',
            query: {
                eventid: info.eventid
            }
          })
        } else if (info.caculated == 2) {
          that.$emit('caculateCUR', e.feature, '地震')
        } else if (info.caculated == 3) {
          that.$Message.info('该地震未产生房屋损失')
        }
      })

      const popup = new Popup({
        offsets: [ 0, 0 ],
        closeButton: false,
        closeOnClick: true
      })
      that.curPointLayer.on('mousemove', e => {
        popup
          .setLnglat(e.lngLat)
          .setHTML(`<span>位置: ${e.feature.properties.place}</span>
                    <br><span>深度: ${e.feature.properties.depth}</span>
                    <br><span>震级: ${e.feature.properties.mag}</span>
                    <br><span>时间: ${e.feature.properties.time}</span>`)
        that.homeMap.addPopup(popup)
      })

      that.homeMap.on('mousemove', e => {
        popup.hide()
      })
      // that.mapFlyto(that.curPoint.features[0].properties)
      let obj = that.curPoint.features[0].properties
      let center = [obj.longitude, obj.latitude]
      that.HomemapCon.flyTo({ center: [105.0293, 36.7711], zoom: 3 })
      new mapboxgl.Marker().setLngLat(center).addTo(that.HomemapCon)
      //
    },
    updateCurPoint (data) {
      let that = this
      if (that.curPointLayer) {
        that.curPointLayer.setData(data)
        that.curtextLayer.setData(data)
      }
    },
    updatePoint (data) {
      let that = this
      if (that.pointLayer2) {
        that.pointLayer2.setData(data)
        that.textLayer.setData(data)
      }
    },
    // 地震事件点击跳转
    cellDBLClickEvent ({ column, row }) {
      if (row.type == 'cur') {
        let data = {
          properties: row
        }
        this.$router.push({
          name: 'dzemergency',
          query: {
              eventid: row.eventid
          }
        })
      }
    },

  },
  beforeDestroy () {
    // for (let i in this.path) {
    //   clearTimeout(this.timer2[i])
    // }
    // // this.homeMap = null
    // this.HomemapCon = null
  }
}
</script>

<style lang="less">
  .indexHome{
    width: 100%;
    height: ~'calc(100% - 32px)';
    #HomeMap{
      width: 100%;
      height: 100%;
    }

    .listBox{
      background-color: #f2f2f2;
      position: absolute;
      max-height: 250px;
      top: 10px;
      left: 10px;
      border-radius: 12px;
      width: 300px;
      z-index: 100;
      .vxe-table--render-default .vxe-cell{
        padding-left: 5px;
      }
      .ivu-collapse-content,
      .ivu-collapse-content > .ivu-collapse-content-box{
        padding: 0;
      }
      .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header{
        display: flex;
        align-items: center;
        .pt{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 16px;
        }
      }
      .ivu-table-header thead tr th,
      .ivu-table-cell{
        padding: 0;

      }
      .ivu-table-cell{
        width: 100%;
        display:-webkit-box;
        overflow: hidden; /*超出隐藏*/
        text-overflow: ellipsis;/*隐藏后添加省略号*/
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; //想显示多少行
      }
    }
  }
</style>
