<template>
    <el-tabs class="tab" :stretch="true" v-model="activeName">
      <el-tab-pane :label="pro.name" :name="pro.sign"
      v-for="(pro, index) in tables" :key="index">
        <div :class="{mask: !pro.info.used}">
          <DeviceList :devices="getData(pro)"/>
        </div>
        <!-- <div v-for="(pro, index)  in list" :key="index">
          {{ pro.id }}
        </div> -->
      </el-tab-pane>
    </el-tabs>
</template>

<script>
import {transmit} from '@/app/transmit'
import DeviceList from '@/components/DeviceList'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data(){
    return{
        activeName: 'second',
        tables: [],
        list: []
    }
  },
  methods:{
      addDevices(protocol){
        let result = this.tables.find((value, index) => {
          if(value.sign === protocol.sign){
            // arr[index] = protocol
            this.tables.splice(index, 1, protocol)
            return true
          }
          return false
        })

        if(!result){
          this.tables.push(protocol)
        }

        // console.log(this.tables, protocol)
      },
    getData(table) {
        let tmp = []
        // console.log(table)
        if(typeof table === 'object')
          for(let ta of table.data){
            tmp.push(ta[1])
          }
        return tmp
      }
  },
  mounted(){
    transmit.map((protocol) =>{
      // if(!!protocol.used){
        protocol.methods.fresh = this.addDevices
        protocol.methods.init('TDtest', '123456', 1)
        this.addDevices(protocol)
      // }
    })
    console.log(this.tables)
    this.activeName = this.tables[0].sign
  },
  components: {
    DeviceList
  }
}
</script>

<style lang="scss" scoped>
.mask{
    position:fixed;
    left:0;
    top:50px;
    opacity:.5;
    width:100%;
    height:100%;
    // background:#000;
    z-index:998;
    pointer-events: none;
}
</style>
