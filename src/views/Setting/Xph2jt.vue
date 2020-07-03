<template>
    <div class="xph" v-if="!!protocol.info">
        <div>
            <span>是否启用：</span>
            <el-switch
            v-model="protocol.info.used"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
        </div>
        <el-divider></el-divider>
        <div>
            <span>数据刷新间隔：</span>
            <el-input-number v-model="protocol.info.interval" :step="2" size="mini" ></el-input-number>
            <span>分钟</span>
        </div>
        <el-divider></el-divider>
        <div>
            <p>XPH平台账号</p>
            <div class="info-secret">
                <span>用户名：</span>
                <el-input
                    class="info-username"
                    placeholder="请输入用户名"
                    v-model="protocol.info.username"
                    clearable>
                </el-input>
                <span>密码：</span>
                <el-input class="info-username" placeholder="请输入密码" v-model="protocol.info.password" show-password clearable></el-input>
            </div>
        </div>
        <el-divider></el-divider>
        <div class="confirm">
            <el-button type="primary" round plain @click="save">确定</el-button>
        </div>
    </div>
</template>

<script>
import {transmit} from '@/app/transmit'
import db from '@/app/database/index'
export default {
    data() {
        return {
            protocol: {},
        }
    },
    methods: {
        save(){
            const result = db.update('settings', this.protocol.info.id, this.protocol.info)
            console.log(result)
        }
    },
    mounted () {
        this.protocol = transmit.filter(ele => ele.sign === this.$route.name)[0]
    },
}
</script>

<style lang="scss" scoped>
li{list-style: none;}
.xph{
    // display: flex;
    // justify-content: start;
    // flex-wrap: wrap;
    padding: 10px 20px;
    .info-secret{
        span{
            padding-left: 20px;
        }
        .el-input{
            width: 180px;
        }
    }
    .confirm{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>