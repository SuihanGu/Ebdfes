<template>
    <div class="timerBox">
        <DatePicker
            :type="timeType=='timeday'?'date':'datetime'"
            :format="timeType=='timeday'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm'"
            show-week-numbers
            placeholder="起始时间"
            :value="startTime"
            @on-change="datePickChange"
            transfer
            transfer-class-name="tt"
            style="width: 150px" />
        <div class="sliderBox" style="width: calc(100% - 130px);">
            <Slider v-model="timerSlider"
                style="width: 100%;"
                :max="maxLen"
                :marks="marks"
                :step="step"
                @on-change="sliderChange"
                :tip-format="format"></Slider>
            <div class="btnBox">
                <Button type="primary" shape="circle"
                    icon="ios-arrow-back" size="small"
                    @click="sliderMinus"></Button>
                <Button type="primary" shape="circle"
                    icon="md-arrow-dropright" size="small"
                    @click="startORend(true)"
                    v-if="!isPlay"></Button>
                <Button type="primary" shape="circle"
                    icon="md-pause" size="small"
                    @click="startORend(false)"
                    v-if="isPlay"></Button>
                <Button type="primary" shape="circle"
                    icon="ios-arrow-forward" size="small"
                    @click="sliderAdd"></Button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'timeList',
  props: ['step'],
  data () {
    return {
      // 时间选择滑块
      timerSlider: 0,
      marks: {
        0: '00:00',
        4: '04:00',
        8: '08:00',
        12: '12:00',
        16: '16:00',
        20: '20:00',
        24: '00:00',
        28: '04:00',
        32: '08:00',
        36: '12:00',
        40: '16:00',
        44: '20:00'
      },
      startTime: '',
      endTime: '',
      timeList: [], // 当前时间的48小时
      isPlay: false,
      playTimer: null,
      maxLen: 48,
      timeType: ''
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    // 清除时间选择器
    clearTimer () {
      this.isPlay = false
      clearInterval(this.playTimer)
    },
    // 时间选择器变化
    datePickChange (e, e2) {
      // this.startTime = e
      this.endTime = e
      this.timerSlider = 0
      var date = new Date(e).getTime()
      if (this.timeType == 'timeday') {
        let hours = e.split('-')[1] + '/' + e.split('-')[2]
        this.marks['0'] = hours
        this.getTimerList2(date, this.maxLen)
      } else {
        this.getTimerList(date, this.maxLen)
      }
      //   this.$emit('clearLayer',this.timeList)
      this.updateInfo()
    },
    // 获取当前时间和48小时
    getcurTime (timeType) {
      this.timeType = timeType
      var day2 = new Date()
      day2.setTime(day2.getTime())
      let y = day2.getFullYear()
      let m = day2.getMonth() + 1
      let d = day2.getDate()
      let h = day2.getHours()// 得到小时
      let mu = day2.getMinutes()
      if (m < 10) m = '0' + m
      if (d < 10) d = '0' + d
      if (h < 10) h = '0' + h
      if (mu < 10) mu = '0' + mu
      this.timeList = []
      if (this.timeType == 'timeday') {
        this.maxLen = 30
        this.startTime = `${y}-${m}-${d}`
        this.endTime = `${y}-${m}-${d}`
        this.timeList.push({
          date: this.startTime,
          hours: ''
        })
        let n = 0
        this.marks[n] = `${m}/${d}`
        this.getTimerList2(day2.getTime(), this.maxLen)
      } else {
        this.maxLen = 48
        this.startTime = `${y}-${m}-${d} ${h}:00`
        this.endTime = `${y}-${m}-${d} ${h}:00`
        this.getTimerList(day2.getTime(), this.maxLen)
      }
    },
    getTimerList (dayTime, timeLen) {
      this.maxLen = timeLen
      let day2 = new Date(dayTime)
      day2.setTime(day2.getTime())
      let h = day2.getHours()// 得到小时
      let mu = day2.getMinutes()
      if (mu < 10) mu = '0' + mu
      if (h < 10) h = '0' + h
      var s2 = day2.getFullYear() + '-' + ((day2.getMonth() + 1)<10 ? '0' + (day2.getMonth() + 1) : (day2.getMonth() + 1)) + '-' + (day2.getDate()<10 ? '0' + day2.getDate() : day2.getDate())
      let dayList = [s2], dayNum = Math.ceil(this.maxLen / 24) + 1
      for (let i = 1; i<dayNum; i++) {
        var dt = new Date(dayTime)
        dt.setTime(dt.getTime() + 24 * 60 * 60 * 1000 * i)
        let ss = dt.getFullYear() + '-' + ((dt.getMonth() + 1)<10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + '-' + (dt.getDate()<10 ? '0' + dt.getDate() : dt.getDate())
        dayList.push(ss)
      }
      let arr = [
        {
          date: s2,
          hours: h + ':00'
        }
      ]
      this.startTime = s2 + ' ' + h + ':00'
      this.endTime = s2 + ' ' + h + ':00'
      let hh = JSON.parse(JSON.stringify(h))
      let date = s2
      for (let i = 0; i<this.maxLen - 1; i++) {
        hh++
        if (hh == 24) {
          hh = 0
          for (let j in dayList) {
            if (arr[i - 1].date == dayList[j - 1]) {
              date = dayList[j]
            }
          }
        }
        if (hh < 10) hh = '0' + hh
        let obj = {
          date,
          hours: hh + ':00'
        }
        arr.push(obj)
      }
      this.timeList = arr
      let nn = Math.ceil(this.maxLen / 48)
      this.marks = {}
      for (let i = 0; i<12; i++) {
        let num = 0
        if (i>0) {
          num = nn * (i * 4)
        }
        if (num> this.maxLen) {
          num = this.maxLen - 1
        }
        this.marks[num] = ''
        this.marks[num] = arr[num].hours
      }
      this.updateInfo()
      this.$forceUpdate()
    },
    getTimerList2 (dayTime, timeLen) {
      var date = new Date(dayTime)
      let that = this
      that.timeList = []
      that.maxLen = timeLen

      for (let n = 0; n<timeLen; n++) {
        date.setDate(date.getDate() + 1)
        var s2 = date.getFullYear() + '-' + ((date.getMonth() + 1)<10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate()<10 ? '0' + date.getDate() : date.getDate())
        let arr = {
          date: s2,
          hours: ''
        }
        that.timeList.push(arr)
        if (n % 4 == 0 && n>0) {
          that.marks[n] = ((date.getMonth() + 1)<10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' + (date.getDate()<10 ? '0' + date.getDate() : date.getDate())
        }
      }
      that.updateInfo()
      that.$forceUpdate()
    },
    // 滑块时间显示
    format (val) {
      if (this.timeList[val]) {
        return this.timeList[val].date + ' ' + this.timeList[val].hours
      } else {
        return null
      }
    },
    // 滑块改变
    sliderChange (val) {
      let that = this
      that.endTime = that.timeList[val].date + ' ' + that.timeList[val].hours
      that.updateInfo()
    },
    // 滑块加
    sliderAdd () {
      if (this.timerSlider == this.maxLen) {
        this.timerSlider = 0
      } else {
        //   this.timerSlider++
        let n = this.timeType == 'timeday' ? 1 : 3
        if(this.$route.query.type=='台风'){
          n=1
        }
        this.timerSlider = this.timerSlider + n
      }
      this.endTime = this.timeList[this.timerSlider].date + ' ' + this.timeList[this.timerSlider].hours
      this.updateInfo()
    },
    startORend (type) {
      let that = this
      that.isPlay = type
      if (that.isPlay) {
        //   that.timerSlider++
        let n = this.timeType == 'timeday' ? 1 : 3
        if(this.$route.query.type=='台风'){
          n=1
        }
        that.timerSlider = that.timerSlider + n
        if (that.timerSlider >= this.maxLen) {
          that.timerSlider = 0
        }
        that.endTime = that.timeList[that.timerSlider].date + ' ' + that.timeList[that.timerSlider].hours
        that.updateInfo()
        that.playTimer = setInterval(() => {
          //   that.timerSlider++
          let n = that.timeType == 'timeday' ? 1 : 3
          if(this.$route.query.type=='台风'){
            n=1
          }
          that.timerSlider = that.timerSlider + n
          if (that.timerSlider >= this.maxLen) {
            that.timerSlider = 0
          }
          that.endTime = that.timeList[that.timerSlider].date + ' ' + that.timeList[that.timerSlider].hours
          that.updateInfo()
        }, 3000)
      } else {
        clearInterval(that.playTimer)
      }
    },
    // 滑块减
    sliderMinus () {
      if (this.timerSlider <= 0) {
        return
      } else {
        this.timerSlider = this.timerSlider - 3
      }
      this.endTime = this.timeList[this.timerSlider].date + ' ' + this.timeList[this.timerSlider].hours
      this.updateInfo()
    },
    // 更新数据
    updateInfo () {
      this.$emit('updateInfo', this.endTime)
    }
  },
  beforeDestroy () {
    clearInterval(this.playTimer)
  }
}
</script>
