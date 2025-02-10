<template>
  <div id="app" v-cloak>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
@import "./assets/fonts/SY.css";
@import "./assets/fonts/YouSheBiaoTiHei.css";
@import "./assets/fonts/PangMenZhengDao.css";
@import "./assets/fonts/Alibaba.css";
@import "./assets/fonts/BEBA.css";
.ivu-btn-small{
  line-height:1.1 !important;
}
[v-cloak] {  /*为了解决列表渲染变量闪烁的问题，需要配合el挂载的标签使用，在el挂载的标签上加上v-cloak*/
    display: none;
}
.plTableBox .el-table th{
  padding: 8px 0 !important;
  background-color: #2673c5 !important;
}

.plTableBox .el-table,
.plTableBox .el-table .cell{
  color: #515a6e !important;
  font-size: 12px;
}
.plTableBox .el-table thead{
  color: #515a6e !important;
  font-size: 12px;
}
.ivu-table-cell{
  padding-left: 9px !important;
  padding-right: 9px !important;
}
.tableBox .vxe-table--render-default.border--full .vxe-body--column, 
.tableBox .vxe-table--render-default.border--full .vxe-footer--column, 
.tableBox .vxe-table--render-default.border--full .vxe-header--column{
  padding: 8px 0 !important;
  font-size: 12px !important;
  /* background-image: linear-gradient(#2d8cf0,#2d8cf0),linear-gradient(#2d8cf0,#2d8cf0) !important; */
}
.tableBox .vxe-table--render-default.border--default .vxe-table--header-wrapper, 
.tableBox .vxe-table--render-default.border--full .vxe-table--header-wrapper, 
.tableBox .vxe-table--render-default.border--outer .vxe-table--header-wrapper{
  background-color: #2673c5 !important;
  color:#fff;
}

.tableBox .vxe-table--render-default .vxe-tree--btn-wrapper{
  left: -25px !important;
}
.tableBox .vxe-table--render-default .vxe-cell--tree-node{
  padding-left:0px !important;
}
.tableBox .vxe-table .vxe-cell--sort{
  height: 2.35em !important;
}
.tableBox .vxe-table .vxe-sort--asc-btn, .vxe-table .vxe-sort--desc-btn{
  color: #fff !important;
}
.tableBox .vxe-table .vxe-sort--asc-btn.sort--active, .vxe-table .vxe-sort--desc-btn.sort--active {
  color: #409eff !important;
}
.l7-control-container{
  display: none !important;
}
</style>
<style lang="less">
#container {
  width: 100%;
  height: 100%;
  .rotate-circle,.tmap-zoom-control,
  .tmap-scale-control,a,.logo-text{
      display: none;
  }
}
.visualModal{
  .ivu-modal-content{
    background: rgba(12, 64, 94,.85);
    .ivu-modal-header p, .ivu-modal-header-inner,
    .ivu-modal-close .ivu-icon-ios-close{
      color: #fff;
    }
    .ivu-modal-body{
      color: #fff;
    }
  }
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.mapboxgl-ctrl-bottom-right{
    display: none;
}
.l7-ctrl-logo{
    display: none !important;
  }
</style>
<style>

/* 滚动条有滑块的轨道部分 */
::-webkit-scrollbar-track-piece {
    background-color: #fff;
    border-radius: 50%;
}

/* 整个滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f5f5f5;
}

/* 滚动条竖向滑块 */
::-webkit-scrollbar-thumb:vertical {
    width: 10px;
    height: 10px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, .45);
    border-radius: 10px;
}

/* 滚动条竖向滑块hover */
::-webkit-scrollbar-thumb:vertical:hover {
    background-color: rgba(0, 0, 0, .65);
}

/* 滚动条横向滑块 */
::-webkit-scrollbar-thumb:horizontal {
    width: 10px;
    height: 10px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, .45);
    border-radius: 10px;
}

/* 滚动条横向滑块hover */
::-webkit-scrollbar-thumb:horizontal:hover {
    background-color: rgba(0, 0, 0, .65);
}

/* 同时有垂直和水平滚动条时交汇的部分 */
::-webkit-scrollbar-corner {
    display: block;    /* 修复交汇时出现的白块 */
}

</style>
