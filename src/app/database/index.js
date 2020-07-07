import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import LodashID from 'lodash-id'
import { app, remote } from 'electron'

const isRenderer = process.type === 'renderer'
// Render process use remote app
const APP = isRenderer ? remote.app : app
const STORE_PATH = APP.getPath('userData')

// In production mode, during the first open application
// APP.getPath('userData') gets the path nested and the datastore.js is loaded.
// if it doesn't exist, create it.
if (!isRenderer) {
    if (!fs.pathExistsSync(STORE_PATH)) {
        fs.mkdirpSync(STORE_PATH)
    }
}
const eleTable =[
    {"name":"风速","range":"0-45m/s","sign":"04003"},
    {"name":"风向","range":"0~360度","sign":"04004"},
    {"name":"大气温度","range":"﹣50～100℃","sign":"04005"},
    {"name":"大气湿度","range":"0~100%RH","sign":"04006"},
    {"name":"大气压力","range":"","sign":"04007"},
    {"name":"光照强度","range":"0-200000lux","sign":"04009"},
    {"name":"光照辐射","range":"","sign":"04010"},
    {"name":"光照时长","range":"0-24H","sign":"04011"},
    {"name":"降雨量","range":"≤4mm/min","sign":"04012"},
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

class DB {
    db = {}
    constructor() {
        const adapter = new FileSync(path.join(STORE_PATH, '/db.json'))
        // console.log(path.join(STORE_PATH, '/db.json'))
        this.db = Lowdb(adapter)
        // Use lodash-id must use insert methods
        this.db._.mixin(LodashID)

        if (!this.db.has('windowSize').value()) {
          this.db
            .set('windowSize', {
              width: 1025,
              height: 749,
            })
            .write()
        }
        if (!this.db.has('settings').value()) {
        this.db
            .set('settings', [{
                name: 'xph2jt',
                used: true,
                interval: 1,
                username: 'jiutian',
                password: '123456'
            }])
            .write()
        }
        if (!this.db.has('params').value()) {
        this.db
            .set('params', eleTable)
            .write()
        }
    }

    // read() is to keep the data of the main process and the rendering process up to date.
    read() {
      return this.db.read()
    }

    get(key) {
      return this.read()
        .get(key)
        .value()
    }
    find(key, id) {
      const data = this.read().get(key)
      if(typeof id !== "object"){
        return data
          .find({ id })
          .value()
      } else {
        return data
          .find(id)
          .value()
      }
    }
    set(key, value) {
      return this.read()
        .set(key, value)
        .write()
    }
    insert(key, value) {
      const data = this.read().get(key)
      return data
        .insert(value)
        .write()
    }
    update(key, id, value) {
      const data = this.read().get(key)
      return data
        .find({ id })
        .assign(value)
        .write()
    }
    remove(key, id) {
      const data = this.read().get(key)
      return data
        .removeById(id)
        .write()
    }
    filter(key, query) {
      const data = this.read().get(key)
      return data
        .filter(query)
        .value()
    }
    has(key) {
      return this.read()
        .has(key)
        .value()
    }
}

export default new DB()
