<style lang="less">
  @import "./index.less";
</style>
<template>
  <div id="Sline"></div>
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  name: 'Sline',
  props: ['value', 'fieId'],// fieId 0:Y;1:X
  data () {
    return {
      Sline: null
    }
  },
  watch: {
    value (cur, old) {
      document.getElementById('Sline').innerHTML = ''
      this.Sline = null
      this.initDiv(cur)
    }
  },
  mounted () {
    document.getElementById('Sline').innerHTML = ''
    this.Sline = null
    this.initDiv(this.value)
  },
  methods: {
    initDiv () {
        let that = this
        let data = [
            {
                "Date": "03.05.2017",
                "Close": 229.5
            },
            {
                "Date": "04.05.2017",
                "Close": 230
            },
            {
                "Date": "05.05.2017",
                "Close": 234.1
            },
            {
                "Date": "08.05.2017",
                "Close": 234.5
            },
            {
                "Date": "09.05.2017",
                "Close": 233.5
            },
            {
                "Date": "10.05.2017",
                "Close": 238.9
            },
            {
                "Date": "11.05.2017",
                "Close": 238.95
            },
            {
                "Date": "12.05.2017",
                "Close": 237
            },
            {
                "Date": "15.05.2017",
                "Close": 239
            },
            {
                "Date": "16.05.2017",
                "Close": 237.1
            },
            {
                "Date": "17.05.2017",
                "Close": 241
            },
            {
                "Date": "18.05.2017",
                "Close": 242.6
            },
            {
                "Date": "19.05.2017",
                "Close": 242.1
            },
            {
                "Date": "22.05.2017",
                "Close": 241.7
            },
            {
                "Date": "23.05.2017",
                "Close": 245.15
            },
            {
                "Date": "24.05.2017",
                "Close": 252.05
            },
            {
                "Date": "25.05.2017",
                "Close": 259.8
            },
            {
                "Date": "26.05.2017",
                "Close": 266.05
            },
            {
                "Date": "29.05.2017",
                "Close": 269.05
            },
            {
                "Date": "30.05.2017",
                "Close": 273
            },
            {
                "Date": "31.05.2017",
                "Close": 268.5
            },
            {
                "Date": "01.06.2017",
                "Close": 267.7
            },
            {
                "Date": "02.06.2017",
                "Close": 266.716
            },
            {
                "Date": "05.06.2017",
                "Close": 266.716
            },
            {
                "Date": "06.06.2017",
                "Close": 286.5
            },
            {
                "Date": "07.06.2017",
                "Close": 276.2
            }
        ]
        that.Sline = new Chart({
            container: 'Sline',
            autoFit: true,
            // height: 440,
            // padding: [16, 50, 64],
        });

        that.Sline.data(data);
        that.Sline.scale({
            [that.fieId[0]]: {
                tickCount: 10,
                alias: 'Acc.(cm/s)'
            },
            [that.fieId[1]]: {
                nice: true,
                tickCount: 10,
                alias: 'Time(s)'
            }
        });
        that.Sline.axis(that.fieId[0], {
            title: {
                style: { fill: '#849FAD' }
            },
            tickLine: {
                alignTick: false,
            },
        })
        that.Sline.axis(that.fieId[1], {
            title: {
                style: { fill: '#849FAD' }
            }
        })
        that.Sline.option('slider', {
            start: 0,
            end: 0.1,
            trendCfg: {
                isArea: false,
            },
        });

        that.Sline
        .area()
        .position(that.fieId[1]+'*'+that.fieId[0])
        .color('#00C9FF')
        .style({
            fillOpacity: 0.6
        })
        that.Sline.line().position(that.fieId[1]+'*'+that.fieId[0]).color('#00C9FF')

        that.Sline.annotation().line({
            start: ['min', 85],
            end: ['max', 85],
            style: {
            stroke: '#fff',
            lineWidth: 1,
            lineDash: [3, 3],
            },
            text: {
            position: 'start',
            style: {
                fill: '#fff',
                fontSize: 15,
                fontWeight: 'normal',
            },
            content: 'Mean 85',
            offsetY: -5,
            },
        });
        that.Sline.interaction('active-region');
        that.Sline.render();
    }
  },

  beforeDestroy () {
    this.Sline = null
  }
}
</script>
