<template>
    <div class="setting">
        <el-tabs class="tab" tab-position="left" :stretch="true" v-model="name" @tab-click="handleClick">
        <el-tab-pane :label="pro.name" :name="pro.sign"
        v-for="(pro, index) in tabs" :key="index">
            <div class="content-wrap" style="height:100%">
              <!-- 展示路由内容 -->
              <router-view/>
            </div>
        </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {transmit} from '@/app/transmit'
export default {
  data(){
    return{
        name: '',
        tabs: []
    }
  },
  methods:{
    handleClick(tab) {
      if(!this.$route.path.includes(tab.name))
        this.$router.push({name: tab.name})
    },
    addDevices(protocol){
        let result = this.tabs.find((value, index) => {
            if(value.sign === protocol.sign){
                this.tabs.splice(index, 1, protocol)
                return true
            }
            return false
        })

        if(!result){
            this.tabs.push(protocol)
        }
    }
  },
  mounted(){
    transmit.map((protocol) =>{
      // if(!!protocol.used){
        this.addDevices(protocol)
      // }
    })
    this.name = this.tabs[0].sign
    if(!this.$route.path.includes(this.name))
    this.$router.push({name: this.name})
  }
}
</script>

<style lang="scss" scoped>

</style>