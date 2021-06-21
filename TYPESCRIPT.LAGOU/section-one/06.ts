/*
 * @Descripttion : 类
 * @Author       : zhangming
 * @Date         : 2021-06-20 14:26:09
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-20 17:49:07
 */

//继承
//
// function Dog0(name: string) {
//   this.name = name // ts(2683) 'this' implicitly has type 'any' because it does not have a type annotation.
// }
// Dog0.prototype.bark = function () {
//   console.log('Woof! Woof!')
// }
// const dog = new Dog0('Q') // ts(7009) 'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
// dog.bark() // => 'Woof! Woof!'
//
class Animal {
  weight: number | undefined
  type = 'Animal'
  constructor(weight?: number) {
    this.weight = weight
  }
  say(name: string) {
    console.log(`I'm ${name}!`)
  }
}
class Dog extends Animal {
  name: string
  constructor(name: string) {
    super() // ts(2554) Expected 1 arguments, but got 0.
    // super(75)
    this.name = name
  }
  bark() {
    console.log('Woof! Woof!')
  }
}

//公共、私有与受保护的修饰符

//存取器
//只读修饰符
//静态属性

// 这个call用的就很有灵性啊
class MyArray {
  static displayName = 'MyArray'
  static isArray(obj: unknown) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Array'
  }
}
console.log(MyArray.displayName) // => "MyArray"
console.log(MyArray.isArray([])) // => true
console.log(MyArray.isArray({})) // => false

// PS:
// 注意：上边我们提到了不依赖实例 this 上下文的方法就可以定义成静态方法，
// 这就意味着需要显式注解 this 类型才可以在静态方法中使用 this；
// 非静态方法则不需要显式注解 this 类型，因为 this 的指向默认是类的实例。

//抽象类

// 它是一种不能被实例化仅能被子类继承的特殊类。

// 因为抽象类不能被实例化，并且派生类必须实现继承自抽象类上的抽象属性和方法定义，所以抽象类的作用其实就是对基础逻辑的封装和抽象。

// 实际上，我们也可以定义一个描述对象结构的接口类型（详见 07 讲）抽象类的结构，并通过 implements 关键字约束类的实现。

// 类的类型
