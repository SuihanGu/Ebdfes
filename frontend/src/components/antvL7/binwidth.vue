<style lang="less">
  @import "./index.less";
</style>
<template>
  <div id="binWidth"></div>
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  name: 'binWidth',
  props: ['value', 'fieId', 'SimulateLossMean', 'fieTxt'], // value：数据源，fieID：涉及字段（数组类型）
  data () {
    return {
      binWidth: null
    }
  },
  watch: {
    value (cur, old) {
      document.getElementById('binWidth').innerHTML = ''
      this.binWidth = null
      this.initDiv(cur)
    }
  },
  mounted () {
    document.getElementById('binWidth').innerHTML = ''
    this.binWidth = null
    this.initDiv(this.value)
  },
  methods: {
    initDiv (data) {
      let that = this
      var div = document.getElementById('binWidth')
      const ds = new DataSet()
      const dv = ds.createView('diamond').source(data)
      if (that.fieId[0] == 'vmax1') {
        dv.transform({
          type: 'bin.histogram',
          field: that.fieId[0],
          bins: data.length/10, // 分箱个数
          as: [that.fieId[0], 'count']
        })
      } else {
        dv.transform({
          type: 'bin.histogram',
          field: that.fieId[0],
          bins: 30, // 分箱个数
          as: [that.fieId[0], 'count']
        })
      }
      that.binWidth = new Chart({
        container: 'binWidth',
        autoFit: true
        // height: div.offsetHeight
      })
      that.binWidth.data(dv.rows)
      // that.binWidth.option('slider', {
      //   start: 0,
      //   end: 0.3,
      //   trendCfg: {
      //     isArea: true
      //   }
      // })
      that.binWidth.scale({
        [that.fieId[0]]: {
          alias: that.fieTxt[0]
        },
        'count': {
          nice: true,
          alias: that.fieTxt[1] == '概率'?that.fieTxt[1]+'（%）':that.fieTxt[1]
        }
      })
      that.binWidth.tooltip({
        title: (d) =>{
          let tt=d.split(",")
          return Number((tt[0]*1).toFixed(3))+','+Number((tt[1]*1).toFixed(3))
        }, 
        position: 'top',
        showMarkers: false
      })
      that.binWidth.axis(that.fieId[0], {
        title: {
          style: { fill: '#00e9ea' }
        },
        label: {
          textStyle: {
            fill: '#fff' // 文本的颜色
          }
        }
      })
      that.binWidth.axis('count', {
        title: {
          style: { fill: '#00e9ea' }
        },
        label: {
          textStyle: {
            fill: '#fff' // 文本的颜色
          },
          // 使用 formatter 回调函数
          formatter: function (val) {
            if (that.fieTxt[1] == '概率') {
              return (val / 10)
            } else {
              return val
            }
          }
        }
      })
      that.binWidth.animate({
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
      that.binWidth.interval().position(that.fieId[0] + '*count').color('l(90) 0:#00E9FA 1:rgb(49, 48, 48)')
        .tooltip(that.fieId[0] + '*count', (x, a) => {
          if (that.fieTxt[1] == '概率') {
            return {
              name: '概率',
              value: (a / 10) + '%'
            }
          } else {
            return {
              name: '次数',
              value: a
            }
          }
          
        })
      that.binWidth.interaction('active-region')
      that.binWidth.render()
      that.binWidth.annotation().line({
        top: true,
        start: [that.SimulateLossMean, 'min'],
        end: [that.SimulateLossMean, 'max'],
        style: {
          stroke: 'red',
          lineWidth: 2,
          lineDash: [3, 3]
        },
        text: {
          content: '均值: ' + that.SimulateLossMean+'亿元',
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
      that.binWidth.interaction('element-visible-filter')
      that.binWidth.render()
    }
  },

  beforeDestroy () {
    this.binWidth = null
  }
}
</script>
