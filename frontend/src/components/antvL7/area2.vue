<style lang="less">
  @import "./index.less";
</style>
<template>
  <div id="Area2"></div>
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  name: 'Area2',
  props: ['value', 'fieId','SimulateLossMean'],
  data () {
    return {
      Area2: null
    }
  },
  watch: {
    value (cur, old) {
      document.getElementById('Area2').innerHTML = ''
      this.Area2 = null
      this.initDiv(cur)
    }
  },
  mounted () {
    document.getElementById('Area2').innerHTML = ''
    this.Area2 = null
    this.initDiv(this.value)
  },
  methods: {
    initDiv (data) {
      let that = this
      that.Area2 = new Chart({
          container: 'Area2',
          autoFit: true,
          // height: 440,
          // padding: [16, 50, 64],
      });

      that.Area2.data(data);
      that.Area2.scale({
          [that.fieId[0]]: {
            tickCount: 10,
            alias: '损失金额（亿元）',
          },
          [that.fieId[1]]: {
            nice: true,
            alias: '模拟次数'
          }
      });
      that.Area2.axis(that.fieId[0], {
        title: {
          style: { fill: '#00e9ea' }
        },

      })
      that.Area2.axis(that.fieId[1], {
        title: {
          style: { fill: '#00e9ea' }
        },
      })
      that.Area2.option('slider', {
          start: 0,
          end: 0.08,
          trendCfg: {
              isArea: true,
          },
          height:20
      });

      that.Area2
      .area()
      .position(that.fieId[1]+'*'+that.fieId[0])
      .color('#00C9FF')
      .style({
          fillOpacity: 0.6
      })
      that.Area2.line().position(that.fieId[1]+'*'+that.fieId[0]).color('#00e9ea')

      that.Area2.annotation().line({
        start: ['min', that.SimulateLossMean],
        end: ['max', that.SimulateLossMean],
        style: {
          stroke: 'red',
          lineWidth: 2,
          lineDash: [3, 3],
        },
        text: {
          position: 'start',
          style: {
            fill: '#fff',
            fontSize: 12,
            fontWeight: 'normal',
          },
          content: '均值：'+that.SimulateLossMean+'亿元',
          offsetY: -10,
          offsetX: 200,
        },
      });
      that.Area2.interaction('element-visible-filter');
      that.Area2.render();
    }
  },

  beforeDestroy () {
    this.Area2 = null
  }
}
</script>
