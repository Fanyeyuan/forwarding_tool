import * as jt from "./jiutian";
import XPH from "./xph";
// import { protocol } from 'electron'
import db from "@/app/database/index";

const defaultPk = "75b644204a06489ab8a83091c2137456";

const eleTable = db.get("params");

//单个设备时使用
const transDataFormat = (id, data) => {
  let time = new Date().getTime();
  let result = {
    id,
    method: "thing.event.property.post",
    timeStamp: parseInt(time / 1000),
    params: {
      status: 1,
      data: {},
    },
    version: "1.0",
  };
  for (let ele of data) {
    const sensor = eleTable.filter((param) => ele.eName === param.name);
    if (sensor.length) {
      // result.params.data[sensor[0].sign] = (0x7fff/ele.eValue)%10 !== 0?ele.eValue:'0'
      if (
        ele.eValue === 327670 ||
        ele.eValue === 32767 ||
        ele.eValue === 3276.7 ||
        ele.eValue === 327.67 ||
        ele.eValue === 32.767 ||
        ele.eValue === 3.2767 ||
        ele.eValue === 0.32767
      )
        continue;
      result.params.data[sensor[0].sign] = ele.eValue;
    }
  }
  console.log(result);
  return result;
};

//多个设备时
const transDataFormatMult = (index, id, data) => {
  let time = new Date().getTime();
  let result = {
    id,
    method: "thing.event.property.post",
    timeStamp: parseInt(time / 1000),
    params: {
      status: 1,
      data: {},
    },
    version: "1.0",
  };
  for (let ele of data) {
    const eName = ele.eName.split("-");
    if (Number(eName[0]) !== index + 1) continue;
    const sensor = eleTable.filter((param) => eName[1] === param.name);
    if (sensor.length) {
      // result.params.data[sensor[0].sign] = (0x7fff/ele.eValue)%10 !== 0?ele.eValue:'0'
      if (
        ele.eValue == 327670 ||
        ele.eValue == 32767 ||
        ele.eValue == 3276.7 ||
        ele.eValue == 327.67 ||
        ele.eValue == 32.767 ||
        ele.eValue == 3.2767 ||
        ele.eValue == 0.32767
      )
        continue;
      console.log(ele.eValue, typeof ele.eValue);
      result.params.data[sensor[0].sign] = ele.eValue;
    }
  }
  console.log(result);
  return result;
};

const getProductKey = (id) => {
  let pk = jtTransmit.data.get(id).state.pk;
  if (!pk || !/^[A-Za-z0-9,]+$/.test(pk)) pk = defaultPk;
  return pk;
};

const getData = async (xph) => {
  if (xph.devices.length) {
    xph.devices.map((device) => {
      xph.getRealData(device.id);
      xph.getDeviceRelayState(device.id);
      jtTransmit.methods.data(device.id, xph.reals.get(device.id));

      jtTransmit.data.set(device.id, {
        id: device.id,
        real: xph.reals.get(device.id) ?? [],
        vavle: xph.relays.get(device.id) ?? [],
        state: {
          pk: device.pk,
          name: device.name,
          online: true,
          uploadTime: new Date().getTime(),
        },
      });
      // console.log(xph.reals.get(device.id),xph.relays.get(device.id),jtTransmit.data.get(device.id),device.id)
    });
  }
};

let timerHander = null;
const jtTransmit_init = async function() {
  let xph = new XPH();

  await xph.loginIot(jtTransmit.info.username, jtTransmit.info.password);
  if (xph.userInfo.isLogin) {
    if (xph.devices.length === 0) {
      await xph.getDevices();

      xph.devices.map((device) => {
        let pk = device.pk;
        if (!pk || !/^[A-Za-z0-9,]+$/.test(pk)) pk = defaultPk;
        jt.control(
          pk,
          jt.topic.splitDeviceName(device.id),
          jtTransmit.methods.control
        );
      });
    }
  } else {
    console.log("当前未登陆，请先登陆");
  }

  // console.log(xph)
  setTimeout(() => {
    getData(xph);
    if (jtTransmit.methods.fresh) jtTransmit.methods.fresh(jtTransmit);
  }, 1000);

  if (timerHander != null) clearInterval(timerHander);
  timerHander = setInterval(function() {
    getData(xph);
    // console.log(jtTransmit)
    if (jtTransmit.methods.fresh) jtTransmit.methods.fresh(jtTransmit);
    // console.log(jtTransmit)
  }, jtTransmit.info.interval * 60 * 1000);
  //   }, 10 * 1000);
};

const upload = (id, data) => {
  // console.log(typeof data, data)
  if (!!id && !!data && data.length) {
    let pk = getProductKey(id).replace(/\s*/g, "");

    if (pk.length <= 32) {
      let real = transDataFormat(jt.topic.splitDeviceName(id), data);
      console.log(pk);
      jt.uploadData(pk, jt.topic.splitDeviceName(id), JSON.stringify(real));
    } else {
      let devs = pk.split(",");
      devs.map((pk, index) => {
        let real = transDataFormatMult(
          index,
          jt.topic.splitDeviceName(id, index + 1),
          data
        );
        // if (index === 1) {
        //   real = {
        //     id: "JT0216068226",
        //     method: "thing.event.property.post",
        //     timeStamp: parseInt(new Date().getTime() / 1000),
        //     params: {
        //       status: 1,
        //       data: {
        //         "04017": "8.62", //土壤盐分
        //         "04028": "8.03", //水层PH
        //         "04016": "1160", //土壤盐分
        //         "04027": "860", //水层盐分
        //         "04014": "23.9", //土壤温度
        //         "04015": "82", //土壤湿度
        //         "04029": "24.6", //水层温度
        //       },
        //     },
        //     version: "1.0",
        //   };
        // }
        console.log(pk, JSON.stringify(real));
        jt.uploadData(
          pk,
          jt.topic.splitDeviceName(id, index + 1),
          JSON.stringify(real)
        );
      });
    }
  }
};

const control = (topic, message) => {
  console.log(topic, message);
};

const fresh = (pro) => {
  return pro;
};

let jtTransmit = {
  name: "九天",
  sign: "xph2jt",
  data: new Map(),
  methods: {
    init: jtTransmit_init,
    data: upload,
    control: control,
    fresh,
  },
  info: {
    name: "xph2jt",
    used: true,
    interval: 1,
    username: "",
    password: "",
  },
};

let transmit = [jtTransmit];

transmit.map(async (ele) => {
  let data = db.find("settings", { name: ele.sign });
  if (!data) {
    await db.insert("settings", ele.info);
    data = db.find("settings", { name: ele.sign });
    console.log(data);
  }
  ele.info = data;
});

export { transmit };
