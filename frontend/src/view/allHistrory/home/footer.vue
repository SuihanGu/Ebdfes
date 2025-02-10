<template>
 <div class="foots">
  <div class="sliberBox">
    <div class="curInfo">
      当前日期：{{currentTime}}
    </div>
    <div class="slider" ref="slider">
      <div class="process" :style="{ width }"></div>
      <div class="thunk" ref="trunk" :style="{ left }">
        <div class="block"></div>
        <div class="tips">
        <!-- <span>{{scale*100}}</span> -->
        <i class="fas fa-caret-down"></i>
        </div>
      </div>
    </div>
    <div class="daysBox">
      <div class="Line" style="background-color: transparent;">
      </div>
      <div v-for="(item,index) in daysList">
        <div v-if="index%10==0" class="ifLine">
        </div>
        <div v-else class="Line">
        </div>
        <div v-if="index%10==0" class="timeday">
          {{item.d}}
        </div>
      </div>
    </div>
    <ButtonGroup class="btng">
      <Button icon="md-skip-backward" @click="() => {if (this.per > 0) { this.per--;}}"></Button>
      <Button icon="md-play" @click="playing" v-if="playVal==true"></Button>
      <Button icon="md-pause" @click="pauseing" v-else></Button>
      <Button icon="md-skip-forward" @click="() => {if (this.per <100) { this.per++;}}"></Button>
    </ButtonGroup>
    <div v-if="daysList" class="curLine">
      <div>
        {{firstLine}}
      </div>
      <div>
        {{lastLine}}
      </div>
    </div>
  </div>

 </div>
</template>
<script>
/*
 * min 进度条最小值
 * max 进度条最大值
 * v-model 对当前值进行双向绑定实时显示拖拽进度
 * */
export default {
  name: 'footers',
  props: ['min', 'max', 'value', 'daysList'],
  data () {
    return {
      slider: null, // 滚动条DOM元素
      thunk: null, // 拖拽DOM元素
      per: this.value, // 当前值
      playVal: true, // 是否播放
      timerF: null, // 定时器
      currentTime: '', // 时间轴当前位置
      firstLine: '', // 时间轴第一个位置
      lastLine: ''// 时间轴最后一个位置
    }
  },
  watch: {
    daysList (cur, old) {
      this.firstLine = cur[0].y + cur[0].d
      this.lastLine = cur[99].y + cur[99].d
    },
    per (cur, old) {
      if (cur - 1 >= 0) {
        this.currentTime = this.daysList[cur - 1].all
      } else {
        this.currentTime = this.daysList[0].all
      }
      let date = {
        currentTime: this.currentTime,
        cur: cur
      }
      this.$emit('updateData', date)
    }
  },
  // 渲染到页面的时候
  mounted () {
    this.slider = this.$refs.slider
    this.thunk = this.$refs.trunk
    var _this = this
    this.thunk.onmousedown = function (e) {
      var width = parseInt(_this.width)
      var disX = e.clientX
      document.onmousemove = function (e) {
        // value, left, width
        // 当value变化的时候，会通过计算属性修改left，width

        // 拖拽的时候获取的新width
        var newWidth = e.clientX - disX + width
        // 拖拽的时候得到新的百分比
        var scale = newWidth / _this.slider.offsetWidth
        _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min)
        _this.per = Math.max(_this.per, _this.min)
        _this.per = Math.min(_this.per, _this.max)
        _this.$emit('input', _this.per)
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
      return false
    }
  },
  computed: {
  // 设置一个百分比，提供计算slider进度宽度和trunk的left值
  // 对应公式为 当前值-最小值/最大值-最小值 = slider进度width / slider总width
  // trunk left = slider进度width + trunk宽度/2
    scale () {
      return (this.per - this.min) / (this.max - this.min)
    },
    width () {
      if (this.slider) {
        return this.slider.offsetWidth * this.scale + 'px'
      } else {
        return 0 + 'px'
      }
    },
    left () {
      if (this.slider) {
        return (
          this.slider.offsetWidth * this.scale -
     this.thunk.offsetWidth / 2 +
     'px'
        )
      } else {
        return 0 + 'px'
      }
    }
  },
  methods: {
    playing () {
      if (this.playVal && this.per == 100) {
        this.per = 0
      }
      this.playVal = false
      if (this.per<100) {
        this.per++
        this.timerF = setTimeout(() => {
          this.playing()
        }, 1000)
      } else {
        this.playVal = true
        clearTimeout(this.timerF)
      }
    },
    pauseing () {
      this.playVal = true
      clearTimeout(this.timerF)
    }
  }
}
</script>
<style lang="less">
.foots{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sliberBox{
  width: 95%;
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.box {
 margin: 100px auto 0;
 width: 80%;
}
.clear:after {
 content: "";
 display: block;
 clear: both;
}
.slider {
 user-select: none;
 position: relative;
 margin: 8px 0;
 width: 100%;
 height: 10px;
 background: rgba(110,110,110,.4);
 border-radius: 5px;
 cursor: pointer;
 margin-bottom: 0;
}
.slider .process {
 position: absolute;
 left: 0;
 top: 0;
 width: 112px;
 height: 10px;
 border-radius: 5px;
 background: #2d8cf0;
}
.slider .thunk {
 position: absolute;
 left: 100px;
 top: -7px;
 width: 20px;
 height: 20px;
}
.slider .block {
 width: 20px;
 height: 20px;
 border-radius: 50%;
 border: 2px solid #409eff;
 background: rgba(255, 255, 255, 1);
 transition: 0.2s all;
}
.slider .tips {
 position: absolute;
 left: -7px;
 bottom: 30px;
 min-width: 15px;
 text-align: center;
 padding: 4px 8px;
 /* background: #000; */
 border-radius: 5px;
 height: 24px;
 color: #fff;
}
.slider .tips i {
 position: absolute;
 margin-left: -5px;
 left: 50%;
 bottom: -9px;
 font-size: 16px;
 color: #000;
}
.slider .block:hover {
 transform: scale(1.1);
 opacity: 0.6;
}
.curInfo{
  width: 100%;
  /* padding: 10px; */
  text-align: center;
  font-size: 20px;
  color: #7c7c7c;
}
.daysBox{
  display: flex;
  justify-content: space-between;
  color: #7c7c7c;
  width: 100%;
  height: 40px;
  position: relative;
}
.daysBox .ifLine{
  height: 10px;
  width: 2px;
  background-color: #7c7c7c;
}
.daysBox .Line{
  height: 8px;
  width: 1px;
  background-color: #ccc;
}
.timeday{
  position: absolute;
  top: 10px;
  font-size: 15px;
}
.curLine{
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  color: #7c7c7c;
}
.btng .ivu-btn{
  padding:0;
}
</style>
