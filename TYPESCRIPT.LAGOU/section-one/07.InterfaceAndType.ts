/*
 * @Descripttion :  接口类型与类型别名：这两者的用法与区别分别是什么？
 * @Author       : zhangming
 * @Date         : 2021-06-21 16:39:55
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-21 19:47:37
 */

// TypeScript 不仅能帮助前端改变思维方式，还能强化面向接口编程的思维和能力，而这正是得益于 Interface 接口类型。

;/ ** 关键字 接口名称 */
interface ProgramLanguage {
  /** 语言名称 */
  name: string
  /** 使用年限 */
  age: () => number
}

let TypeScript: ProgramLanguage = {
  name: 'TypeScript',
  age: () => new Date().getFullYear() - 2012,
  //   id: 1,
}

/** 关键字 接口名称 */
interface OptionalProgramLanguage {
  /** 语言名称 */
  name: string
  /** 使用年限 */
  age?: () => number
}
let OptionalTypeScript: OptionalProgramLanguage = {
  name: 'TypeScript',
} // ok

// OptionalTypeScript 的 age 属性类型 是----
// (() => number) | undefined;

//只读属性
interface ReadOnlyProgramLanguage {
  /** 语言名称 */
  readonly name: string
  /** 使用年限 */
  readonly age: (() => number) | undefined
}

let ReadOnlyTypeScript: ReadOnlyProgramLanguage = {
  name: 'TypeScript',
  age: undefined,
}
/** ts(2540)错误，name 只读 */
//   ReadOnlyTypeScript.name = 'JavaScript';
//   ReadOnlyTypeScript.age = ()=>{}

// 定义函数的类型

// A
//  你可能会觉得接口类型仅能用来定义对象的类型，但是如 05 讲中提到接口类型还可以用来定义函数的类型
//  （备注：仅仅是定义函数的类型，而不包含函数的实现）

/**我们定义了一个接口类型 StudyLanguage，它有一个函数类型的匿名成员，函数参数类型 ProgramLanguage，返回值的类型是 void*/

//通过这样的格式定义的接口类型又被称之为可执行类型，也就是一个函数类型。
interface StudyLanguage {
  (language: ProgramLanguage): void
}
/** 单独的函数实践 */
let StudyInterface: StudyLanguage = (language) => console.log(`${language.name} ${language.age()}`)

// B(更常用!)
type StudyLanguageType = (language: ProgramLanguage) => void

// 索引签名 - 把对象当 Map 映射使用
// -> 使用索引签名来定义上边提到的对象映射结构，并通过 “[索引名: 类型]”的格式约束索引的类型。
// -> 索引名称的类型分为 string 和 number 两种

// 并通过 “[索引名: 类型]”的格式约束索引的类型。
// 并通过 “[索引名: 类型]”的格式约束索引的类型。
// 并通过 “[索引名: 类型]”的格式约束索引的类型。
{
  interface LanguageRankInterface {
    [rank: number]: string
  }
  interface LanguageYearInterface {
    [name: string]: number
  }
  let LanguageRankMap: LanguageRankInterface = {
    1: 'TypeScript', // ok
    2: 'JavaScript', // ok
    // WrongINdex: '2012', // ts(2322) 不存在的属性名
  }

  // 数字作为对象索引时，它的类型既可以与数字兼容，也可以与字符串兼容，这与 JavaScript 的行为一致。
  // 因此，使用 0 或 '0' 索引对象时，这两者等价。
  let LanguageMap: LanguageYearInterface = {
    TypeScript: 2012, // ok
    JavaScript: 1995, // ok
    1: 1970, // ok
  }
}


{
  interface DynamicLanguage extends ProgramLanguage {
    rank: number; // 定义新属性
  }
  
  interface TypeSafeLanguage extends ProgramLanguage {
    typeChecker: string; // 定义新的属性
  }
  /** 继承多个 */
  interface TypeScriptLanguage extends DynamicLanguage, TypeSafeLanguage {
    name: '284r1i23ji3r'; // 用原属性类型的兼容的类型(比如子集)重新定义属性
  }

  // 多方继承而来,必须要填的属性有>>
  let child : TypeScriptLanguage = {
    name:'284r1i23ji3r',
    rank:100,
    typeChecker:`do you have any idea`,
    age(){
      return 100
    }
  }
}