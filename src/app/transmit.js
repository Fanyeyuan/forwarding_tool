import * as jt from './jiutian'
import XPH from './xph'
// import { protocol } from 'electron'
import db from '@/app/database/index'

const defaultPk = '75b644204a06489ab8a83091c2137456'

const eleTable =[
    {"name":"风速","range":"0-45m/s ,  ","sign":"04003"},
    {"name":"风向","range":"0~360度,    ","sign":"04004"},
    {"name":"大气温度","range":"﹣50～100℃,  ","sign":"04005"},
    {"name":"大气湿度","range":"0~100%RH, ","sign":"04006"},
    {"name":"大气压力","range":"","sign":"04007"},
    {"name":"光照强度","range":"0-200000lux","sign":"04009"},
    {"name":"光照辐射","range":"","sign":"04010"},
    {"name":"光照时长","range":"0-24H","sign":"04011"},
    {"name":"降雨量","range":"≤4mm/min, ","sign":"04012"},
    {"name":"日雨","range":"","sign":"04025"},
    {"name":"蒸发量","range":"0-1000mm","sign":"04013"},
    {"name":"土壤温度","range":"","sign":"04081"},
    {"name":"土壤湿度","range":"","sign":"04082"},
    {"name":"土壤电导率","range":"","sign":"04026"},
    {"name":"土壤pH","range":"","sign":"04084"},
    {"name":"土壤温度","range":"﹣50-100℃","sign":"04014"},
    {"name":"土壤湿度","range":"0-100%RH","sign":"04015"},
    {"name":"土壤盐分","range":"0-20000mg/l","sign":"04016"},
    {"name":"土壤PH","range":"0-14ph","sign":"04017"},
    {"name":"水层盐分","range":"0-20000mg/l","sign":"04027"},
    {"name":"水层PH","range":"0-14ph","sign":"04028"},
    {"name":"水层温度","range":"﹣50-80℃","sign":"04029"},
    {"name":"电导率","range":"","sign":"04008"},
    {"name":"水层液位","range":"0-1000mm","sign":"04030"},
    {"name":"温度","range":"","sign":"04018"},
    {"name":"水质PH","range":"0-14ph","sign":"04019"},
    {"name":"溶解氧","range":"","sign":"04020"},
    {"name":"浊度","range":"","sign":"04021"},
    {"name":"氨氮浓度","range":"","sign":"04022"},
    {"name":"硫化氢浓度","range":"","sign":"04024"},
    {"name":"亚硝酸盐含量","range":"","sign":"04031"},
    {"name":"液位","range":"","sign":"04032"},
    {"name":"盐分","range":"","sign":"04081"},
    {"name":"叶面温度传感器","range":"","sign":"04034"},
    {"name":"叶面湿度传感器","range":"","sign":"04035"},
    {"name":"10cm土壤温度","range":"","sign":"04072"},
    {"name":"20cm土壤温度","range":"","sign":"04073"},
    {"name":"30cm土壤温度","range":"","sign":"04074"},
    {"name":"40cm土壤温度","range":"","sign":"04075"},
    {"name":"10cm土壤湿度","range":"","sign":"04076"},
    {"name":"20cm土壤湿度","range":"","sign":"04077"},
    {"name":"30cm土壤湿度","range":"","sign":"04078"},
    {"name":"40cm土壤湿度","range":"","sign":"04079"},
    {"name":"电压","range":"","sign":"04080"},
    ]

const transDataFormat = (id, data) => {
    let result = {
        id,
        method:  "thing.event.property.post",
        params: {
            status: 1,
            data: {}
        },
        version: '1.0'
    }
    for(let ele of data){
        const sensor = eleTable.filter(param => ele.eName === param.name)
        if(sensor.length){
            // result.params.data[sensor[0].sign] = (0x7fff/ele.eValue)%10 !== 0?ele.eValue:'0'
            result.params.data[sensor[0].sign] = ele.eValue
        }
    }
    console.log(result)
    return result
}

const getProductKey = (id) =>{
    let pk = jtTransmit.data.get(id).state.pk
    if(!pk || !/^[A-Za-z0-9]+$/.test(pk)) pk = defaultPk
    return pk
}

const getData = async (xph)=>{
    if(xph.devices.length){
        xph.devices.map((device) => {
            xph.getRealData(device.id)
            xph.getDeviceRelayState(device.id)
            jtTransmit.methods.data(device.id, xph.reals.get(device.id))

            jtTransmit.data.set(device.id, {
                id: device.id,
                real: xph.reals.get(device.id)??[],
                vavle: xph.relays.get(device.id)??[],
                state: {
                    pk: device.pk,
                    name: device.name,
                    online: true,
                    uploadTime: new Date().getTime()
                }
            })
            // console.log(xph.reals.get(device.id),xph.relays.get(device.id),jtTransmit.data.get(device.id),device.id)
        })
    }
}

let timerHander = null
const jtTransmit_init = async function () {
    let xph = new XPH()

    await xph.loginIot(jtTransmit.info.username, jtTransmit.info.password)
    if(xph.userInfo.isLogin){
      if(xph.devices.length === 0){
        await xph.getDevices()

        xph.devices.map((device) => {
            let pk = device.pk
            if(!pk || !/^[A-Za-z0-9]+$/.test(pk)) pk = defaultPk
            jt.control(pk, jt.topic.splitDeviceName(device.id),jtTransmit.methods.control)
        })
      }
    }
    else{
        console.log('当前未登陆，请先登陆')
    }

    // console.log(xph)
    setTimeout(()=>{
        getData(xph)
        if(jtTransmit.methods.fresh)
            jtTransmit.methods.fresh(jtTransmit)
    }, 1000)

    if(timerHander != null) clearInterval(timerHander)
    timerHander = setInterval(function () {
        getData(xph)
        // console.log(jtTransmit)
        if(jtTransmit.methods.fresh)
            jtTransmit.methods.fresh(jtTransmit)
        // console.log(jtTransmit)
   }, jtTransmit.info.interval*60*1000);
//  }   , 1*1000);
}

const upload = (id, data) => {
    // console.log(typeof data, data)
    if(!!id && !!data && data.length){
        let pk = getProductKey(id)
        data = transDataFormat(id, data)
        console.log(pk)
        jt.uploadData(pk, jt.topic.splitDeviceName(id),JSON.stringify(data))
    }
}

const control = (topic, message)=>{
    console.log(topic, message)
}

const fresh = (pro) =>{
    return pro
}

let jtTransmit = 
{
    name: "九天",
    sign: 'xph2jt',
    data: new Map(),
    methods:{
        init: jtTransmit_init,
        data: upload,
        control: control,
        fresh
    },
    info:{
        name: 'xph2jt',
        used: true,
        interval: 1,
        username: '',
        password: ''
    }
}


let transmit = [
    jtTransmit
]

transmit.map(async ele => {
    let data = db.find('settings', {name: ele.sign})
    if(!data){
        await db.insert('settings', ele.info) 
        data = db.find('settings', {name: ele.sign})
        console.log(data)
    }
    ele.info = data
})

export {
    transmit
}