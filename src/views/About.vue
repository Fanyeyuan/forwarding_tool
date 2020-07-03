<template>
  <div class="about">
    <h3>平台转发工具</h3>
    <p v-for="(info, key, index) in infos" :key="index">{{key}}:{{info}}</p>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
  export default {
    data() {
      return {
        infos: []
      }
    },
    mounted () {
      ipcRenderer.send('get-app-info');

      ipcRenderer.on('got-app-info', (event, info) => {
        this.infos = info
      });
    },
  }
</script>
