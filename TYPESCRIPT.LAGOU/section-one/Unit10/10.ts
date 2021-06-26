/*
 * @Descripttion : 泛型
 * @Author       : zhangming
 * @Date         : 2021-06-26 20:44:53
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-27 00:13:43
 */

{
  function reflectOrigin(param: unknown) {
    return param
  }
  const str = reflectOrigin('string') // str 类型是 unknown
  const num = reflectOrigin(1) // num 类型 unknown
}

{
  function reflect<P>(param: P) {
    return param
  }
  const str = reflect('string') // str 类型是 unknown
  const num = reflect(1) // num 类型 unknown

  const reflectStr = reflect<string>('string') // str 类型是 string
  const reflectNum = reflect<number>(1) // num 类型 number

  const reflectStr2 = reflect('string') // str 类型是 string
  const reflectNum2 = reflect(1) // num 类型 number
}

{
  function reflectArray<P>(param: P[]) {
    return param
  }
  const reflectArr = reflectArray([1, '1']) // reflectArr 是 (string | number)[]
  const reflectArr2 = reflectArray([1, 80]) // reflectArr2 是  number[]
}

{
  function reflectExtraParams<P, Q>(p1: P, p2: Q): [P, Q] {
    return [p1, p2]
  }
  let constant = reflectExtraParams(43, [6, 8, 9])
}

// 泛型类

class Memory<S> {
  store: S
  constructor(store: S) {
    this.store = store
  }
  set(store: S) {
    this.store = store
  }
  get() {
    return this.store
  }
}
const numMemory = new Memory<number>(1) // <number> 可缺省
const getNumMemory = numMemory.get() // 类型是 number
numMemory.set(2) // 只能写入 number 类型
const strMemory = new Memory('') // 缺省 <string>
const getStrMemory = strMemory.get() // 类型是 string
strMemory.set('string') // 只能写入 string 类型
// strMemory.set(+'string') // 只能写入 string 类型
