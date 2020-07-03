<template>
    <div class="list">
        <el-collapse accordion>
            <el-collapse-item v-for="(device, index) in devices" :key="index">
                <template slot="title">
                    <div class="listTitle">
                        <span>设备编号:<em>{{device.id}}</em></span>
                        <span>设备名称:<em>{{device.state.name}}</em></span>
                        <span>更新时间:<em>{{formatTimer(device.state.uploadTime)}}</em></span>
                        <span><i class="el-icon-success" :class="{online:device.state.online}"></i></span>
                    </div>
                </template>
                <Reals :real="device.real" :vavle="device.vavle"></Reals>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import Reals from './Reals'
import moment from 'moment'
    export default {
        data() {
            return {
            }
        },
        props: {
            devices: {
                type: Array,
                default: () => []
            },
        },
        methods: {
            formatTimer(time) {
                return moment(time).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        mounted () {
        },
        beforeUpdate(){
            // console.log(this.devices)
        },
        components:{
            Reals
        }
    }
</script>

<style lang="scss" scoped>
.list{
    .listTitle{
        width: 100%;
        // height: 80px;
        // line-height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span{
            font-size: 12px;
            margin-left: 20px;
            text-align: left;

            em{
                margin-left: 10px;
                color: rgb(7, 107, 114);
                font-size: 18px;
                font-weight: bold;
            }

            &:nth-of-type(2){
                display: inline-block;
                width: 200px;
            }
        }
        .online{
            color: green;
        }
    }
}
</style>