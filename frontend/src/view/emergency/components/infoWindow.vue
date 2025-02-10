<template>
    <div class="popup-box">
        <div class="popupBox" v-if="infoType==0">
            <p class="ptt">[ {{dataInfo.longitude}},{{dataInfo.latitude}} ]</p>
            <div class="pcon">
                <p>房屋破坏程度：{{(dataInfo.dr_avg*100).toFixed(2)}} %</p>
                <p>损失估计：{{(dataInfo.loss_avg/1000000).toFixed(3)}} 百万元</p>
            </div>
        </div>
        <div class="popupBox" v-else-if="infoType==1">
            <p class="ptt">{{dataInfo.place}}</p>
            <div class="pcon">
                <p>震级：{{dataInfo.mag}} Mw</p>
                <p>深度：{{dataInfo.depth}} Km</p>
                <p>发生时间：{{dataInfo.time}}</p>
            </div>
        </div>
        <div class="popupBox" v-else-if="infoType==2">
          <div class="pcon">
              <p>人员伤亡估计值：{{dataInfo.toFixed(3)}} %</p>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      overlay: null,
      infoWindow: null,
      isInfo: true,
      infoType: 0, // 0当前地震点，1历史地震点
      dataInfo: {
        longitude: '',
        latitude: '',
        dr_avg: '',
        loss_avg: ''
      }
    }
  },
  methods: {
    // 获取数据
    getParentData (data, type) {
      this.dataInfo = data
      this.infoType = type
    }
  }
}
</script>

<style lang="less">
    .popup-box {
        min-width:100px;
        min-height:60px;
        border-radius: 4px;
        background: rgba(2, 17, 56, 0.85);
        border: 2px solid #C4C4C499;
        box-shadow: 2px 2px 6px 0px #3A3A3A26;
        position:relative;
        z-index:999;
        color:#fff;
        .popupBox{
            padding:8px;
            display:flex;
            justify-content:center;
            flex-direction: column;
            .ptt{
                width:100%;
                text-align:center;
                font-size:15px;
                font-weight:600;
                padding-bottom:8px;
                border-bottom:1px solid #fff;
            }
            .pcon{
                padding-top:8px;
                font-size:14px;
            }
        }
    }
    .info_card{
      z-index:999
    }
</style>
