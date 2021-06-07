/*
 * @Descripttion :
 * @Author       : zhangming
 * @Date         : 2021-04-26 11:31:02
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-04-29 16:19:41
 */

let p1 = new MyPromise((resolve, reject) => {
  //   setTimeout(() => {
  console.log(`start..`)
  resolve(1)
  //   }, 0)
}).then((value) => {
  console.log(value)
})
