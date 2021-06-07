/*
 * @Descripttion : 什么是字面量类型、类型推断、类型拓宽和类型缩小？
 * @Author       : zhangming
 * @Date         : 2021-06-07 15:04:29
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-07 19:41:44
 */
{
  let str = 'this is string' // str: string
  let num = 1 // num: number
  let bool = true // bool: boolean

  //   > true
  //   str = 'any string';
  //   num = 2;
  //   bool = false;
}
{
  const str = 'this is string' // str: 'this is string'
  const num = 1 // num: 1
  const bool = true // bool: true
  //   let a:number = str
  //   str = '4399'

  //   > false
  //   str = 'any string';
  //   num = 2;
  //   bool = false;
}

// Literal Widening

// 所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。
{
  let str = 'this is string' // 类型是 string
  let strFun = (str = 'this is string') => str // 类型是 (str?: string) => string;
  const specifiedStr = 'this is string' // 类型是 'this is string'
  let str2 = specifiedStr // 类型是 'string'
  let strFun2 = (str = specifiedStr) => str // 类型是 (str?: string) => string;
}

// Type Widening

//比如对 null 和 undefined 的类型进行拓宽，通过 let、var 定义的变量如果满足未显式声明类型注解且被赋予了 null 或 undefined 值，则推断出这些变量的类型是 any：
{
  let x = null // 类型拓宽成 any
  let y = undefined // 类型拓宽成 any
  /** -----分界线------- */
  const z = null // 类型是 null
  /** -----分界线------- */
  let anyFun = (param = null) => param // 形参类型是 null
  let z2 = z // 类型是 null
  let x2 = x // 类型是 null
  let y2 = y // 类型是 undefined
}

// Type Narrowing

//在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。

//1.1 类型守卫
{
  let func = (anything: any) => {
    if (typeof anything === 'string') {
      return anything // 类型是 string
    } else if (typeof anything === 'number') {
      return anything // 类型是 number
    }
    return null
  }
}
//1.2 用类型守卫将联合类型（详见 08 讲 内容）缩小到明确的子类型
{
  let func = (anything: string | number) => {
    if (typeof anything === 'string') {
      return anything // 类型是 string
    } else {
      return anything // 类型是 number
    }
  }
}

//1.3 将联合类型收敛为更具体的类型

{
  type Goods = 'pen' | 'pencil' | 'ruler'
  const getPenCost = (item: 'pen') => 2
  const getPencilCost = (item: 'pencil') => 4
  const getRulerCost = (item: 'ruler') => 6
  const getCost = (item: Goods) => {
    if (item === 'pen') {
      // return getPenCost(item) // item => 'pen'
      return item
    } else if (item === 'pencil') {
      return getPencilCost(item) // item => 'pencil'
    } else {
      return getRulerCost(item) // item => 'ruler'
    }
  }
}

//  COMMENT

// 从材料例子可以大致归纳出，let 声明的简单类型字面量会拓宽类型，const 声明的简单类型字面量会收窄，const 声明的对象变量会自动推断对应的类型，可以用as const 收窄，让每一个key都是固定类型
//嗯，是的。此外对象 as const，会让对象的每个属性变成只读（readonly）。

{
  let A = { B: 1, C: 2 } as const
  // A.B = 4
}
