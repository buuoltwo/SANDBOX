/*
 * @Descripttion : 联合类型和交叉类型
 * @Author       : zhangming
 * @Date         : 2021-06-26 15:36:40
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-26 17:52:47
 */

/**
 * 小结:
 * A & B 本质上就是说类型既符合 A 也符合 B,
 * 所以如果 A、B 是接口类型，就等于是把他们合为一个接口类型（类比求并集）；
 * 但是如果 A、B 是联合类型，则会得到他们公共成员类型（类比求交集）。
 */

// 联合类型
{
  // type ModernUnit = 'vh' | 'vw';
  type ModernUnit = string
  type Unit = 'px' | 'em' | 'rem'
  type MessedUp = ModernUnit | Unit
  let s: MessedUp = '4399'
}

{
  interface Bird {
    fly(): void
    layEggs(): void
  }
  interface Fish {
    swim(): void
    layEggs(): void
  }
  const getPet: () => Bird | Fish = () => {
    return {
      // ...
    } as Bird | Fish
  }
  const Pet = getPet()
  Pet.layEggs() // ok
  //   Pet.fly(); // ts(2339) 'Fish' 没有 'fly' 属性; 'Bird | Fish' 没有 'fly' 属性

  //   类型守卫:
  //wrong
  //   if (typeof Pet.fly === 'function') {
  //     // ts(2339)
  //     Pet.fly() // ts(2339)
  //   }
  //right
  //基于 in 操作符判断的类型守卫
  if ('fly' in Pet) {
    Pet.fly() // ok
  }
}

//交叉类型
{
  type Useless = string & number
}

// -> 合并接口类型 **interface
// 求两个接口的交集 无兼容则属性为never
// 它可以把多个类型合并成一个类型，合并后的类型将拥有所有成员类型的特性。
{
  type IntersectionType = { id: number; name: string } & { age: number }
  const mixed: IntersectionType = {
    id: 1,
    name: 'name',
    age: 18,
  }
}
// -> 合并联合类型 **type
//求两个类型的交集。intersection: 交叉 无交集则type为never

{
  type UnionA = 'px' | 'em' | 'rem' | '%'
  type UnionB = 'vh' | 'em' | 'rem' | 'pt'
  type IntersectionUnion = UnionA & UnionB
  const intersectionA: IntersectionUnion = 'em' // ok
  const intersectionB: IntersectionUnion = 'rem' // ok
  //   const intersectionC: IntersectionUnion = 'px' // ts(2322)
  //   const intersectionD: IntersectionUnion = 'pt' // ts(2322)
}

//联合、交叉组合
{
  type UnionIntersectionA =
    | ({ id: number } & { name: string })
    | ({ id: string } & { name: number }) // 交叉操作符优先级高于联合操作符
  type UnionIntersectionB = ('px' | 'em' | 'rem' | '%') | ('vh' | 'em' | 'rem' | 'pt') // 调整优先级

  let testee1: UnionIntersectionA = {
    id: 1,
    name: '2',
  }
  //   let testee2: UnionIntersectionA = {
  //     id: 1,
  //     name: 3,
  //   }
}
//->分配率、交换律
{
  type UnionIntersectionC = (({ id: number } & { name: string }) | { id: string }) & {
    name: number
  }
  type UnionIntersectionD =
    | ({ id: number } & { name: string } & { name: number })
    | ({ id: string } & { name: number }) // 满足分配率
  type UnionIntersectionE = ({ id: string } | ({ id: number } & { name: string })) & {
    name: number
  } // 满足交换律
  let testee3: UnionIntersectionC = {
    id: '1',
    name: 1,
  }
  let testee4: UnionIntersectionD = {
    id: '1',
    name: 1,
  }
  let testee5: UnionIntersectionE = {
    id: '1',
    name: 1,
  }
}

//类型缩减

{
  // IDE 自动提示 为string
  // type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string // 类型缩减成 string
  // IDE 自动提示 为 balabala 可以自动补全了
  type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | (string & {}) // 字面类型都被保留
  let color: BorderColor = 'yellow'
}

//相同属性的类型联合
//此外，当联合类型的成员是接口类型，如果满足其中一个接口的属性是另外一个接口属性的子集，这个属性也会类型缩减
{
  //age通过联合类型,这个属性会类型缩减 age: '1' | '2'
  type UnionInterce =
    | {
        age: '1'
      }
    | {
        age: '1' | '2'
        [key: string]: string
      }
  let tesd: UnionInterce = {
    age: '2',
    time: '2021',
  }
}

// never 有一个特性是它是所有类型的子类型
{
  type UnionInterce =
    | {
        age: number
      }
    | {
        age: never
        [key: string]: string
      }
  const O: UnionInterce = {
    age: 2,
    string: 'string',
  }
}
