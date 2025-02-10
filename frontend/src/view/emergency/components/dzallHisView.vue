<template>
    <div class="contentBox">
        <div class="mapbox" style="height:100%;padding:0;background:transparent;position:relative">
            <Button ghost size="small" @click="closeAllHis" style="position:absolute;top:8px;left:8px;z-index:100;">返回</Button>
            <!-- 地图 -->
            <country2
                ref="history"
                :cityZoom="cityZoom"
                @toScrollData='toScrollData'
                :pointCenter="pointCenter"
                :timeline="false"
                style="width: 100%;height:100%;position:relative;z-index:5"></country2>
        </div>
    </div>
</template>
<script>
import country2 from './country2.vue'
export default {
  props: ['pointCenter', 'cityZoom','timeline'],
  components: {
    country2
  },
  data () {
    return {
        hisdata:[]
    }
  },
  methods: {
    // 获取数据
    getParentData (data) {
        if(this.hisdata.length==0){
            this.hisdata=data
            this.$refs.history.initBasicMap()
            setTimeout(() => {
                this.$refs.history.changePointHis(data)
            }, 1000);
        }
        
    },
    toScrollData(info){
        this.$emit('toScrollData', info)
    },
    closeAllHis(){
        this.$emit('closeAllHis')
    },
  }
}
</script>

<style lang="less">

</style>
