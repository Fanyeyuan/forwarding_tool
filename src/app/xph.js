import axios from "axios";

class XPH {
  baseUrl = "http://47.105.215.208:8005";
  userInfo = {};
  devices = [];
  dataFreshTime = 0;
  reals = new Map();
  relays = new Map();

  constructor(baseUrl) {
    if (baseUrl) this.baseUrl = baseUrl;
  }

  getRealData(id) {
    return axios
      .get(`${this.baseUrl}/intfa/queryData/${id}`)
      .then((res) => {
        this.dataFreshTime = new Date().getTime();
        this.reals.set(id, res.data.entity);
        return res.data.entity;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  loginIot(username, password) {
    return axios
      .post(`${this.baseUrl}/login`, {
        username,
        password,
      })
      .then((res) => {
        this.userInfo = {
          username,
          password,
          token: res.data.token,
          isLogin: true,
        };
        // console.log(this.userInfo)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getDevices() {
    if (!this.userInfo.username || !this.userInfo.token) {
      console.log("请先登陆");
      return false;
    }

    return axios
      .get(`${this.baseUrl}/user/${this.userInfo.username}`, {
        headers: {
          token: this.userInfo.token,
        },
      })
      .then((res) => {
        const info = res.data;
        if (info.devices) {
          this.devices = info.devices.map((device) => {
            return {
              id: device.facId,
              name: device.facName,
              pk: device.remark,
            };
          });
          // console.log(this.devices)
        }
      })
      .catch((err) => {
        console.log(err);
        this.loginIot(this.info.username, this.info.password);
      });
  }

  getDeviceRelayState(id) {
    if (!this.userInfo.username || !this.userInfo.token) {
      console.log("请先登陆");
      return false;
    }

    return axios
      .get(`${this.baseUrl}/data/${id}`, {
        headers: {
          token: this.userInfo.token,
        },
      })
      .then((res) => {
        const info = res.data;
        let relays = [];
        if (info) {
          for (let i = 1; i <= 32; i++) {
            relays[i - 1] = info[`j${i}`];
          }
          // console.log(this.relays)
          this.relays.set(id, relays);
        }
      })
      .catch((err) => {
        console.log(err, this.userInfo);
        this.loginIot(this.userInfo.username, this.userInfo.password);
      });
  }

  sample(username, password) {
    if (!username || !password) {
      console.log(
        `请输入正确的用户名和密码，当前用户名-${username}/密码-${password}`
      );
      return false;
    }

    this.loginIot(username, password);
    const timerHandle = setInterval(() => {
      if (this.userInfo.isLogin) {
        if (this.devices.length === 0) {
          this.getDevices();
        } else {
          this.devices.map((device) => {
            this.getRealData(device.id);
          });
        }
      } else {
        clearInterval(timerHandle);
        console.log("当前未登陆，请先登陆");
      }
    }, 1000);
  }
}

export default XPH;
