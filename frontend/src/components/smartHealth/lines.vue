<template>
  <div ref="dom0" class="charts chart-bar" style="height:100%"></div>
</template>
  
  <script>
  import echarts from 'echarts'
  import tdTheme from '@/components/charts/theme.json'
  import { on, off } from '@/libs/tools'
import moment from 'moment'
  echarts.registerTheme('tdTheme', tdTheme)
import {
  dtUrl
} from '@/api/smartHealth3'
  export default {
    name: 'ChartLines',
    data () {
      return {
        dom0: null,
        dom1: null,
        dom2: null,
        settimedom0:null,
        settimedom1:null,
        settimedom2:null,
        dataUrl:'',
        time:0,
        channelid:'',
      }
    },
    methods: {
      updateData (data,unit,type,val,url,txt,time) {
        this.dataUrl=url
        if(this.dom0!=null){
          this.dom0.clear()
        }
        if(this.dom1!=null){
          this.dom1.clear()
        }
        if(this.dom2!=null){
          this.dom2.clear()
        }
        let that = this
        that.time=time
        that.channelid=val
        for(let i in data){
            let option = {
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false, // 不显示坐标轴上的文字
                    },
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    axisTick: {
                        show: false
                    },
                    name:unit,
                    // nameLocation:'center',
                    nameTextStyle:{
                        color:'#fff',
                        padding:0,
                    },
                    splitNumber:2,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#fff',
                        formatter: function (value, index) {
                            return value + unit;
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#172C5A'
                        }
                    },
                    splitLine: { 
                        lineStyle:{
                            color:'#172C5A'
                        }
                    }
                },
                legend:{
                    show:false,
                    data:[ data[i][0].title],
                    top:'bottom',
                    textStyle:{
                        color:'#fff'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor:'rgba(50,50,50,0.7)',
                    borderColor:'rgba(50,50,50,0.7)',
                    textStyle:{
                      color:"#fff"
                    },
                    formatter: function (params) {
                        params = params[0];
                        let s = "时间："+params.data.time+"<br/>"+params.data.title+"："+params.value[1]
                        return s;
                    },
                },
                grid: { // 让图表占满容器
                    // top: 20,
                    right: 20,
                    left:80,
                },
                series: [{
                    name: data[i][0].title,
                    type: 'line',
                    showSymbol: false,
                    data: data[i] 
                }]
            }
            that[i] = echarts.init(that.$refs[i], 'tdTheme')
            that[i].setOption(option)
            that['settime'+type]=window.setTimeout(function () {
              let num = data[i].length-1
              let id = data[i][num].id
              that.getData(i,data[i],val,type,txt,id)
            }, time);
        }
        on(window, 'resize', this.resize)
        setTimeout(()=>{
          this.resize()
        },400)
      },
      clearBox(i){
        if(this.dom0!=null){
          this.dom0.clear()
          window.clearTimeout(this['settime'+i])
        }
      },
      getData(n,info,val,type,txt,id){
        let that=this
        if(that.channelid!=val){
          return
        }
        let search = {
          id,rowNumber:40,channelid:val
        }
        if(that.dataUrl=='QD'){
          let tableName = 'qd_dataset_'+txt
          let channelid = val
          search={
            tableName,id,rowNumber:40,channelid
          }
        }
        dtUrl(search,that.dataUrl).then(res => {
          let data = res.data
          let list = []
          let num = (info.length-1)*1
          let now = new Date(info[num].name);
          let oneDay = 24 * 3600 * 1000;
          for(let i in data){
            now = new Date(+now + oneDay);
            let obj = {
                title:"",
                time:data[i].loctime,
                name:now.toString(),
                value:[moment(now).format('YYYY-MM-DD'),((data[i][val]*1).toFixed(5))*1]
            }
            if(val=='ns'){
                obj.title='加速度_南北'
            }
            if(val=='ew'){
                obj.title='加速度_东西'
            }
            if(val=='ud'){
              obj.title='加速度_竖向'
            }
            list.push(obj)
          }
          if(list.length>0){
            for (var j = 0; j < list.length; j++) {
                info.shift();
                info.push(list[j]);
            }
            that[n].setOption({
                series: [
                    {
                        data: info
                    }
                ]
            });
          }
          that['settime'+type]=window.setTimeout(function () {
            let jj = res.data.length-1
              that.getData(n,info,val,type,txt,res.data[jj].id)
          }, 2000);
        }).catch(err => {
          console.log(err) // that.$Message.error('系统错误')
        })
        
      },
      // 按时间顺序排序
      dateData(property, bol) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          if (bol) {
            // 升序
            return Date.parse(value1) - Date.parse(value2);
          } else {
            // 降序
            return Date.parse(value2) - Date.parse(value1)
          }
        }
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
    }
  }
  </script>
  