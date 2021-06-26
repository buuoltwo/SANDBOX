/*
 * @Descripttion : 枚举(任务挂起)
 * @Author       : zhangming
 * @Date         : 2021-06-26 17:56:49
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-27 00:16:17
 */

{
  type Day1 = 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'
  const SUNDAY: Day1 = 'SUNDAY'
  const SATURDAY: Day1 = 'SATURDAY'

  enum Day {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
  }
  //   Day2.FRIDAY
  function work(d: Day) {
    switch (d) {
      case Day.SUNDAY:
      case Day.SATURDAY:
        return 'take a rest'
      case Day.MONDAY:
      case Day.TUESDAY:
      case Day.WEDNESDAY:
      case Day.THURSDAY:
      case Day.FRIDAY:
        return 'work hard'
    }
  }
  work(0) // ok
  work(Day.SUNDAY) // ok
}

{
  // 指定了从 1 开始递增

  enum Day {
    SUNDAY = 1,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
  }
}

{
  //常量成员和计算（值）成员
  enum FileAccess {
    // 常量成员
    None,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
    // 计算成员
    G = '123'.length,
  }
}

// 枚举成员类型和联合枚举

{
  enum Day {
    SUNDAY,
    MONDAY,
  }
  enum MyDay {
    SUNDAY,
    MONDAY = Day.MONDAY,
  }
  const mondayIsDay: Day.MONDAY = Day.MONDAY // ok: 字面量枚举成员既是值，也是类型
  const mondayIsSunday = MyDay.SUNDAY // ok: 类型是 MyDay，MyDay.SUNDAY 仅仅是值
  //   const mondayIsMyDay2: MyDay.MONDAY = MyDay.MONDAY // ts(2535)，MyDay 包含非字面量值成员，所以 MyDay.MONDAY 不能作为类型
}
