<style lang="less">
  @import "./index.less";
</style>
<template>
  <div id="distrbution"></div>
</template>

<script>
import { Dot } from '@antv/l7plot'
export default {
  name: 'distrbution',
  props: ['EarthquakeData'],
  data () {
    return {
      dotBox: null
    }
  },
  watch: {
    EarthquakeData: {
      deep: true, // 深度监听设置为 true
      handler: function (newV, oldV) {
        this.initDiv()
      }

    }
  },
  mounted () {

  },
  methods: {
    initDiv () {
      const depthColors = ['#D60352', '#F86615', '#F86615', '#F86615', '#F86615']
      this.dotBox = new Dot('distrbution', {
        map: {
          type: 'mapbox',
          style: 'light',
          center: [141.1929932, 38.7882996],
          zoom: 1,
          style: 'mapbox://styles/mapbox/satellite-streets-v11'
        },
        source: {
          data: this.EarthquakeData,
          parser: { type: 'geojson' }
        },
        color: {
          field: 'depth',
          value: ({ depth }) => {
            const index = ~~((depth / 120) * depthColors.length) % depthColors.length
            return depthColors[index]
          }
        },
        size: {
          field: 'mag',
          value: ({ mag }) => {
            if (mag * 1 < 6) {
              return mag * 1 / 2
            }
            return mag * 1
          }
        },
        style: {
          opacity: 0.8,
          strokeWidth: 0
        },
        state: { active: true },
        label: {
          visible: false,
          field: 'mag',
          style: {
            fill: '#fff',
            fontSize: 12,
            textAnchor: 'center',
            padding: [10, 10]
          }
        },
        // zoom: {
        //     position: 'bottomright',
        // },
        // scale: {
        //     position: 'bottomright',
        // },
        layerMenu: {
          position: 'topright'
        },
        tooltip: {
          items: [
            { field: 'place', alias: 'place' },
            { field: 'mag', alias: 'mag' },
            { field: 'depth', alias: 'depth' }
          ]
        }
      })
    }
  },

  beforeDestroy () {
    this.dotBoxt = null
  }
}
</script>
