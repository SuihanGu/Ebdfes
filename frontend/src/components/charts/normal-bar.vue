<template>
  <div ref="normal" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: ['value', 'text', 'subtext'],
  data () {
    return {
      normal: null,
      mathJax: '`f(x) = (1 / (\sqrt {2\pi} \sigma)) e^(-(x-\mu)^2/(2\sigma^2))`', // 正态曲线的计算公式
      isSample: true,
      xAxisData: [0]
    }
  },
  watch: {
    value (cur, old) {
      this.$nextTick(() => {
        for (let i = 1; i<23; i++) {
          let num = i * 10
          this.xAxisData.push(num)
        }
        this.initChartsData('normal') // 生成 Echarts 图
      })
    }
  },
  computed: {
    /**
         * @Description： 获取数据源
         * @Author： ChengduMeng
         * @Date： 2020-11-27 14:56:07
         * */
    data: {
      get () {
        // 因为数组的监听不太好处理，所以多转换一次
        return this.value
      },
      set (v) {
        // 如果给 data 赋值，只能是数组类型
        if (!(v instanceof Array)) return
        // 同步更新 value 的值
        this.value = v.join(',')
      }
    },
    /**
         * @Description： 有序数据源（方便操作）
         * @Author： ChengduMeng
         * @Date： 2020-11-28 14:17:24
         * */
    dataOrderBy () {
      const data = this.data.concat([]) // 为防止 sort 方法修改原数组，对原数组进行拷贝，操作副本。
      return data.sort((a, b) => a - b)
    },
    /**
         * @Description： 数据整理。原数据整理为：{数据值 : 数据频率}
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:59:12
         * */
    dataAfterClean () {
      let res = {}
      for (let i = 0; i < this.data.length; i++) {
        let key = parseFloat(this.data[i]).toFixed(1) // 这里保留 1 位小数
        if (key !== 'NaN' && parseFloat(key) === 0) { key = '0.0' } // 这个判断用来处理保留小数位后 -0.0 和 0.0 判定为不同 key 的 bug
        if (res[key]) { res[key] += 1 } else { res[key] = 1 }
      }
      return res
    },
    /**
         * @Description： 数据整理。返回源数据所有值（排序后）
         * @Author： ChengduMeng
         * @Date： 2020-11-28 14:35:52
         * */
    dataAfterCleanX () {
      return Object.keys(this.dataAfterClean) // 保留 1 位小数
      // return Object.keys(this.dataAfterClean) // 不保证顺序一致
    },
    /**
         * @Description： 数据整理。返回源数据所有值对应的频率（排序后） -- 与 dataAfterCleanX 顺序一致
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:59:12
         * */
    dataAfterCleanY () {
      let r = []
      for (let i = 0; i < this.dataAfterCleanX.length; i++) {
        r.push(this.dataAfterClean[this.dataAfterCleanX[i]])
      }
      return r
    },
    /**
         * @Description： 数据整理。返回源数据所有值对应的频率，刻度更细致（保留 2 位小数） -- 与 dataAfterCleanX 顺序一致
         * @Author： ChengduMeng
         * @Date： 2020-11-29 13:59:22
         * */
    dataAfterCleanXSub () {
      let r = []
      for (let i = parseFloat(this.min.toFixed(1)); i <= parseFloat(this.max.toFixed(1)); i +=
                0.01) { r.push(i.toFixed(2)) }
      return r
    },

    /**
         * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:24:14
         * */
    sum () {
      if (this.data.length === 0) return 0
      return this.data.reduce((prev, curr) => prev + curr)
    },
    /**
         * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
    average () {
      return this.sum / this.data.length
    },
    /**
         * @Description： 计算众数
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
    mode () {
      return 0
    },
    /**
         * @Description： 计算中位数
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
    median () {
      const data = this.dataOrderBy
      return (data[(data.length - 1) >> 1] + data[data.length >> 1]) / 2
    },
    /**
         * @Description： 计算偏差
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
    deviation () {
      // 1、求平均数
      const avg = this.average
      // 2、返回偏差。 f(x) = x - avg
      return this.data.map(x => x - avg)
    },
    /**
         * @Description： 计算总体/样本方差
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
    variance () {
      if (this.data.length === 0) return 0
      // 1、求偏差
      const dev = this.deviation
      // 2、求偏差平方和
      const sumOfSquOfDev = dev.map(x => x * x).reduce((x, y) => x + y)
      // 3、返回方差
      return sumOfSquOfDev / (this.isSample ? (this.data.length - 1) : this.data.length)
    },
    /**
         * @Description： 计算总体/样本标准差
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
    standardDeviation () {
      return Math.sqrt(this.variance)
    },
    /**
         * @Description： 计算一倍标准差范围
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
    standarDevRangeOfOne () {
      return {
        low: this.average - 1 * this.standardDeviation,
        up: this.average + 1 * this.standardDeviation
      }
    },
    /**
         * @Description： 计算三倍标准差范围
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:29:43
         * */
    standarDevRangeOfTwo () {
      return {
        low: this.average - 2 * this.standardDeviation,
        up: this.average + 2 * this.standardDeviation
      }
    },
    /**
         * @Description： 计算三倍标准差范围
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:30:49
         * */
    standarDevRangeOfThree () {
      return {
        low: this.average - 3 * this.standardDeviation,
        up: this.average + 3 * this.standardDeviation
      }
    },
    /**
         * @Description： 计算最小值
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:19:06
         * */
    min () {
      // return Math.min.apply(null, this.data)
      return 0
    },
    /**
         * @Description： 计算最大值
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:21:16
         * */
    max () {
      // return Math.max.apply(null, this.data)
      return 220
    },
    /**
         * @Description： 正态分布(高斯分布)计算公式
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:46:18
         * */
    normalDistribution () {
      // 计算公式： `f(x) = (1 / (\sqrt {2\pi} \sigma)) e^(-(x-\mu)^2/(2\sigma^2))`
      // return (1 / Math.sqrt(2 * Math.PI) * a) * (Math.exp(-1 * ((x - u) * (x - u)) / (2 * a * a)))
      let res = []
      for (let i = 0; i < this.dataAfterCleanX.length; i++) {
        const x = this.dataAfterCleanX[i]
        const a = this.standardDeviation
        const u = this.average
        const y = (1 / (Math.sqrt(2 * Math.PI) * a)) * (Math.exp(-1 * ((x - u) * (x - u)) / (2 *
                    a * a)))
        res.push(y)
        if (x == 11.8) { } // 正态分布峰值，用于验证
      }
      return res
    }

  },
  mounted () {
    this.$nextTick(() => {
      for (let i = 1; i<23; i++) {
        let num = i * 10
        this.xAxisData.push(num)
      }
      this.initChartsData('normal') // 生成 Echarts 图
    })
  },
  methods: {
    resize () {
      this.normal.resize()
    },
    /**
     * @Description： 生成 Echarts 图
     *
     * @Params ref：容器
     *
     * @return
     * @Author： ChengduMeng
     * @Date： 2020-11-27 13:23:26
     * */
    initChartsData (ref) {
      this.normal = echarts.init(this.$refs[ref], 'tdTheme')
      if (!this.normal) return
      // Echarts 图的配置
      let options = {
        // Echarts 图 -- 工具
        tooltip: {},
        // Echarts 图 -- 图例
        legend: {
          data: ['f(x)']
        },
        grid: {
          top: '5%',
          left: '8%',
          right: '3%',
          bottom: '15%',
          containLabel: true
        },
        // Echarts 图 -- x 坐标轴刻度 -- 正态分布数值
        xAxis: [{
          name: 'Losss/亿美元',
          nameTextStyle: {
            lineHeight: 40
          },
          nameLocation: 'center',
          // data: this.xAxisData,
          data: this.dataAfterCleanX,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false // 不显示坐标轴刻度线
          },
          axisLine: {
            lineStyle: {
              color: '#0DCCFF'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: '#0DCCFF'
          }
        }],
        // Echarts 图 -- y 坐标轴刻度
        yAxis: [
          {
            min: 0,
            max: 5,
            type: 'value',
            name: '概率',
            nameLocation: 'center',
            position: 'left',
            // 网格线
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#0DCCFF'
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#0DCCFF'
            }
          }
        ],
        // Echarts 图 -- y 轴数据
        series: [{
          name: '概率', // y 轴名称
          type: 'bar', // y 轴类型
          yAxisIndex: 0,
          barGap: 0,
          barWidth: 14,
          itemStyle: {
            normal: {
              borderColor: '#83bff6' // 边框颜色
            },
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          },
          data: this.dataAfterCleanY // y 轴数据 -- 源数据
        }]

      }
      this.normal.setOption(options)
      on(window, 'resize', this.resize)
    }
  },

  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
