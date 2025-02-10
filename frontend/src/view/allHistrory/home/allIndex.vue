<template>
  <div class="content">
    <div class="listBox">
      <Collapse accordion>
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
      </Collapse>
    </div>
    <div class="header">
      <DatePicker type="date"
          format="yyyy-MM-dd"
          placeholder="开始时间"
          style="width: 150px;margin-right: 8px;"
          :value="startTime"
          @on-change="startTime=$event"></DatePicker>
        <DatePicker type="date"
          format="yyyy-MM-dd"
          placeholder="结束时间"
          style="width: 150px;margin-right: 8px;"
          :value="endTime"
          @on-change="startTimeChange"></DatePicker>
        <Button type="primary" @click="getHomeHistory(startTime,endTime)">搜索</Button>
    </div>
    <div class="mapBox" style="height:calc(100% - 50px);position: relative;z-index:1">
      <homeMap ref="homeMap" @initData="initData"></homeMap>
    </div>
    <Footers
      style="position:absolute;bottom:0;left:0;z-index:2"
      :min="0" :max="100" :daysList="daysList" v-model="per"
      @updateData="updateData"></Footers>
  </div>
</template>

<script>
import homeMap from '@/view/allHistrory/components/homeMap.vue'
import Footers from '@/view/allHistrory/home/footer.vue'
import { eventid,caculate_request } from '@/api/catastrophe'
import {
  tfhistory
} from '@/api/typhoon'
export default {
  components: {
    Footers,homeMap
  },
  data () {
    return {
      startTime: '', // 开始时间
      endTime: '', // 结束时间
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
      daysList:[],
      // 地震开始
      pointData: [],// 地震数据
      columns1: [
        { title: '时间', key: 'time' },
        { title: '深度', key: 'depth', align: 'center' },
        { title: '震级', key: 'mag', align: 'center' },
        { title: '位置', key: 'place' }
      ],// 地震表头
      // 地震结束
  },
  computed: {
    per: {
      get () {
        return 0
      },
      set (val) {
      }
    }
  },
  mounted () {
    let day = new Date().getTime()
    this.daysList = this.getday2(day)
    this.path = [
      [
        {
          lng: 168.3984375,
          lat: -4.565473550710278,
          img: 'img0'
        },
        {
          lng: 165.05859375,
          lat: -5.7908968128719565,
          img: 'img0'
        },
        {
          lng: 160.3125,
          lat: -5.7908968128719565,
          img: 'img0'
        },
        {
          lng: 157.32421875,
          lat: -3.688855143147035,
          img: 'img0'
        },
        {
          lng: 153.80859375,
          lat: -2.284550660236957,
          img: 'img0'
        },
        {
          lng: 148.88671874999997,
          lat: -2.108898659243126,
          img: 'img0'
        },
        {
          lng: 145.1953125,
          lat: -0.7031073524364783,
          img: 'img0'
        },
        {
          lng: 140.44921875,
          lat: 0,
          img: 'img0'
        },
        {
          lng: 135,
          lat: 1.4061088354351594,
          img: 'img0'
        },
        {
          lng: 131.8359375,
          lat: 2.986927393334876,
          img: 'img0'
        },
        {
          lng: 130.078125,
          lat: 5.965753671065536,
          img: 'img0'
        },
        {
          lng: 128.49609375,
          lat: 9.102096738726456,
          img: 'img0'
        },
        {
          lng: 127.265625,
          lat: 12.2111891503997,
          img: 'img0'
        },
        {
          lng: 125.859375,
          lat: 15.453680224345835,
          img: 'img0'
        },
        {
          lng: 123.92578125,
          lat: 18.312810846425442,
          img: 'img0'
        },
        {
          lng: 121.11328124999999,
          lat: 19.80805412808859,
          img: 'img0'
        },
        {
          lng: 117.94921874999999,
          lat: 20.96143961409684,
          img: 'img0'
        },
        {
          lng: 115.31249999999999,
          lat: 22.917922936146045,
          img: 'img0'
        }
      ]
    ]
    for (let i in this.path) {
      this.startData[i] = {
        lng: this.path[i][0].lng,
        lat: this.path[i][0].lat
      }
    }
    let startTime = this.daysList[0].all
    let endTime = this.daysList[this.daysList.length - 1].all
    this.startTime = startTime
    this.endTime = endTime

  },
  methods: {
    // 接口数据初始化
    initData(){
      this.getHomeHistory(this.startTime, this.endTime)
      // setTimeout(()=>{
      //   this.getTfHistory()
      // },3000)
    },
    startTimeChange (e) {
      this.endTime = e
      var date = new Date(e).getTime()
      this.daysList = this.getday2(date)
    },
    // 获取最近一百天的历史地震信息
    getHomeHistory (starttime, endtime) {
      let that = this
      eventid({starttime, endtime}).then(res => {
        let data = res.data
        for(let i in data){
          data[i].time = data[i].time.replace('T', ' ').replace('Z', ' ').split('.')[0]
        }
        that.pointData = data
        that.$refs.homeMap.changePointObj(data,0)
      }).catch(err => {
          console.log(err) // that.$Message.error('系统错误')
      })
    },

    // 地震事件点击跳转
    cellDBLClickEvent ({ column, row }) {
      if (row.type == 'cur') {
        let data = {
          properties: row
        }
        this.$router.push({
          name: 'dzemergency2',
          query: {
              eventid: row.eventid
          }
        })
      }
    },
    // 动态刷新地图数据
    updateData (data) {
      this.getHomeHistory(this.daysList[0].all, data.currentTime)
    },
    startTimeChange (e) {
      this.endTime = e
      var date = new Date(e).getTime()
      this.daysList = this.getday2(date)
    },
    // 获取最近一百天内的日期
    getday2 (date) {
      let days = []
      let dataList = []
      for (let i = 0; i <= 24 * 99; i += 24) {		// 今天加上前6天
        let day = new Date(date)
        let dateItem = day.getTime() - i * 60 * 60 * 1000	// 使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
        day.setTime(dateItem) // 注意，这行是关键代码
        let y = day.getFullYear()	// 获取年份
        let m = day.getMonth() + 1	// 获取月份js月份从0开始，需要+1
        let d = day.getDate()	// 获取日期
        m = this.addDate0(m)	// 给为单数的月份补零
        d = this.addDate0(d)	// 给为单数的日期补零
        let valueItem = m + '/' + d + ''	// 组合
        days.unshift({
          y: y + '/',
          d: valueItem,
          all: `${y}-${m}-${d}`
        })	// 添加至数组
      }
      return days
    },
    // 给日期加0
    addDate0 (time) {
      if (time.toString().length == 1) {
        time = '0' + time.toString()
      }
      return time
    }
  }
}
</script>
<style lang="less">
  .content{
    width: 100%;
    height: 100%;
    position: relative;
    .header{
      height: 50px;
      width: 100%;
      padding: 10px;
    }
    .mapBox{
      width: 100%;
    }
    .listBox{
      background-color: #f2f2f2;
      position: absolute;
      max-height: 100px;
      top: 50px;
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
