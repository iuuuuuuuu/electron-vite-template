type storageKey = 'token' | 'refreshToken' | 'userInfo' | 'expiresIn'

export default class iuStorage {
  public constructor() {}
  public static setItem(key: storageKey, value: any) {
    value = JSON.stringify(value)
    localStorage.setItem(key, value)
  }
  public static getItem<T>(key: storageKey): T {
    let value = localStorage.getItem(key)
    try {
      value && (value = JSON.parse(value))
    } catch (error) {}
    return value as T
  }
}
