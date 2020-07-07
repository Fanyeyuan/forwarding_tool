import * as jt from './jiutian'
import XPH from './xph'
// import { protocol } from 'electron'
import db from '@/app/database/index'

const defaultPk = '75b644204a06489ab8a83091c2137456'

const eleTable = db.get('params')

const transDataFormat = (id, data) => {
    let time = new Date().getTime()
    let result = {
        id,
        method:  "thing.event.property.post",
        timeStamp: parseInt(time/1000),
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
        data = transDataFormat(jt.topic.splitDeviceName(id), data)
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