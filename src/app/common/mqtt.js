class Client {
  url = "mqtt://broker.emqx.io:1883/mqtt";
  isConnected = false;
  client = {};
  event = new Map();

  options = {
    connectTimeout: 4000,
    clientId: this.generateUUID(),
    username: "root",
    password: "123456",
  };

  generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  constructor(url, username, password, clientId, timeout) {
    if (url) this.url = url;
    if (username) this.options.username = username;
    if (password) this.options.password = password;
    if (clientId) this.options.clientId = clientId;
    if (timeout) this.options.timeout = timeout;
    let mqtt = null;
    if (mqtt) {
      mqtt = require("mqtt/dist/mqtt");
    } else {
      mqtt = require("mqtt");
    }
    this.client = mqtt.connect(this.url, this.options);

    this.client.on("reconnect", (error) => {
      this.isConnected = false;
      if (this.event.get("reconnect")) {
        this.event.get("reconnect")();
      } else {
        console.log("正在重联：", error);
      }
    });

    this.client.on("error", (error) => {
      this.isConnected = false;
      if (this.event.get("error")) {
        this.event.get("error")(error);
      } else {
        console.log("链接失败:", error);
      }
    });

    this.client.on("connect", () => {
      this.isConnected = true;
      if (this.event.get("connect")) {
        this.event.get("connect")();
      }
    });

    this.client.on("message", (topic, message) => {
      // console.log(this.event)
      if (this.event.get("message")) {
        this.event.get("message")(topic, message);
      } else {
        // message is Buffer
        console.log(message.toString());
      }
    });
  }

  on(name, callback) {
    this.event.set(name, callback);
    // console.log(name, callback,this.event)
  }

  publish(topic, message) {
    // console.log(`将想(${this.url} 发送 主题(${topic}))--payload(${message})`);
    this.client.publish(topic, message);
  }

  subscribe(topics, callback) {
    if (topics.constructor === "Array") {
      topics.forEach((element) => {
        this.client.subscribe(element, callback);
      });
    } else {
      this.client.subscribe(topics, callback);
    }
  }
}

export default Client;
