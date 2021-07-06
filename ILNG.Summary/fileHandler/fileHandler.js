/*
 * @Descripttion : 文件操作工具 上传、下载、获取文件类型、
 * @Author       : hezihua
 * @Date         : 2020-04-28 16:09:48
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-05-28 14:03:11
 */
import config from '../../config.js'
import { getUrlParameters } from 'utils/urlHandler'
import { notice } from 'components/Notification/index.js'

/**
 * @description: 下载文件
 * @param {*} object
 * @return {*}
 */
export const downloadFile = (record) => {
  let url = `${config.request.prefix}/ifss/file/Download?id=${record.id}`
  window.open(url, '_blank')
  window.close()
}

/**
 * @description: 下载图片
 * @param {*} object
 * @return {*}
 */
export const downloadImage = (record) => {
  let url = `${config.request.prefix}/ifss/image/Download?id=${record.id}`
  window.open(url, '_blank')
  window.close()
}

/**
 * @description: 获取文件类型
 * @param {*} string
 * @return {*}
 */
export const getFileType = (string) => {
  let last_len = string.lastIndexOf('.')
  let fileType = string.substring(last_len, string.length)
  return fileType
}

/**
 * @description: 文件上传
 * @param {*} type：附件类型
 * @return {*}
 */
export const getAction = (type, isBigUpload = false) => {
  let address = !isBigUpload ? '/upload' : '/bigupload'
  let searchObj = getUrlParameters()
  let action = `/ifss/file${address}?type=${type}`
  if (searchObj.id) {
    action = `/ifss/file${address}?objectId=${searchObj.id}&type=${type}`
  }

  return action
}

/**
 * @description: 图片上传
 * @param {*} type：图片类型
 * @return {*}
 */
export const getImageAction = (type) => {
  let searchObj = getUrlParameters()
  let action = `/ifss/image/upload?type=${type}`
  if (searchObj.id) {
    action = `/ifss/image/upload?objectId=${searchObj.id}&type=${type}`
  }

  return action
}

/**
 * @description: 文件大小转换
 * @param {*} fileSize
 * @return {*}
 */
export const convertFileSize = (fileSize) => {
  if (fileSize < 1024 * 1024) {
    let newStandard = (fileSize / 1024).toFixed(2)
    return newStandard + ' KB'
  } else if (fileSize > 1024 * 1024) {
    let newStandard = (fileSize / (1024 * 1024)).toFixed(2)
    return newStandard + ' MB'
  }
}
/**
 * @description: 导出文件
 * @param {*} url
 * @param {*} config
 * @param {*} fileName
 */
export const exportFile = async (url, config, fileName) => {
  try {
    const response = await fetch(url, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      method: 'POST',
      ...config,
    })
    if (response.status >= 200 && response.status < 300) {
      const data = await response.blob()
      saveBlobAs(data, fileName)
    } else {
      notice.error('无数据返回!')
    }
  } catch (error) {
    console.log(error)
    // notice.error('无数据返回!')
  }
}

/**
 * @description: 保存bolb的方法
 * @param {*} blob
 * @param {*} fileName
 */
function saveBlobAs(blob, fileName) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName)
  } else {
    const anchor = document.createElement('a')
    const body = document.querySelector('body')
    anchor.href = window.URL.createObjectURL(blob)
    anchor.download = fileName

    anchor.style.display = 'none'
    body.appendChild(anchor)

    anchor.click()
    body.removeChild(anchor)

    window.URL.revokeObjectURL(anchor.href)
  }
}

/**
 * @description: 打印文件
 * @param {*} url
 * @param {*} config
 * @param {*} fileName
 */
export const printFile = async (url, config, fileName) => {
  try {
    const response = await fetch(url, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      method: 'POST',
      ...config,
    })
    if (response.status >= 200 && response.status < 300) {
      const data = await response.blob()
      var tagElements = document.getElementsByTagName('iframe')
      for (var m = 0; m < tagElements.length; m++) {
        if (tagElements[m].className === 'tmp-pdf') {
          tagElements[m].parentNode.removeChild(tagElements[m]) //去除元素
        }
      }
      const iframe = document.createElement('iframe')
      iframe.className = 'tmp-pdf'
      iframe.style.display = 'none'
      iframe.src = URL.createObjectURL(data)
      document.body.appendChild(iframe)
      setTimeout(function () {
        iframe.contentWindow.print()
        URL.revokeObjectURL(data)
      }, 100)
    }
  } catch (error) {
    console.log(error)
  }
}

export default downloadFile
