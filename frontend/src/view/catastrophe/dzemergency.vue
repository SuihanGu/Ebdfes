<style lang="less">
  @import "./emergency.less";
</style>
<template>
  <div id="dzemergency">
    <Row class="header" type="flex" justify="center" align="middle">
        <Col span="6">
            <div class="logo" @click="goback">
                <!-- <img :src="Logo" alt="" srcset=""> -->
            </div>
        </Col>
        <Col span="12">
            <h1 class="title" @click="gobalck">地震应急响应系统</h1>
        </Col>
        <Col span="6" class="topRight">
            <div class="full-screen-btn-con" style="opacity: 0;">
              <Icon @click.native="handleFullscreen" :type="isFullscreen ? 'md-contract' : 'md-expand'" :size="20"></Icon>
            </div>
            <!-- <div class="time">{{dateFormat(date)}}</div> -->
        </Col>
    </Row>
    <compoment :is="tabList[activeTab].component" @caculateCUR="caculateCUR"
    :activeTab="activeTab" @changeActive="changeActive"></compoment>
<!--    <div class="tabBox">-->
<!--      <div class="tab" v-for="(item,i) in tabList" :key="i+'tab'"-->
<!--      @click="activeTab=i"-->
<!--      :style="{background:activeTab==i?`url(${tabactiveBg})`:`url(${tabbg})`}">-->
<!--        {{item.label}}-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
<style>
</style>
<script>
import Logo from '@/assets/images/logo.png'
import dzInfo from '@/view/catastrophe/dzcomponent/dzInfo.vue'
import monitor from '@/view/catastrophe/dzcomponent/monitor.vue'
import { executeFlow, fetchExecFlow } from '@/api/interAPi'
import { caculate_request } from '@/api/catastrophe'
import { insertmsg } from '@/api/massage'
export default {
  name: 'dzemergency',
  components: {
    dzInfo,
    monitor
  },
  data () {
    return {
      isReload: true,
      date: new Date(),
      Logo,
      isFullscreen: false, // 全屏控制
      tabList: [
        {
          label: '应急响应',
          component: 'dzInfo'
        }, {
          label: '更多信息',
          component: 'monitor'
        }
      ],
      tabbg: require('@/assets/images/index-page/kuang.png'),
      tabactiveBg: require('@/assets/images/index-page/chooseKuang.png'),
      activeTab: 0
    }
  },
  provide () {
    return {
      msg: '未刷新',
      reload: this.reload
    }
  },
  watch: {
  },
  created () {
    clearInterval(this.etimer) // 在Vue实例销毁前，清除我们的定时器
    // 显示当前日期时间
    let _this = this// 声明一个变量指向Vue实例this，保证作用域一致
    let curdata = JSON.parse(this.$route.query.info).properties
    curdata.center = [curdata.longitude * 1, curdata.latitude * 1]
    this.curPoint = curdata
    this.etimer = setInterval(() => {
      _this.date = new Date() // 修改数据date
    }, 1000)
  },
  mounted () {
    window.onresize = () => {
      if (!this.checkFull()) {
        this.isFullscreen = false
      }
    }
  },
  methods: {
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
    // 控制切换
    changeActive (num) {
      this.activeTab = num
    },
    // 返回首页
    gobalck () {
      this.$router.push('/')
    },
    dateFormat (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
      * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
      * */
      var month = date.getMonth() + 1<10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate()<10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours()<10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes()<10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds()<10 ? '0' + date.getSeconds() : date.getSeconds()
      var myDay = date.getDay() // 获取当前星期X(0-6,0代表星期天)
      var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

      // 拼接
      return year + '-' + month + '-' + day + '  ' + hours + ':' + minutes + ':' + seconds + '  ' + week[myDay]
    },
    // 全屏控制
    handleFullscreen () {
      let main = document.documentElement
      if (this.isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen()
        }
      }
      this.isFullscreen = !this.isFullscreen
    },
    // 判断全屏
    checkFull () {
      // 判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      // 火狐浏览器
      let isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        // 谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    // 返回系统设置页
    goback () {
      this.$router.push('/')
    }
  },
  beforeDestroy () {

  }
}
</script>
