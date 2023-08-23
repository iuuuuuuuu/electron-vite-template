import { appName } from '@renderer/config/renderConfigs'

const indexedDb = window.indexedDB
const dbName = `${appName}-db`
const dbVersion = 1
const dataBaseName = `${dbName}-${dbVersion}-dataBase`

let request: IDBOpenDBRequest | null = null
let db: IDBDatabase

export const connectIndexedDB = () => {
  if (request) {
    return request
  }
  request = indexedDb.open(dataBaseName, dbVersion)
  request.onerror = function (event: Event) {
    console.log('数据库打开报错', event.type)
  }

  request.onsuccess = function (event) {
    if (event.target) {
      db = event.target['result']
      console.log('数据库打开成功', event.type)
    }
  }

  request.onupgradeneeded = function (event) {
    if (event.target) {
      db = event.target['result']
      let objectStore
      if (!db.objectStoreNames.contains(dataBaseName)) {
        objectStore = db.createObjectStore(dataBaseName, { keyPath: 'id' }) // 创建表
        // objectStore.createIndex('name', 'name', { unique: true }) // 创建索引 可以让你搜索任意字段
      }
      console.log('数据库升级成功', event.type, objectStore)
    }
  }
  return request
}

type tempType = boolean | any
export default class IuIndexedDB {
  private constructor() {}
  public static setData(id: number | string, data: any): Promise<tempType> {
    return new Promise(async (resolve, reject) => {
      const resp = await this.getData(id)
      if (resp) {
        const request = db
          .transaction([dataBaseName], 'readwrite')
          .objectStore(dataBaseName)
          .add({ id, ...data })
        request.onsuccess = () => {
          resolve(data)
        }
        request.onerror = () => {
          reject(false)
        }
      } else {
        this.updateData(id, data)
      }
    })
  }
  public static getData(id: number | string): Promise<tempType> {
    return new Promise((resolve, reject) => {
      const request = db.transaction([dataBaseName], 'readwrite').objectStore(dataBaseName).get(id)
      request.onsuccess = () => {
        if (request.result) delete request.result.id
        resolve(request.result)
      }
      request.onerror = () => {
        reject(false)
      }
    })
  }
  public static updateData(id: number | string, data: any): Promise<tempType> {
    return new Promise((resolve, reject) => {
      delete data.id
      const params = {
        id,
        ...data
      }
      const request = db
        .transaction([dataBaseName], 'readwrite') // 事务对象
        .objectStore(dataBaseName) // 仓库对象
        .put(params)

      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(false)
      }
    })
  }
  public static deleteData(id: number | string): Promise<tempType> {
    return new Promise((resolve, reject) => {
      const request = db
        .transaction([dataBaseName], 'readwrite')
        .objectStore(dataBaseName)
        .delete(id)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(false)
      }
    })
  }
}
