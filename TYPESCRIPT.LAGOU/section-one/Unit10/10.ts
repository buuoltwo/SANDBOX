/*
 * @Descripttion : 泛型
 * @Author       : zhangming
 * @Date         : 2021-06-26 20:44:53
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-27 15:58:37
 */

//泛型就像是类型的函数，它可以抽象、封装并接收（类型）入参，而泛型的入参也拥有类似函数入参的特性。

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
// strMemory.set(+'string') // 只能写入 string 类型
strMemory.set('string') // 只能写入 string 类型

// 泛型类型
// ->type interface

//在 TypeScript 中，类型本身就可以被定义为拥有不明确的类型参数的泛型，并且可以接收明确类型作为入参，从而衍生出更具体的类型
const reflectFn0: <P>(param: P) => P = reflect
// 这里我们为变量 reflectFn 显式添加了泛型类型注解，并将 reflect 函数作为值赋给了它。

type ReflectFuncton = <P>(param: P) => P
const reflectFn2: ReflectFuncton = reflect

interface IReflectFuncton {
  <P>(param: P): P
}
const reflectFn3: IReflectFuncton = reflect

// 具象化泛型
type GenericReflectFunction<P> = (param: P) => P
interface IGenericReflectFunction<P> {
  (param: P): P
}
const reflectFn4: GenericReflectFunction<string> = reflect // 具象化泛型
const reflectFn5: IGenericReflectFunction<number> = reflect // 具象化泛型
// const reflectFn6: IGenericReflectFunction<>= reflect // ts2314
const reflectFn3Return = reflectFn4('string') // 入参和返回值都必须是 string 类型
const reflectFn4Return = reflectFn5(1) //  入参和返回值都必须是 number 类型

// 在泛型定义中，我们甚至可以使用一些类型操作符进行运算表达，使得泛型可以根据入参的类型衍生出各异的类型
type StringOrNumberArray<E> = E extends string | number ? E[] : E

// >
type StringArray = StringOrNumberArray<string> // 类型是 string[]
type NumberArray = StringOrNumberArray<number> // 类型是 number[]
type NeverGot = StringOrNumberArray<boolean> // 类型是 boolean

// >
type BooleanOrString = string | boolean
type WhatIsThis = StringOrNumberArray<BooleanOrString> // 好像应该是 string | boolean ?
type BooleanOrStringGot = BooleanOrString extends string | number
  ? BooleanOrString[]
  : BooleanOrString //  string | boolean

// 能接受入参的泛型类型和函数一样，都可以对入参类型进行计算并返回新的类型，像是在做类型运算。

//定义一个接口类型泛型ReduxModel;
//传入一个具体的 State 类型具象化 ReduxModel

interface ReduxModel<State> {
  state: State
  reducers: {
    [action: string]: (state: State, action: any) => State
  }
}

type ModelInterface = { id: number; name: string }
const model: ReduxModel<ModelInterface> = {
  state: { id: 4399, name: '大型在线学习网站' },
  reducers: {
    setIds: (state, action: { payload: number }) => ({
      ...state,
      id: action.payload,
    }),
    setName: (state, action: { payload: string }) => ({
      ...state,
      name: action.payload, // ok must be string
    }),
  },
}

// 泛型约束

{
  //1. 限定了泛型入参只能是 number | string | boolean 的子集。
  function reflectSpecified<P extends number | string | boolean>(param: P): P {
    return param
  }
  reflectSpecified('string') // ok
  reflectSpecified(1) // ok
  reflectSpecified(true) // ok
  // reflectSpecified(null) // ts(2345) 'null' 不能赋予类型 'number | string | boolean'
}

{
  //2. 把接口泛型入参约束在特定的范围内
  interface ReduxModelSpecified<State extends { id: number; name: string }> {
    state: State
  }
  type ComputedReduxModel1 = ReduxModelSpecified<{ id: number; name: string }> // ok
  type ComputedReduxModel2 = ReduxModelSpecified<{ id: number; name: string; age: number }> // ok
  // type ComputedReduxModel3 = ReduxModelSpecified<{ id: string; name: number }> // ts(2344)
  // type ComputedReduxModel4 = ReduxModelSpecified<{ id: number }> // ts(2344)
}

{
  // 在多个不同的泛型入参之间设置约束关系
  interface ObjSetter {
    <O extends {}, K extends keyof O, V extends O[K]>(obj: O, key: K, value: V): V
  }
  const setValueOfObj: ObjSetter = (obj, key, value) => (obj[key] = value)
  setValueOfObj({ id: 1, name: 'name' }, 'id', 2) // ok
  setValueOfObj({ id: 1, name: 'name' }, 'name', 'new name') // ok
  // setValueOfObj({ id: 1, name: 'name' }, 'age', 2) // ts(2345)
  // setValueOfObj({ id: 1, name: 'name' }, 'id', '2') // ts(2345)
}

{
  //这里我们限定了泛型 ReduxModelMixed 入参 State 必须是 {} 类型的子类型，同时也指定了入参缺省时的默认类型是接口类型 { id: number; name: string; }。
  interface ReduxModelMixed<State extends {} = { id: number; name: string }> {
    state: State
  }
}
