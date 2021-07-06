/*
 * @Descripttion : 数据格式化
 * @Author       : wuhaidong
 * @Date         : 2020-03-08 23:28:42
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-05-21 11:36:15
 */
import { notice } from 'components/Notification'

export default {
  /*
   * @description  : 格式化select结构需要的dict
   * @param        : array
   * @return       : news array
   */
  selectDictFormat: (array, codeField = 'dataCode', nameField = 'dataName', checked = false) => {
    return array.map((item) => {
      const haveChildren = item.child && Array.isArray(item.child) && item.child.length > 0
      return {
        ...item,
        code: item[`${codeField}`],
        codeName: item[`${nameField}`],
        value: item[`${codeField}`],
        label: item[`${nameField}`],
        checked,
        child: haveChildren ? this.selectDictFormat(item.child, codeField, nameField, checked) : [],
      }
    })
  },

  /*
   * @description  : 格式化成select tree 组件数据格式
   * @param        : treeArray
   * @return       : news treeArray
   */
  selectTreeFormat(treeArray, valueField = 'id', titleField = 'name') {
    return treeArray.map((item) => {
      const haveChildren = Array.isArray(item.children) && item.children.length > 0
      return {
        ...item,
        value: item[`${valueField}`],
        title: item[`${titleField}`],
        children: haveChildren ? this.selectTreeFormat(item.children, valueField, titleField) : [],
      }
    })
  },
  /**
   * @description: select tree 组件 格式化treedata,根据父节点id禁用下属节点
   * @param {*}
   * @return {Array}
   */
  disableTreeDataByPid(treeArray, valueField = 'id', titleField = 'name', { targetKey, isLoop }) {
    return treeArray.map((item) => {
      const haveChildren = Array.isArray(item.children) && item.children.length > 0
      let assignTemp = {}
      if (item.value === targetKey || isLoop) {
        assignTemp = { disabled: true }
      }
      return Object.assign(assignTemp, {
        ...item,
        value: item[`${valueField}`],
        title: item[`${titleField}`],
        children: haveChildren
          ? this.disableTreeDataByPid(item.children, valueField, titleField, {
              targetKey,
              isLoop: isLoop || item.value === targetKey,
            })
          : [],
      })
    })
  },

  /**
   * @description: Cascader 组件 删除最深层的children属性
   * @param {*}
   * @return {*}
   */
  formatCascaderOptions(addressList) {
    return addressList.map((item) => {
      let hasChildren = Array.isArray(item.children) && item.children.length
      if (hasChildren) return { ...item, children: this.formatCascaderOptions(item.children) }
      let { children, ...filteredItem } = item
      return { ...filteredItem }
    })
  },
  /*
   * @description  : 多层嵌套数组转成一层
   * @param        : array:数组,toDict：是否转成select dict
   * @return       : news array
   */
  multiToOneFormat(array, toDict = false) {
    if (!toDict && array && array.length > 0) {
      return [].concat(
        ...array.map((item) => [].concat(item, ...this.multiToOneFormat(item.children)))
      )
    } else if (array && array.length > 0) {
      let newsArray = [].concat(
        ...array.map((item) => [].concat(item, ...this.multiToOneFormat(item.children)))
      )
      return this.selectDictFormat(newsArray, 'value', 'title')
    }

    return []
  },

  /*
   * @description  : 通过code取数据字典的codeName
   * @param        : dictArray 数据字典数组, code
   * @return       : codeName
   */
  getCodeNameByCode(dictArray, code) {
    return (
      dictArray.find((item) => item.code === code) &&
      dictArray.find((item) => item.code === code).codeName
    )
  },

  /*
   * @description  : 多层嵌套数组转成一层数组,取keys，set expandedRowKeys
   * @param        : array:数组, name : key name
   * @return       : news array
   */
  multiToKeysFormat(array, name = 'id') {
    // console.log('🚀 ~ file: index.js ~ line 86 ~ multiToKeysFormat ~ array', array)
    if (array) {
      return [].concat(
        ...array.map((item) =>
          [].concat(item[`${name}`], ...this.multiToKeysFormat(item.children, name))
        )
      )
    } else {
      return []
    }
  },

  /*
   * @description  : 获取tree最深层的key值
   * @param        : array:数组
   * @return       : news array
   */
  deepestKey: [],
  multiToDeepestKey(array, name = 'key') {
    array &&
      array.map((item) => {
        if (item.children && item.children.length > 0) {
          this.multiToDeepestKey(item.children)
        } else {
          this.deepestKey.push(item[`${name}`])
        }
        return null
      })
    return this.deepestKey
  },

  /*
   * @description  : 比较两个数组,取两个数组共有的组成新数组
   * @param        : array:数组
   * @return       : news array
   */
  uniqueArray(uniqueArr, Arr) {
    let uniqueChild = []
    for (var i in Arr) {
      for (var k in uniqueArr) {
        if (uniqueArr[k] === Arr[i]) {
          uniqueChild.push(uniqueArr[k])
        }
      }
    }
    return uniqueChild
  },

  /*
   * @description  : 通过关键字比较两个数组,关键字相同取旧数据的属性，关键字不通取新增数组的新属性
   * @param        : arrayOld:修改后数组，arreNew:新增数组，key:对比的关键字
   * @return       : news array
   */
  newTableArr(arrOld, arrNew, key) {
    let arrSumNew = [],
      index = 0 //新的数组，重新赋值index，让数组对象里面的index和数组的下标一致
    for (let z = 0; z < arrOld.length; z++) {
      let mark = false
      arrNew.some((child) => {
        mark = arrOld[z][key] === child[key]
        return mark
      })
      if (mark) {
        console.log(z)
        console.log(arrOld[z])
        arrOld[z].index = index
        arrSumNew.push(arrOld[z])
        index++
      }
    }
    for (let i = 0; i < arrNew.length; i++) {
      let mark = false
      arrOld.some((child) => {
        mark = arrNew[i][key] === child[key]
        return mark
      })
      if (!mark) {
        console.log(arrNew[i])
        arrNew[i].index = index
        arrSumNew.push(arrNew[i])
        index++
      }
    }
    return arrSumNew
  },
  /**
   * @description:
   * @param {type}
   * @return:
   */
  getNameById(tree, id, key) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i][key] === id) {
        return tree[i]
      }
      if (tree[i].children && tree[i].children.length > 0) {
        if (this.getNameById(tree[i].children, id, key)) {
          return this.getNameById(tree[i].children, id, key)
        }
      }
    }
  },

  /*
   * @description  : 判断数组里的对象里关键字是否为空
   * @param        : dataList:需要检查的数据，keyList:需要判断的关键字list :[{{key:'totalPrice',tips:'请填写总价'}}]
   * @return       : news array
   */

  checkListKey(dataList = [], keyList = []) {
    for (let i = 0; i < dataList.length; i++) {
      for (let j = 0; j < keyList.length; j++) {
        if (!dataList[i][keyList[j].key] && dataList[i][keyList[j].key] !== 0) {
          notice.error(keyList[j].tips)
          return true
        }
      }
    }
  },
  /**
   * @description: 限制数字，小数位长度
   * @param {*} num
   * @param {*} len
   * @return {*}
   */
  limitNumber(num, len = 2) {
    let reNumber = num
    if (typeof reNumber === 'number') {
      reNumber += '' //数字转string
    }
    const reg1 = new RegExp(`\\.{${len},}/g`)
    const reg2 = new RegExp(`^(\\-)*(\\d+)\\.(\\d{${len}}).*$`)
    reNumber = reNumber.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    reNumber = reNumber.replace(reg1, '.') //只保留第一个. 清除多余的
    reNumber = reNumber.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    reNumber = reNumber.replace(reg2, '$1$2.$3') //只能输入两个小数
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (reNumber.indexOf('.') < 0 && reNumber != '') {
      reNumber = parseFloat(reNumber)
    }
    if (reNumber === '.') {
      reNumber = 0
    }
    return reNumber
  },
  /**
   * @description: 数组、对象深拷贝
   * @param {*}
   * @param {*}
   * @return {*}
   */
  deepClone(value) {
    //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    var objClone = Array.isArray(value) ? [] : {}
    //进行深拷贝的不能为空，并且是对象或者是
    if (value && typeof value === 'object') {
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          if (value[key] && typeof value[key] === 'object') {
            objClone[key] = this.deepClone(value[key])
          } else {
            objClone[key] = value[key]
          }
        }
      }
    }
    return objClone
  },
}
