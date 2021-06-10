/*
 * @Descripttion : 数组、any 等比较难理解的特殊类型
 * @Author       : zhangming
 * @Date         : 2021-06-07 19:42:35
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-08 17:19:06
 */

// Array

// []形式
{
  /** 子元素是数字类型的数组 */
  let arrayOfNumber: number[] = [1, 2, 3]
  /** 子元素是字符串类型的数组 */
  let arrayOfString: string[] = ['x', 'y', 'z']
  /** 子元素是字符串类型的数组 */
  let arrayOfObj: object[] = [{ x: 2 }, { y: 2 }, { z: 2 }]
}

//Array 泛型
{
  /** 子元素是数字类型的数组 */
  let arrayOfNumber: Array<number> = [1, 2, 3]
  /** 子元素是字符串类型的数组 */
  let arrayOfString: Array<string> = ['x', 'y', 'z']
}

// Tuple
//元组最重要的特性是可以限制数组元素的个数和类型，它特别适合用来实现多值返回

//  Any is Hell（Any 是地狱）

//  unknown
//与 any 不同的是，unknown 在类型上更安全。比如我们可以将任意类型的值赋值给 unknown，但 unknown 类型的值只能赋值给 unknown 或 any

{
  let result: unknown
  //   let num: number = result // 提示 ts(2322)
  let anything: any = result // 不会提示错误
}

//使用 unknown 后，TypeScript 会对它做类型检测。但是，如果不缩小类型（Type Narrowing），我们对 unknown 执行的任何操作都会出现如下所示错误：
{
  let result: unknown
  //   result.toFixed() // 提示 ts(2571)
}

//类型缩小等同拦截
{
  let result: unknown
  if (typeof result === 'number') {
    result.toFixed() // 此处 hover result 提示类型是 number，不会提示错误
  }
}

{
  let b = { a: 1, c: 3 } as const
  //   b.a = 3
}

//undefined 的最大价值主要体现在接口类型（第 7 讲会涉及）上，它表示一个可缺省、未定义的属性

{
  const userInfo: {
    id?: number
  } = {}
  let undeclared: undefined = undefined
  let unusable: void = undefined
  unusable = undeclared // ok
  //   undeclared = unusable // ts(2322)
}

// 而 null 的价值我认为主要体现在接口制定上，它表明对象或属性可能是空值。
{
  const userInfo: {
    name: null | string
  } = { name: null }
}

//我们需要类型守卫（Type Guard，第 11 讲会专门讲解）在操作之前判断值的类型是否支持当前的操作。类型守卫既能通过类型缩小影响 TypeScript 的类型检测，也能保障 JavaScript 运行时的安全性

{
  const userInfo: {
    id?: number
    name?: null | string
  } = { id: 1, name: 'Captain' }
  if (userInfo.id !== undefined) {
    // Type Guard
    userInfo.id.toFixed() // id 的类型缩小成 number
  }
  //非空断言

  userInfo.id!.toFixed() // ok，但不建议
  userInfo.name!.toLowerCase() // ok，但不建议

  //比非空断言更安全、类型守卫更方便的做法是使用单问号（Optional Chain）、双问号（空值合并），我们可以使用它们来保障代码的安全性

  userInfo.id?.toFixed() // Optional Chain
  const myName = userInfo.name ?? `my name is ${userInfo.name}` // 空值合并
}

//类型断言（Type Assertion）
{
  const arrayNumber: number[] = [1, 2, 3, 4]
  //   const greaterThan2: number = arrayNumber.find((num) => num > 2)
  const greaterThan2: number = arrayNumber.find((num) => num > 2) as number
  const greaterThan3: number = <number>arrayNumber.find((num) => num > 2)
}
