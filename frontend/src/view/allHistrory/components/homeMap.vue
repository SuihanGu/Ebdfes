<template>
  <div id="contentMap">
    111
  </div>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      mapBox:null,// 地图容器
      mapView:null,// MapVGL图层管理器
      dzLayer:null,// 地震图层

      startTime: '', // 开始时间
      endTime: '', // 结束时间
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    // 地图初始化
    initMap(){
      let that = this
      that.mapBox = new BMapGL.Map("contentMap");          // 创建地图实例
      var point = new BMapGL.Point(110, 30);  // 创建点坐标
      that.mapView = new mapvgl.View({
        map: that.mapBox
      });
      that.mapBox.centerAndZoom(point, 5);
      that.mapBox.enableScrollWheelZoom(true);
      that.$emit('initData')
    },
    // 生成点状geojson data:数据，type:图层类型 0 地震；
    changePointObj(data,type){
      var geojson = data.map((item, index) => {
            return {
                geometry: {
                    type: 'Point',
                    coordinates: [item.longitude*1, item.latitude*1]
                },
                properties: item,
                type,
                color: index==0?"#ed4014":"#19be6b",
                // 圆的半径
                size: 6
            };
        });
        switch (type) {
          case 0: // 地震
            this.updateDZPoint(geojson)
            break;
        }

    },
    // 生成地震点
    updateDZPoint(data){
      let that = this
      // 创建图文信息窗口
      let sContent = null,infoWindow=null
      that.dzLayer = new mapvgl.CircleLayer({
        // 绘制带波纹扩散的圆
        type: 'wave',
        // 扩散半径，支持直接设置和回调两种形式
        radius: r => 3 * r,
        // 周期影响扩散速度，越小越快
        duration: 1 / 3,
        // 拖尾影响波纹数，越大越多
        trail: 3,
        enablePicked: true, // 是否可以拾取
        selectedColor: '#2db7f5', // 选中项颜色
        onDblClick: (e) => { // 点击事件
          if(e.dataIndex==0){
            let info = e.dataItem.properties
            if(e.dataItem.type==0){
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
            }
          }
        },
        onMousemove:(e)=>{
          if(e.dataIndex==0){
            let info = e.dataItem
            sContent = `<span>位置: ${info.properties.place}</span>
                  <br><span>深度: ${info.properties.depth}</span>
                  <br><span>震级: ${info.properties.mag}</span>
                  <br><span>时间: ${info.properties.time}</span>`;
                  var opts = {
                    title:"基本信息：",
                    enableCloseOnClick:true,// 是否显示关闭按钮，默认显示开启，这里设置为不显示
                  }
            infoWindow = new BMapGL.InfoWindow(sContent,opts);
            var point = new BMapGL.Point(info.geometry.coordinates[0], info.geometry.coordinates[1]);
            that.mapBox.openInfoWindow(infoWindow,point);
          }else{
            if(infoWindow!=null){
              infoWindow=null
              that.mapBox.closeInfoWindow()
            }
          }
        }
      });
      that.mapView.addLayer(that.dzLayer);
      that.dzLayer.setData(data);
    }
  }
}
</script>
<style lang="less">
  #contentMap{
    width: 100%;
    height: 100%;
    .BMap_bubble_buttons {
      display: none;
    }
    .BMap_bubble_title {
      font-size: 15px;
      font-weight: 600;
    }
  }
</style>
