/*
 * @Descripttion : 数组、any 等比较难理解的特殊类型
 * @Author       : zhangming
 * @Date         : 2021-06-07 19:42:35
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-07 19:54:08
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
  let num: number = result // 提示 ts(2322)
  let anything: any = result // 不会提示错误
}

//使用 unknown 后，TypeScript 会对它做类型检测。但是，如果不缩小类型（Type Narrowing），我们对 unknown 执行的任何操作都会出现如下所示错误：
{
  let result: unknown
  result.toFixed() // 提示 ts(2571)
}

//类型缩小等同拦截
{
  let result: unknown
  if (typeof result === 'number') {
    result.toFixed() // 此处 hover result 提示类型是 number，不会提示错误
  }
}
