/*
 * @Descripttion : 
 * @Author       : zhangming
 * @Date         : 2021-06-03 15:06:30
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-07 14:16:28
 */


// primative 
// string number boolean symbol undefined null bigInt 

let num:number = 1
let integer2: number = Number(42);
let decimal: number = 3.14;
/** 二进制整数 */
let binary: number = 0b1010;
/** 八进制整数 */
let octal: number = 0o744;
/** 十六进制整数 */
let hex: number = 0xf00d;
let big: bigint =  100n;

//特殊说明：请你千万别将它们和小写格式对应的 number、string、boolean、symbol 进行等价。

// let sym: symbol = Symbol('a');
// let sym2: Symbol = Symbol('b');
// sym = sym2 // ok or fail?
// sym2 = sym // ok or fail?

// let str: String = new String('a');
// let str2: string = 'a';
// str = str2; // ok or fail?
// str2 = str; // ok or fail?

// {
//     let mustBeNum = 'badString';
// }
// {
// let mustBeNum: number = 'badString';
// }