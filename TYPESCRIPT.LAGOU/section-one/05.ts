/*
 * @Descripttion : 函数类型：返回值类型和参数类型到底如何定义？
 * @Author       : zhangming
 * @Date         : 2021-06-18 09:51:46
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-18 12:15:58
 */

{
  const add = (a: number, b: number): number => {
    return a + b
  }
}

// function fn(): undefined {
//   // ts(2355) A function whose declared type is neither 'void' nor 'any' must return a value
//   // TODO
// }

// function fn1(): void {}
// fn1().doSomething() // ts(2339) Property 'doSomething' does not exist on type 'void'.
{
  type Adder = (a: number, b: number) => number // TypeScript 函数类型定义
  const add: Adder = (a, b) => a + b // ES6 箭头函数
}
