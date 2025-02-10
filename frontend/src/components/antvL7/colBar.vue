<style lang="less">
  @import "./index.less";
</style>
<template>
  <div id="colBar"></div>
</template>

<script>
import { Chart } from '@antv/g2'
export default {
  name: 'colBar',
  props: ['value', 'fieId', 'fataavg'], // value：数据源，fieID：涉及字段（数组类型）
  data () {
    return {
      colBar: null
    }
  },
  watch: {
    value (cur, old) {
      document.getElementById('colBar').innerHTML = ''
      this.colBar = null
      this.initDiv(cur)
    }
  },
  mounted () {
    document.getElementById('colBar').innerHTML = ''
    this.colBar = null
    this.initDiv(this.value)
  },
  methods: {
    initDiv (data) {
      let that = this
      that.colBar = new Chart({
        container: 'colBar',
        autoFit: true
        // height: 400,
      })
      that.colBar.data(data)
      that.colBar.scale({
        [that.fieId[0]]: {
          // tickInterval: 4,
          alias: '死亡人数'
        },
        [that.fieId[1]]: {
          nice: true,
          alias: '概率（%）'
        }
      })
      that.colBar.axis(that.fieId[0], {
        title: {
          style: { fill: '#00e9ea' }
        },
        label: {
          textStyle: {
            fill: '#fff' // 文本的颜色
          }
        }
      })
      that.colBar.axis(that.fieId[1], {
        title: {
          style: { fill: '#00e9ea' }
        },
        label: {
          textStyle: {
            fill: '#fff' // 文本的颜色
          }
        }
      })
      that.colBar.option('slider', {
        start: 0,
        end: 0.3,
        trendCfg: {
          isArea: true
        },
        height:20
      })
      that.colBar.legend(false)
      that.colBar.tooltip({
        position: 'top',
        showMarkers: false
      })
      that.colBar.animate({
        appear: {
          animation: 'grow-in-y', // 动画名称
          easing: 'easeQuadIn', // 动画缓动效果
          delay: 3000, // 动画延迟执行时间
          duration: 2000 // 动画执行时间
        },
        enter: {
          animation: 'grow-in-y', // 动画名称
          easing: 'easeQuadIn', // 动画缓动效果
          delay: 3000, // 动画延迟执行时间
          duration: 2000 // 动画执行时间
        }
      })
      that.colBar.interval().position(that.fieId[0] + '*' + that.fieId[1]).size(14).color(that.fieId[1], '#A3C580-#57B79A-#22AEAB')
      .tooltip(that.fieId[0] +'*'+that.fieId[1], (x, a) => {
            return {
              name: '概率',
              value: a.toFixed(2)+'%'
            }
          
        })
      that.colBar.interaction('active-region')
      that.colBar.render()
      that.colBar.annotation().line({
        top: true,
        start: [that.fataavg, 'min'],
        end: [that.fataavg, 'max'],
        style: {
          stroke: 'red',
          lineWidth: 2,
          lineDash: [3, 3]
        },
        text: {
          content: '均值: ' + that.fataavg+'人',
          position: 'end',
          autoRotate: false,
          style: {
            textAlign: 'start',
            fill: '#fff',
            fontSize: 12,
            fontWeight: 'normal',
          },
          offsetY: 80,
          offsetX: 10
        }
      })
      that.colBar.interaction('element-visible-filter')
      that.colBar.render()
    }
  },

  beforeDestroy () {
    this.colBar = null
  }
}
</script>
