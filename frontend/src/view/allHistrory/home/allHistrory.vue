<template>
  <div style="position: relative;height: 100%;">
    <div class="hheader" style="display:flex;justify-content:space-between;width:100%padding: 16px;">
      <!-- <Select v-model="typeVal" style="width:150px;margin-right: 8px;">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select> -->
      <div>
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
      <Poptip placement="right" transfer>
        <Button type="primary" >地震事件订阅</Button>
        <div class="api" slot="content" width="200">
          <Dropdown style="width: 150px"  @on-click="changeProject" trigger="click">
              <Input v-model="emailNum" placeholder="请输入邮箱" style="width: 150px" />
              <DropdownMenu slot="list">
                  <DropdownItem  v-for="item in emailList" :name="item.value" :key="item.value">{{ item.label }}</DropdownItem>
              </DropdownMenu>
          </Dropdown>
          <Button type="primary" @click="submitEmail" style="margin-left:8px">确认</Button>
        </div>
      </Poptip>
    </div>
    <homeMap ref="homeMap" style="position: relative;" :path="path"
      :pointCenter="pointCenter" :zoom="zoom"
      :startData="startData" :DZData="DZData"
      @caculateCUR="caculateCUR"></homeMap>
    <Footers
      style="position:absolute;bottom:0;left:0;z-index:2"
      :min="0" :max="100" :daysList="daysList" v-model="per"
      @updateData="updateData"></Footers>
  </div>
</template>

<script>
import { homeMap } from '_c/antvL7'
import Footers from '@/view/allHistrory/home/footer.vue'
import { uuid, getcurrentTime } from '@/untils/untilsPublic'
import { executeFlow, fetchExecFlow } from '@/api/interAPi'
import { eventid,caculate_request } from '@/api/catastrophe'
import { insertmsg } from '@/api/massage'
import { insertEmail } from '@/api/data'
export default {
  name: 'home',
  components: {
    homeMap,
    Footers
  },
  data () {
    return {
      homeMap: null,
      mapCon: null,
      pointCenter: [ 160, 10 ],
      zoom: 1.7,
      startData: [],
      DZData: {
        type: 'FeatureCollection',
        features: []
      }, // 地震数据
      pointData: [], // 地震点,临时无接口用
      curPoint: {
        type: 'FeatureCollection',
        features: []
      }, // 可点击的当前地震点
      curPointData: [],
      daysList: [], // 最近一百天
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      typeVal: '0',
      typeList: [
         {
          label: '地震',
          value: '0'}
      ],
      curcac: [], // 正在计算的应急响应
      percent: 0, // 计算进程
      emailList: [],
      emailNum: ''
    }
  },
  watch: {
    percent (cur, old) {
      if (cur == 100) {
        setTimeout(() => {
          this.percent = 0
        }, 1500)
      }
    },
    emailNum (cur, old) {
      var reg = /^[0-9]+.?[0-9]*$/
      if (cur != old) {
        if (reg.test(cur)) {
          this.emailList = [
            { value: cur + '@qq.com', label: cur + '@qq.com' },
            { value: cur + '@164.com', label: cur + '@164.com' },
            { value: cur + '@139.com', label: cur + '@139.com' },
            { value: cur + '@gmail.com', label: cur + '@gmail.com' },
            { value: cur + '@sohu.com', label: cur + '@sohu.com' },
            { value: cur + '@aliyun.com', label: cur + '@aliyun.com' },
            { value: cur + '@189.com', label: cur + '@189.com' },
            { value: cur + '@hotmail.com', label: cur + '@hotmail.com' },
            { value: cur + '@sina.com', label: cur + '@sina.com' },
            { value: cur + '@yahoo.com', label: cur + '@yahoo.com' }
          ]
        }
      }
      if (cur == '') {
        this.emailList = []
      }
    }
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
    // let data = JSON.parse(localStorage.getItem('indexDZData'))
    // this.pointData = data
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
    this.startTime = this.daysList[0].all
    this.endTime = this.daysList[this.daysList.length - 1].all
    this.getHomeHistory(startTime, endTime)
    setTimeout(() => {
      this.getTfHistory()
    }, 1000)
  },
  methods: {
    // 地震事件订阅邮箱输入
    changeProject (name) {
      this.emailNum = name
    },
    // 上传邮箱
    submitEmail () {
      let that = this
      insertEmail({
        account: that.emailNum
      }).then(res => {
        let rs = res.data
        if (rs.code == 0) {
          that.$Message.success('订阅成功！')
        } else {
          that.$Message.error(rs.msg)
        }
      }).catch(err => {
        console.log(err) // that.$Message.error('系统错误')
      })
    },
    // 计算当前地震
    caculateCUR (e, type) {
      let that = this
      e.curi = that.curcac.length
      that.curcac.push(e)
      caculate_request({
        id: e.properties.eventid
      }).then(res => {
        let rs = res.data
        let data = rs.result
        that.$Notice.info({
          title: '应急响应',
          // duration: 0,
          name: e.curi + 'cat',
          render: h => {
            return h('div', [
              h('Progress', {
                props: {
                  percent: that.percent,
                  status: 'active'
                }
              }, that.percent + '%'),
              h('span', {
                style: {
                  display: 'inline-block',
                  marginTop: '10px',
                  color: that.percent == 100 ? '#2d8cf0' : '#17233d',
                  cursor: that.percent == 100 ? 'pointer' : '',
                  fontSize: '12px'
                },
                on: {
                  click: () => {
                    if (that.percent == 100) {
                      that.$router.push({
                        name: 'emergency',
                        query: {
                          info: JSON.stringify(e),
                          type: type
                        }
                      })
                      that.$Notice.close(e.curi + 'cat')
                    }
                  }
                }
              },
              that.percent == 100 ? '计算完成,点击去往应急响应页面！' : '正在计算中...'),
              h('span', {
                style: {
                  display: 'inline-block',
                  marginTop: '16px',
                  fontSize: '12px'
                }
              },
              `${e.properties.time}在${e.properties.place}发生的${e.properties.mag}级${type}`)
            ])
          }
        })
        let info = ''
        info = `${data[0].fault_mode},${data[0].longitude},${data[0].latitude},${data[0].depth},${data[0].mag},${data[0].telc_class},${data[0].Mech},${data[0].eventid},${e.properties.nation},${e.properties.jiaodu}`
        that.getExecuteFlow(info, e, type)
        that.$emit('getMassageNum')
        // if(data.length>0){
        //     that.$Spin.hide();
        //     that.getGridData()
        //     that.getLossRes()
        //     that.getHistoryData2()
        // }
      }).catch(err => {
        console.log(err) // that.$Message.error('系统错误')
        // that.$Spin.hide();
      })
    },
    // 应急响应计算
    getExecuteFlow (info, e, type) {
      let that = this
      let search = {
        param: info,
        project: 'xdata-vrisc',
        flow: 'emergency'
      }
      executeFlow(search).then(res => {
        let rs = res.data
        if (rs.execid == -1) {
          that.$Message.error('正在运行！')
        } else {
          let str = JSON.stringify(e)
          let obj = {
            contentval: str,
            title: '应急响应',
            subtitle: `在${e.properties.place}发生的${e.properties.mag}级${type}`,
            execid: rs.execid,
            msgid: uuid(),
            createtime: getcurrentTime('/')
          }
          that.submitmsg(obj)
          that.getfetchExecFlow(rs.execid)
        }
      }).catch(err => {
        console.log(err) // that.$Message.error('系统错误')
        // that.$Spin.hide();
      })
    },
    submitmsg (obj) {
      let that = this
      insertmsg(obj).then(res => {
        let rs = res.data
        if (rs.code == 0) {
          that.$Message.success(rs.msg)
          // that.$parent.getMassageNum()
          that.$emit('getMassageNum')
        } else {
          that.$Message.error(rs.msg)
        }
      }).catch(err => {
        console.log(err) // that.$Message.error('系统错误')
      })
    },
    getfetchExecFlow (id) {
      let that = this
      fetchExecFlow({
        execId: id
      }).then(res => {
        let rs = res.data
        let len = ((100 / rs.nodes.length).toFixed(2)) * 1
        let data = rs.nodes.filter(function (item, index) {
          return item.status == 'SUCCEEDED'
        })
        that.percent = data.length * len
        if (that.percent<100) {
          // setTimeout(() => {
          //   that.getfetchExecFlow(id)
          // }, 10000)
        } else {
          that.percent = 100
        }
      }).catch(err => {
        console.log(err) // that.$Message.error('系统错误')
      })
    },
    // 获取最近一百天的历史地震信息
    getHomeHistory (starttime, endtime) {
      let that = this
      eventid({starttime, endtime}).then(res => {
        let data = res.data
        for(let i in data){
          data[i].time = data[i].time.replace('T', ' ').replace('Z', ' ').split('.')[0]
        }
        that.curPointData = data
        that.changeObj(that.curPointData, 1)
      }).catch(err => {
          console.log(err) // that.$Message.error('系统错误')
      })
    },
    // 调整点标注结构
    changeObj (data, type) {
      let list = []
      for (let i in data) {
        let obj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [data[i].longitude * 1, data[i].latitude * 1]
          },
          properties: data[i]
        }
        list.push(obj)
      }
      if (type == 0) {
        this.DZData.features = list
      } else {
        this.curPoint.features = list
        this.$refs.homeMap.initCurPoint()
      }

      this.$forceUpdate()
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
.hheader{
  box-shadow:0px 15px 10px -15px #ccc;
  width: 100%;
}
</style>
