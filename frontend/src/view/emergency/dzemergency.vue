<template>
    <div class="emgHomeBox2">
        <div class="header">
            <p style="margin-left:36px;">{{allHisShow?'历史地震展示':'地震应急响应系统'}}</p>
        </div>
        <div class="contentBox">
            <div class="mapbox">
                <div class="radioInfoBox" v-if="areaId==1&&fpMax!=0">
                    <div class="radioInfo" v-for="(item,i) in fpColor[tabVal1].slice().reverse()">
                        <div class="circle" :style="{background:item}"></div>
                        <div v-if="tabVal1=='fatality_population'">人员伤亡估计值：>= {{i==0?fpMax:Number((fpMax/(i*1+1)).toFixed(3))}}
                        </div>
                        <div v-else>总人口数：>= {{i==0?fpMax:parseInt(fpMax/(i*1+1))}}
                        </div>
                    </div>
                </div>
                <div class="radioInfoBox" v-if="areaId==2">
                    <div class="radioInfo" v-for="(item,i) in ilColor">
                        <div class="circle" :style="{background:item.color}"></div>
                        <div style="display:flex;justify-content:space-between;width:calc(100% - 28px)">
                            <p>{{item.lable}}</p>
                            <!-- <p>{{item.value}}</p> -->
                        </div>
                    </div>
                </div>
                <div class="layerBtn2" :style="{width:animLeft&&animRight?'calc(100% - 892px)':'70%'}">
                    <div class="allmap" @click="isCollage">
                        <Icon type="ios-globe-outline" v-if="animLeft&&animRight"/>
                        <Icon type="ios-globe-outline" v-else color="#CC6868"/>
                    </div>
                    <!-- areaId -->
                    <div class="layerBdBox" v-show="!allHisShow">
                        <div v-for="(item,i) in layerList" :key="item.value+'layer'" class="layerBd" :class="i%2==0?'layerBd1':'layerBd2'"
                        @click="areaIdChange(item.value)"
                        :style="{color:areaId==item.value?'#EEC514':''}">
                            {{item.label}}
                        </div>
                    </div>
                </div>
                <RadioGroup v-model="tabVal1" class="raidoBox" size="large"
                    @on-change="accOrlocChange" v-if="areaId==1"
                    type="button" button-style="solid">
                    <Radio label="fatality_population">
                        <span>人员伤亡</span>
                    </Radio>
                    <Radio label="population">
                        <span>总人口数</span>
                    </Radio>
                </RadioGroup>
                <!-- 地图 -->
                <country2
                    ref="country"
                    :cityZoom="cityZoom"
                    @toScrollData='toScrollData'
                    :pointCenter="pointCenter"
                    style="width: 100%;height:100%;position:relative;z-index:5"></country2>
            </div>
            <transition name="move-left">
                <div class="chartLeft" v-show="animLeft">
                    <div class="chartBox chartBox1">
                        <div style="position:relative">
                            <p class="ttBox ttBox1">基本信息</p>
                            <Button type="info" ghost size="small" @click="goback" style="position: absolute;right:10px;top:0;">返回主页</Button>
                        </div>
                        <div class="baseBox">
                            <div class="baseItem">
                                <div class="text">
                                    <p class="thead">震级：</p>
                                    {{baseInfo.mag}} Mw
                                </div>
                            </div>
                            <div class="baseItem">
                                <div class="text"><p class="thead">位置：</p>{{baseInfo.place}}</div>
                            </div>
                            <div class="baseItem">
                                <div class="text">
                                    <p class="thead">经纬度：</p>
                                    {{baseInfo.longitude>0?baseInfo.longitude+'E':Math.abs(baseInfo.longitude)+'W'}}，
                                    {{baseInfo.latitude>0?baseInfo.latitude+'N':Math.abs(baseInfo.latitude)+'S'}}
                                </div>
                            </div>
                            <div class="baseItem">
                                <div class="text"><p class="thead">震源深度：</p>{{baseInfo.depth}} Km</div>
                            </div>
                            <div class="baseItem">
                                <div class="text"><p class="thead">发生时间：</p>{{baseInfo.time}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="chartBox chartBox1">
                        <p class="ttBox ttBox3">建筑的直接经济损失</p>
                        <histogram ref="histogram" style="height: 100%;margin-top:10px;"></histogram>
                    </div>
                    <div class="chartBox chartBox3">
                        <p class="ttBox ttBox3">人员伤亡人数分布</p>
                        <rediusBar ref="rediusBar" style="height: 100%;margin-top:10px;" @resize="resize"></rediusBar>
                    </div>
                </div>
            </transition>
            <transition name="move-right">
                <div class="chartRight" v-show="animRight">
                    <div class="chartBox chartBox1">
                        <p class="ttBox ttBox3">建筑损失模拟结果</p>
                        <areaStack ref="areaStack" style="height: calc(100% - 15px);margin-top:10px;"></areaStack>
                    </div>
                    <div class="chartBox chartBox2">
                        <p class="ttBox ttBox3">各位置损失评估结果</p>
                        <div class="ssyjBox" style="height: calc(100% - 75px);">
                            <recycleScrollerLayer ref='recdata1'
                                style="height: 100%;"
                                :limitNum="4"
                                :value="placeLossData" :coulmn="placeCol"
                                ></recycleScrollerLayer>
                        </div>
                    </div>
                    <div class="chartBox chartBox3">
                        <div style="position:relative">
                            <p class="ttBox ttBox1">历史事件</p>
                            <Button type="error" ghost size="small" @click="hisMapDisplay" style="position: absolute;right:10px;top:0;">地图展示</Button>
                        </div>
                        <div class="ssyjBox" :style="{height:`calc(100% - ${ifresize}px)`}">
                            <recycleScrollerLayer ref='history'
                                @toScrollData="toScrollData"
                                style="height: 100%;"
                                :limitNum="7"
                                :value="historyData" :coulmn="historyCol"
                                ></recycleScrollerLayer>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<style lang="less">
@import "./index.less";
</style>
<script>
import recycleScrollerLayer from '@/components/recycle-scroller-layer/recycle-scroller-layer.vue'
import country2 from './components/country2.vue'
import dzallHisView from './components/dzallHisView.vue'
import rediusBar from './components/rediusBar.vue'
import histogram from './components/histogram.vue'
import areaStack from './components/areaStack.vue'
import moment from 'moment'
import CountTo from '_c/count-to'
import { compare, uuid } from '@/untils/untilsPublic'
import {
    eventid,roll_show, stimulate_time, history_eq, fatality_uncertainty, dr_loss,
  fatility_population, contour_line
} from '@/api/catastrophe'
export default {
    name: 'dzemergency',
    components: {
        country2, CountTo, recycleScrollerLayer,dzallHisView,rediusBar,areaStack,histogram
    },
    data () {
        return {
            animLeft:false,// 左边图表
            animRight:false,// 右边图表
            ifresize:57,// 屏幕如果发生变化，即改变某些数据框的大小
            userName: '',
            baseInfo: {
                time: '', // 发生时间，
                place: '', // 位置
                longitude: '', // 经度
                latitude: '', // 维度
                mag: '6', // 震级
                depth: '10', // 深度
                eventid:'',
            },
            cityZoom: 1,
            pointCenter: [],
            allHisShow:false,// 历史地震全屏地图展示
            historyCol: [
                { width: '40%', label: '位置', key: 'place',align:'left' },
                { width: '20%', label: '时间', key: 'time',},
                { width: '20%', label: '震级(Mw)', key: 'mag' },
                { width: '20%', label: '深度(Km)',key: 'depth' },
            ], // 历史地震表头
            historyData: [], // 历史地震
            // 各位置损失评估结果
            placeCol: [
                { width: '30%', label: '位置', key: 'place',align:'left' },
                { width: '23%', label: '经纬度', key: 'center' },
                { width: '16%', label: '震源距',sublabel:'(Km)', key: 'dist' },
                { width: '14%', label: 'PGA',sublabel:'(gal)', key: 'grid_SJ_PGA' },
                { width: '16%', label: '损失估计',sublabel:'(百万元)', key: 'loss_mean' }
            ],
            placeLossData: [],
            tabVal1: 'fatality_population',// population
            fpMax:0,// 人员伤亡估计值
            fpColor:{
                fatality_population:['rgb(255,255,255)','rgb(253,219,199)','rgb(239,138,98)','#F24E4E','rgb(178,24,43)'],
                population:["#ea9c21", "#ea8e21", "#e6721c", "#e55f1d", "#cc2a18"]
            },
            ilColor:[
                { color:"#00ff0d", lable:"烈度VII", value:"125"},
                { color:"#f5f811", lable:"烈度VIII", value:"250"},
                { color:"#f09a09", lable:"烈度IX", value:"500"},
                { color:"#F24E4E", lable:"烈度X", value:"1000"},
            ],// 等烈度线标注
            areaId: 0, // 时间线选项 0当前地震分布点 1人员伤亡热力图 2峰值加速度等值线
            layerList:[
                {
                    label:'地震损失分布',
                    value:0,
                },{
                    label:'人员伤亡',
                    value:1,
                },{
                    label:'等烈度线',
                    value:2,
                },
            ],
        }
    },
    watch: {
    },
    computed: {
    },
    mounted () {
        this.userName = this.$store.state.user.userName
        this.getDzInfo()
    },
    methods: {
        // 切换地震事件
        toScrollData (info) {
            this.areaId=0
            let that = this
            if (info.caculated == 0) {
                that.$Notice.info({
                    title: '应急响应',
                    name: 'dzemergency' + info.eventid,
                    render: h => {
                        return h('div', '已反馈地震事件后果')
                    }
                })
            } else if (info.caculated == 1) {
                if (info.eventid == that.eventid) {
                    return
                }
                that.$router.push({
                    name: 'dzemergency2',
                    query: {
                        eventid: info.eventid
                    }
                })
                setTimeout(() => {
                    that.$router.go(0)
                }, 100)
            } else if (info.caculated == 2) {
                // that.$emit('caculateCUR', data, '地震')
            } else if (info.caculated == 3) {
                that.$Message.info('该地震未产生房屋损失')
            }
        },
        // 获取当前地震信息
        getDzInfo(){
            let that = this
            let search = null
            if(this.$route.query.eventid){
                search={
                    eventid:that.$route.query.eventid
                }
            }
            eventid(search).then(res => {
                // let rs = res.data
                // if (rs.code == 0) {
                    let data = res.data[0]
                    that.pointCenter = [data.longitude * 1, data.latitude * 1]
                    data.time=moment(data.time).format('YYYY年MM月DD日')
                    that.baseInfo = data
                    that.getAreaHistoryData()
                    setTimeout(() => {
                        that.$refs.country.initBasicMap()
                        that.areaIdChange(0)
                        that.getGridData()
                    }, 100)
                    setTimeout(()=>{
                        that.animLeft=true
                        that.animRight=true
                        that.getfatalityu()
                        that.getLossRes()
                    },4000)
                // } else {
                //     that.$Message.error(rs.msg)
                // }
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        },
        // 历史地震全屏展示
        hisMapDisplay(){
            this.animLeft=false
            this.animRight=false
            this.allHisShow=true
            this.areaId=0
            this.tabVal1 = 'fatality_population'
            this.$refs.country.clearLayer()
            this.$refs.country.removeMarker()
            setTimeout(() => {
                this.$refs.country.changePointHis(this.historyData)
            }, 1000);
        },
        // 是否展开地图
        isCollage(){
            this.animLeft=!this.animLeft
            this.animRight=!this.animRight
            if(this.allHisShow){
                this.allHisShow=false
                this.areaIdChange(0)
                this.getfatalityu()
                this.getLossRes()
                this.$refs.country.initMarker()
            }
        },
        // 地图图层切换 0当前地震分布点 1人员伤亡热力图 2峰值加速度等值线
        areaIdChange (index) {
            this.$refs.country.clearLayer()
            this.tabVal1 = 'fatality_population'
            this.areaId = index
            switch (index) {
                case 0:
                this.getdrloss()
                break
                case 1:
                this.getFatalityP('fatality_population')
                break
                case 2:
                this.getISOLine()
                break
            }
        },
        /* 图表数据获取开始 */
        // 获取区域历史地震事件
        getAreaHistoryData () {
            let that = this
            eventid({
                nation: that.baseInfo.nation
            }).then(res => {
                let data = res.data
                for (let i in data) {
                    data[i].time = data[i].time.replace('T', ' ').replace('Z', ' ').split('.')[0]
                    data[i].center = [data[i].longitude * 1, data[i].latitude * 1]
                    data[i].id = uuid()
                }
                data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                that.historyData = data
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        },
        // 获取人员伤亡数据
        getfatalityu () {
            let that = this
            fatality_uncertainty({
                eventid: that.baseInfo.eventid
            }).then(res => {
                let data = res.data
                // let data = rs.result
                let infoObj = [],avg=0
                for (let i in data) {
                    if(Number((data[i].fatality_probability * 1).toFixed(5))!==0){
                        data[i].fatality_uncertainty = Number((data[i].fatality_uncertainty * 1).toFixed(3))
                        data[i]._col1 = Number((data[i].fatality_probability * 1).toFixed(5))
                        infoObj.push([data[i].fatality_uncertainty,data[i].fatality_probability])
                        data[i].fatality_uncertainty=Number(data[i].fatality_uncertainty)
                        data[i]._col1=Number(data[i]._col1)
                        avg=avg+(data[i].fatality_uncertainty*data[i]._col1)
                    }
                }
                avg=Math.ceil(avg)
                that.$refs.rediusBar.updateData(infoObj,avg,'死亡人数', '概率(%)')
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        },
        // 整体损失评估结果
        getLossRes () {
            let that = this
            stimulate_time({
                eventid: that.baseInfo.eventid
            }).then(res => {
                let rs = res.data[0]
                let data = JSON.parse(rs.loss_list)
                // that.simFieId = ['loss', 'stimulate_time']
                let total = 0
                let obj = {
                    list:[],
                    xData:[]
                }
                for (let i in data) {
                    total = total + (data[i] / 100000000).toFixed(3) * 1
                    obj.list.push((data[i] / 100000000).toFixed(3) * 1)
                    obj.xData.push(i*1+1)
                }
                let avg = (total / data.length).toFixed(2) * 1
                that.$refs.histogram.updateData(obj.list,avg, '金额(亿元)', '概率(%)')
                that.$refs.areaStack.updateData(obj,avg, '模拟次数', '损失金额(亿元)')
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        },
        // 个位置损失估计
        getGridData () {
            let that = this
            that.placeLossData = []
            roll_show({
                eventid: that.baseInfo.eventid
            }).then(res => {
                let data = res.data
                for (let i in data) {
                    data[i].center = [(data[i].longitud_1 * 1).toFixed(2) * 1, (data[i].latitude_1 * 1).toFixed(2) * 1]
                    data[i].place = data[i].perfe_1+data[i].perfe_2
                    data[i].loss_mean = (data[i].loss_avg/1000000).toFixed(3) * 1
                    data[i].grid_SJ_PGA = ((data[i].grid_cz_pga * 1).toFixed(2)) * 1
                    data[i].dist = ((data[i].dcj_mid * 1).toFixed(2)) * 1
                    data[i].id = uuid()
                }
                that.placeLossData = data
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        },
        /* 图表数据获取结束 */

        /* 地图图层数据获取开始 */
        // 获取当前地震损失
        getdrloss () {
            let that = this
            let search = null
            search = {
                eventid: that.baseInfo.eventid,
                // loss_min: '10'
            }
            dr_loss(search).then(res => {
                let data = res.data
                if (data.length>0) {
                    for(let i in data){
                        data[i].latitude=data[i].latitude_1
                        data[i].longitude=data[i].longitud_1
                    }
                    let max = parseInt(data.sort(compare('loss_avg', false))[0].loss_avg)
                    that.$refs.country.changePointObj(data, max)
                }
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        },
        // 切换人员伤亡图层
        accOrlocChange (name) {
            this.$refs.country.clearLayer()
            this.tabVal1 = name
            this.getFatalityP(name)
        },
        // 获取人员伤亡数据
        getFatalityP (type) {
            let that = this
            this.fpMax=0
            // fatality population
            dr_loss({ eventid: that.baseInfo.eventid }).then(res => {
                let data = res.data
                if (data.length>0) {
                    for(let i in data){
                        data[i].latitude=data[i].latitude_1
                        data[i].longitude=data[i].longitud_1
                    }
                    that.fpMax = data.sort(compare(type, false))[0][type]
                    that.$refs.country.changeHeatobj(data, that.fpMax, type)
                }
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        },
        // 获取峰值加速度等值线
        getISOLine () {
            let that = this
            contour_line({
                eventid: that.baseInfo.eventid
            }).then(res => {
                let data = res.data
                if (data.length>0) {
                    let max = data.sort(compare('contourval', false))[0].contourval
                    that.$refs.country.changeLineobj(data, max)
                } else {
                    that.$Message.info('本次事件没有等烈度线！')
                }
            }).catch(err => {
                console.log(err) // that.$Message.error('系统错误')
            })
        // that.isoLineData = PGAPOINTS
        // that.upDateLine(PGAPOINTS)
        },
        /* 地图图层数据获取结束 */
        // 返回主页
        goback(){
            this.$router.push({name:"index"})
        },
        // 屏幕发生变化
        resize(val){
            this.ifresize=7
        },
    }
  }
</script>
