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
