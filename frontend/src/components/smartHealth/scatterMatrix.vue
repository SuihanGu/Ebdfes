<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>
  
  <script>
  import * as echarts from 'echarts5'
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
import { compare } from '@/untils/untilsPublic'
let CATEGORY_DIM_COUNT = 6;
let GAP = 2;
let BASE_LEFT = 5;
let BASE_TOP = 10;
// let GRID_WIDTH = 220;
// let GRID_HEIGHT = 220;
let GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
let GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
let CATEGORY_DIM = 7;
let SYMBOL_SIZE = 4;
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartBar',
    data () {
      return {
        dom: null,
      }
    },
    methods: {
      updateData (rawData,dataVal) {
        let that = this
        if(this.dom!=null){
          this.dom.clear()
        }
        let schema = [
            { name: 'AQIindex', index: 1, text: 'AQI' },
            { name: 'PM25', index: 2, text: 'PM 2.5' },
            { name: 'PM10', index: 3, text: 'PM 10' },
            { name: 'CO', index: 4, text: 'CO' },
            { name: 'NO2', index: 5, text: 'NO₂' },
            { name: 'SO2', index: 6, text: 'SO₂' },
            { name: '等级', index: 7, text: '等级' }
        ];
        let gridOption = that.generateGrids(rawData);
        let option = {
            // animation: false,
            backgroundColor:'rgba(0,0,0,0)',
            visualMap: {
                type: 'piecewise',
                categories: dataVal,
                dimension: CATEGORY_DIM,
                orient: 'horizontal',
                top: 0,
                left: 'center',
                inRange: {
                    color: ['#51689b', '#ce5c5c', '#fbc357']
                },
                outOfRange: {
                    color: '#fff'
                },
                seriesIndex: gridOption.series.map(function (_, idx) {
                    return idx;
                })
            },
            tooltip: {
                trigger: 'item'
            },
            parallelAxis: [
                { dim: 0, name: schema[0].text },
                { dim: 1, name: schema[1].text },
                { dim: 2, name: schema[2].text },
                { dim: 3, name: schema[3].text },
                { dim: 4, name: schema[4].text },
                { dim: 5, name: schema[5].text },
                { dim: 6, name: schema[6].text,type: 'category', data: ['优', '良', '轻度', '中度', '重度', '严重']}
            ],
            parallel: {
                bottom: '5%',
                left: '2%',
                height: '30%',
                width: '55%',
                parallelAxisDefault: {
                type: 'value',
                name: 'AQI指数',
                nameLocation: 'end',
                nameGap: 20,
                splitNumber: 3,
                nameTextStyle: {
                    fontSize: 14
                },
                axisLine: {
                    lineStyle:{
                        color:'#fff'
                    }
                },
                axisTick: {
                    lineStyle: {
                    color: '#fff'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: '#fff'
                }
                }
            },
            xAxis: gridOption.xAxis,
            yAxis: gridOption.yAxis,
            grid: gridOption.grid,
            series: [
                {
                    name: 'parallel',
                    type: 'parallel',
                    smooth: true,
                    lineStyle: {
                        width: 1,
                        opacity: 0.3
                    },
                    data: rawData
                },
                ...gridOption.series
            ]
        };
        this.dom = echarts.init(this.$refs.dom, 'dark')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
        setTimeout(()=>{
          this.resize()
        },400)
        // this.timer = setTimeout(()=>{
        //   this.$emit("getzzData");
        // },1000)
      },
      retrieveScatterData(data, dimX, dimY) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            let item = [data[i][dimX], data[i][dimY]];
            item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
            result.push(item);
        }
        return result;
      },
      generateGrids(rawData) {
        let that = this
        let index = 0;
        let grid = [];
        let xAxis = [];
        let yAxis = [];
        let series = [];
        for (let i = 0; i < CATEGORY_DIM_COUNT; i++) {
            for (let j = 0; j < CATEGORY_DIM_COUNT; j++) {
            if (CATEGORY_DIM_COUNT - i + j >= CATEGORY_DIM_COUNT) {
                continue;
            }
            grid.push({
                left: BASE_LEFT + i * (GRID_WIDTH + GAP) + '%',
                top: BASE_TOP + j * (GRID_HEIGHT + GAP) + '%',
                width: GRID_WIDTH + '%',
                height: GRID_HEIGHT + '%'
            });
            xAxis.push({
                splitNumber: 3,
                position: 'top',
                axisLine: {
                show: j === 0,
                onZero: false,
                },
                axisTick: {
                show: j === 0,
                inside: true
                },
                axisLabel: {
                show: j === 0,
                color: '#fff'
                },
                type: 'value',
                gridIndex: index,
                scale: true
            });
            yAxis.push({
                splitNumber: 3,
                position: 'right',
                axisLine: {
                show: i === CATEGORY_DIM_COUNT - 1,
                onZero: false,
                },
                axisTick: {
                show: i === CATEGORY_DIM_COUNT - 1,
                inside: true
                },
                axisLabel: {
                show: i === CATEGORY_DIM_COUNT - 1,
                color: '#fff'
                },
                type: 'value',
                gridIndex: index,
                scale: true
            });
            series.push({
                type: 'scatter',
                symbolSize: SYMBOL_SIZE,
                xAxisIndex: index,
                yAxisIndex: index,
                data: that.retrieveScatterData(rawData, i, j)
            });
            index++;
            }
        }
        return {
            grid,
            xAxis,
            yAxis,
            series
        };
    },
      resize () {
        if (this.dom != null) {
          this.dom.resize()
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
  
      })
    },
    beforeDestroy () {
      off(window, 'resize', this.resize)
      clearTimeout(this.timer)
    }
  }
  </script>
  