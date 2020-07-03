//vue单文件
<template>
  <div class="hello">
    <h1>收到的消息:{{msg}}</h1>
    <button @click="handleclick">发布</button>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  name: "HelloWorld",
  data() {
    return {
      mtopic: "1101",
      msg: "lalala",
      client: {}
    };
  },
  mounted() {
    this.client = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
      username: "admin",
      password: "password"
    });
    this.client.on("connect", () =>{
      console.log("连接成功");
      this.client.subscribe(this.mtopic, (err)=> {
        if (!err) {
          console.log("订阅成功:" + this.mtopic);
        }
      });
    });
    this.client.on("message", (topic, message) => {
      this.msg = message
    });
  },
  methods: {
    handleclick: function() {
      this.client.publish(this.mtopic, this.msg);
    }
  }
};
</script>
