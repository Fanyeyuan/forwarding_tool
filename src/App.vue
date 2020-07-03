<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import { ipcRenderer } from 'electron'

export default {
  created () {
    ipcRenderer.on('router', (event, message) => {
      if(!this.$route.path.includes(message))
        this.$router.push(message)
    });
  }
}
</script> 
<style lang="scss" scope>
  #app{
    min-width: 880px;
    // padding-right: 10px;
    margin: 0 auto;
    // .tab{
    //   .el-tabs__nav{
    //     display: flex !important;
    //     justify-content: center !important;
    //   }
    // }
  }
</style>
