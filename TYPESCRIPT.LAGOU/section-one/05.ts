/*
 * @Descripttion : 函数类型：返回值类型和参数类型到底如何定义？
 * @Author       : zhangming
 * @Date         : 2021-06-19 13:56:24
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-22 01:55:18
 */

{
  const add = (a: number, b: number): number => {
    return a + b
  }
}

{
  type Adder = (a: number, b: number) => number // TypeScript 函数类型定义
  const add: Adder = (a, b) => a + b // ES6 箭头函数
}

// 在对象（即接口类型，详见 07 讲）中，除了使用这种声明语法，我们还可以使用类似对象属性的简写语法来声明函数类型的属性
interface Entity {
  add: (a: number, b: number) => number
  del(a: number, b: number): number
}
const entity: Entity = {
  add: (a, b) => a + b,
  del(a, b) {
    return a - b
  },
}

// 可缺省和可推断的返回值类型
function computeTypes(one: string, two: number) {
  const nums = [two]
  const strs = [one]
  return {
    nums,
    strs,
  } // 返回 { nums: number[]; strs: string[] } 的类型
}

// Generator 函数的返回值
type AnyType = boolean
type AnyReturnType = string
type AnyNextType = number
function* gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
  const nextValue = yield true // nextValue 类型是 number，yield 后必须是 boolean 类型
  return `${nextValue}` // 必须返回 string 类型
  // const nextValue1 = yield 1; // ts2322
  // const nextValue2 = yield `43`; // ts2322
  // return 1;// ts2322
}

// 可选参数、默认参数、剩余参数

//1
{
  //参数可以缺省、可以不传
  function log(x?: string) {
    console.log(x)
  }
  // 参数是不可缺省且类型必须是 string 或者 undfined
  function log1(x: string | undefined) {
    console.log(x)
  }
  log()
  log(undefined)
  // log1(); // ts(2554) Expected 1 arguments, but got 0
  log1(undefined)
}
//2
{
  function log3(x: number | string = 'hello') {
    console.log(x)
  }
}
//3
{
  const sum = (...nums: number[]) => {
    return nums.reduce((a, b) => a + b, 0)
  }
  sum(1, 2) // => 3
  sum(1, 2, 3) // => 6
  // sum(1, '2'); // ts(2345)
}
{
  function sum(...nums: (number | string)[]): number {
    return nums.reduce<number>((a, b) => a + Number(b), 0)
  }
  sum(1, '2', 3) // 6
}

// this

function say(this: Window, name: string) {
  console.log(this.name)
}
window.say = say
window.say('hi')
const obj = {
  say,
}
obj.say('hi')

interface Person {
  name: string
  say(this: Person): void
}
const person: Person = {
  name: 'captain',
  say() {
    console.log(this.name)
  },
}
const fn = person.say
// fn();
// person.fn();
person.say()

//显式限定类（class 类的介绍详见 06 讲）函数属性中的 this 类型

// 链式调用风格的库中，使用 this 也可以很方便地表达出其类型
// const instance = new Container(1)
//   .map((x) => x + 1)
//   .log() // => 2
//   .map((x) => x * 3)
//   .log(); // => 6

//函数多态（函数重载）
// JavaScript 是一门动态语言，针对同一个函数，它可以有多种不同类型的参数与返回值，这就是函数的多态。

//函数重载列表的各个成员（即示例中的 1 ~ 3 行）必须是函数实现（即示例中的第 4 行）的子集

{
  function convert(x: string): number

  function convert(x: number): string

  function convert(x: null): -1

  function convert(x: string | number | null): any {
    if (typeof x === 'string') {
      return Number(x)
    }

    if (typeof x === 'number') {
      return String(x)
    }

    return -1
  }

  const x1 = convert('1') // => number

  const x2 = convert(1) // => string

  const x3 = convert(null) // -1
}
//把最精确的函数重载放到前面
{
  interface P1 {
    name: string
  }
  interface P2 extends P1 {
    age: number
  }
  function convert2(x: P1): number
  function convert2(x: P2): string
  function convert2(x: P1 | P2): any {}
  const x1 = convert2({ name: '' } as P1) // => number
  const x2 = convert2({ name: '', age: 18 } as P2) //  => number
}

// 类型谓词（is）
{
  function isString(s: any): s is string {
    // 类型谓词
    return typeof s === 'string'
  }
  // function isNumber(n: number) {
  //     return typeof n === 'number';
  // }
  // function operator(x: unknown) {
  //     if (isString(x)) { // ok x 类型缩小为 string
  //     }
  //     if (isNumber(x)) { // ts(2345) unknown 不能赋值给 number
  //     }
  // }
}
