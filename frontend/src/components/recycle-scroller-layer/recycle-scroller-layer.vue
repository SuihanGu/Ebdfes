<template>
    <div style="height: 100%;" id="recyBox">
        <List id="headerBox">
          <div slot="header" class="listHeader">
            <div v-for="(item2,i) in coulmn" style="display: flex;align-items:center;flex-wrap: wrap;"
              :style="{width:item2.width}"
              :key="'c'+i">
                <p style="width:100%;" :style="{'text-align':item2.align?item2.align:'center'}">
                    {{item2.label}}
                </p>
                <p style="" v-if="item2.sublabel">{{item2.sublabel}}</p>
            </div>
          </div>
        </List>
        <div :style="{'height':'calc(100% - '+heightNum+'px )'}">
            <recycle-scroller
                class="virtual-list"
                :buffer="1000"
                :prerender="200"
                :item-size="34"
                id="listContent"
                :key-field="keyid==undefined?'id':keyid"
                style="height: 100%;"
                ref="listBox"
                :items="value">
                <template v-slot="{ item, index }">
                    <!-- :class="selected==index ? 'selectBox':'' " -->
                    <div class="list-item" :key="index"
                    @mouseover="mouseOver" @mouseleave="mouseLeave">
                        <div v-for="(op,i) in coulmn"
                            class="keyBox"
                            :style="{width:op.width}"
                            :key="'cc'+i"
                            @click="toScrollData(item)">
                            <Tooltip :content="item[op.key]+''" transfer v-if="op.type=='state'">
                                <div class="statusBox" style="with:100%;justify-content: center;">
                                    <div style="width:50px" :style="{'text-align':op.align?op.align:'center'}">
                                       {{item[op.key]}} 
                                    </div>
                                    <div class="status" :style="{background:item.color}"></div>
                                </div>
                            </Tooltip>
                            <Tooltip :content="item[op.key]+''" transfer v-else>
                                <p style="width:100%" :style="{'text-align':op.align?op.align:'center'}">{{item[op.key]}}</p>  
                            </Tooltip>
                        </div>
                    </div>
                </template>
            </recycle-scroller>
        </div>
        
    </div>
</template>
  
  <script>
  import Scroll from 'vue-seamless-scroll'
  import $ from 'jquery'
  export default {
    name: 'SortScrollList',
    components: {
      Scroll
    },
    props: ['value', 'text', 'subtext', 'coulmn', 'limitNum','keyid'],
    data () {
      return {
        scrollData: { // 插件配置 ps：注意 limitMoveNum 开始无缝滚动的数据量、step 数值越大速度滚动越快、
            step: 0.5, // 数值越大速度滚动越快
            limitMoveNum: 4, // 开始无缝滚动的数据量
            hoverStop: true, // 是否开启鼠标悬停stop
            direction: 1, // 0向下 1向上 2向左 3向右
            openWatch: true, // 开启数据实时监控刷新dom
            singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
            singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
            waitTime: 3000 // 单步运动停止的时间(默认值1000ms)
        },
        pointData:[],// 数据
        selected:0,
        timerscroll:null,
        heightNum:0,
        divData:null,
      }
    },
    watch: {
        value (cur, old) { 
            let that = this
            let listBox = that.$refs.listBox
            that.divData = listBox.$el
            that.scrollData=that.limitNum
            that.scrollMethods()
            that.divData.addEventListener('mouseover', function () {
                // clearInterval(that.timerscroll)
            })
            that.divData.addEventListener('mouseleave', function () {
                // that.scrollMethods()
            })
        },
    },
    mounted () {
      this.$nextTick(() => {
        this.heightNum = $("#headerBox").height()+10
        window.onresize = () => {   //屏幕尺寸变化就重新赋值
            return (() => {
                this.heightNum = $("#headerBox").height()+5
            })()
        }
      })
    },
    methods: {
        toScrollData(item){
            this.$emit('toScrollData',item)
        },
        scrollMethods(){
            let that = this
            if(that.timerscroll){
                window.clearInterval(that.timerscroll)
                that.timerscroll=null
            }
            if(that.value.length>that.limitNum){
                that.timerscroll = setInterval(()=>{
                    that.divData.scrollTop++
                    if ( (+that.divData.clientHeight.toFixed(0)) + (+that.divData.scrollTop.toFixed(0)) >= that.divData.scrollHeight) {
                        that.divData.scrollTop = 0
                    }
                }, 50)
            }
            
        },
        mouseOver(){
            if(this.timerscroll){
                window.clearInterval(this.timerscroll)
                this.timerscroll=null
            }
            
        },
        mouseLeave(){
            if(!this.timerscroll){
                this.scrollMethods()
            }
        }
    },
  
    beforeDestroy () {
      clearInterval(this.timerscroll)
    }
  }
  </script>
<style lang="less">
    .listHeader{
        width: 100%;
        display:flex;
        color: #00e9ea;
        font-size: 12px;
        text-align: center;
        p{
            white-space: pre-line; /* 设置换行 */
            text-align: center; /* 设置水平居中 */
            margin: 0 auto; /* 设置左右外边距为auto，实现水平居中效果 */
        }
    }

    .ivu-list-items{
        // height: 100%;
    }
     #listContent{
        overflow: auto;
        -ms-overflow-style: none; 
        overflow: -moz-scrollbars-none;
        .keyBox{
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis; //文本溢出显示省略号
            white-space: nowrap; //文本不会换行
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .list-item{
            display: flex;
            cursor: pointer;
            background-image: linear-gradient(to right, rgba(255, 255, 255,.45), rgba(0,0,0,0), rgba(255, 255, 255,.45));
            margin-top: 4px;
            border: 1px solid transparent;
            opacity: 0.65;
            height: 30px;
            .statusBox{
                display: flex;
                align-items: center;
                .status{
                    margin-left: 5px;
                    width: 10px;
                    height: 10px;  
                    border-radius: 50%;
                }
            }
        }
    }
    // #listContent::-webkit-scrollbar { width: 3px !important }
    /* 滚动条有滑块的轨道部分 */
    #listContent::-webkit-scrollbar {
        background-color: rgba(255, 255, 255, .25) !important;
        width:8px;
    }
    #listContent::-webkit-scrollbar-track-piece {
        background-color: transparent;
    }
    #listContent::-webkit-scrollbar-thumb:vertical {
        background-color:#fff;
    }
    .ivu-tooltip{
        display:flex !important;
    }
    .ivu-tooltip-inner{
        white-space: normal;
    }
    .list-item div{
        overflow: hidden;
        text-overflow: ellipsis; //文本溢出显示省略号
        white-space: nowrap; //文本不会换行
        font-size: 12px;
        width: 100%;
    }
    .list-item:hover,
    .selectBox{
        border: 1px solid #fff !important;
        color: #00e9ea !important;
        opacity: 1 !important;
    }
    .vue-recycle-scroller.ready.direction-vertical .vue-recycle-scroller__item-view{
        height: 34px;
    }
</style>
  