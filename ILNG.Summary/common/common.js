/*
 * @Descripttion : TODO 修改，命名
 * @Author       : hezihua
 * @Date         : 2020-09-02 14:50:03
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2021-04-10 17:51:21
 */
import { notice } from 'components/Notification'
export const guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}

export const getYesterday = () => {
  let time = new Date().getTime() - 24 * 60 * 60 * 1000
  let yesterday = new Date(time)
  yesterday =
    yesterday.getFullYear() +
    '-' +
    (yesterday.getMonth() > 9 ? yesterday.getMonth() + 1 : '0' + (yesterday.getMonth() + 1)) +
    '-' +
    (yesterday.getDate() > 9 ? yesterday.getDate() : '0' + yesterday.getDate())

  return yesterday
}

export const evil = (fn) => {
  try {
    let Fn = Function
    return new Fn('return ' + fn)()
  } catch (error) {
    return null
  }
}

export const copyText = (id) => {
  if (id.indexOf('#') == -1) {
    notice.error('需要传入带"#"的id名字！')
    return
  }
  const copyEle = document.querySelector(id)
  const range = document.createRange()
  window.getSelection().removeAllRanges()
  range.selectNode(copyEle)
  window.getSelection().addRange(range)
  const copyStatus = document.execCommand('Copy')

  if (copyStatus) {
    notice.success('复制成功')
  } else {
    notice.warn('复制失败')
  }
  window.getSelection().removeAllRanges()
}
