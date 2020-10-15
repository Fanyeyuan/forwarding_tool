import Client from "./common/mqtt";

let serverUrl = "mqtt://iotlink.houtucloud.net:666";
let username = "root"; //0044988 老平台 设备  jiutian新平台
let password = "123456";

const topic = {
  splitDeviceName: function(id, index) {
    if (!index) {
      return `JT00${id}`;
    } else {
      if (Number(index) < 10) {
        return `JT0${index}${id}`;
      } else {
        return `JT${index}${id}`;
      }
    }
  },
  getDataTopic: function(pk, dn) {
    return `sys/${pk}/${dn}/thing/event/property/post`;
  },
  getControlTopic: function(pk, dn) {
    return `sys/${pk}/${dn}/thing/event/property/set`;
  },
};

const jt = new Client(serverUrl, username, password);

const uploadData = (pk, dn, data) => {
  // console.log(pk, dn, data)
  const tpc = topic.getDataTopic(pk, dn);

  jt.publish(tpc, data);
};

const control = (pk, dn, callback) => {
  const tpc = topic.getControlTopic(pk, dn);

  if (callback)
    jt.subscribe(tpc, (err) => {
      if (!err) {
        // console.log(granted)
        jt.on("message", callback);
      } else {
        throw Error(err);
      }
    });
  else throw Error("callback is no define");
};

const setServeInfo = (user, psd, url) => {
  if (user) username = user;
  if (psd) password = psd;
  if (url) serverUrl = url;
};
export { jt, topic, uploadData, control, setServeInfo };
