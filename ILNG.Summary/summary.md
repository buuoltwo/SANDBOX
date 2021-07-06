<!--
 * @Descripttion : 代码总结
 * @Author       : zhangming
 * @Date         : 2021-07-05 22:18:39
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-07-05 23:37:31
-->
# 抽离轮询逻辑 hook
```js
import { useRef, useEffect } from 'react'

export function useInterval(callback, delay) {
  const savedCallback = useRef()

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback
  })

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

```

# echarts 配置项微调组件
A. 
```js
import React, { useRef, useEffect } from 'react'
import ECharts from 'components/ECharts'
import ClientService from '../model/service'
import { useInterval } from './hooks'

const color = ['#2455F1', '#579729', '#CB9620', '#CA3933', '#3B8EB6', '#7D1563', '#994520']
const option = {
  title: {
    text: '',
    bottom: 28,
    left: '48%',

    textStyle: {
      fontFamily: 'PingFang SC',
      fontSize: '10px',
      color: '#fff',
    },
  },
  grid: {
    top: 30,
    left: 40,
    right: 5,
    height: 140,
  },
  xAxis: {
    type: 'category',
    data: [
      { value: '点火', textStyle: { fontSize: 10, color: '#B1BCE0' } },
      { value: '维修', textStyle: { fontSize: 10, color: '#B1BCE0' } },
      { value: '预约安装', textStyle: { fontSize: 10, color: '#B1BCE0' } },
      { value: '改管勘察', textStyle: { fontSize: 10, color: '#B1BCE0' } },
      { value: '改管', textStyle: { fontSize: 10, color: '#B1BCE0' } },
      { value: '加建勘察', textStyle: { fontSize: 10, color: '#B1BCE0' } },
      { value: '加建其他', textStyle: { fontSize: 10, color: '#B1BCE0' } },
    ],
    axisTick: { show: false },
    axisLabel: { interval: 0 },
  },
  yAxis: {
    type: 'value',
  },
  splitLine: {
    lineStyle: {
      background: '#FFFFFF',
      opacity: 0.2,
    },
  },
  series: [
    {
      data: [
        // { value: 87, itemStyle: { color: color[0] } },
      ],
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 10,
      },
      barWidth: 12,
      type: 'bar',
    },
  ],
  animationEasing: 'sinusoidalOut',
  animationDurationUpdate: function (idx) {
    // 越往后的数据时长越大
    return idx * 1000
  },
}

export default function ActivityTotal() {
  const jinwanRef = useRef()
  const doumenRef = useRef()
  const hengqinRef = useRef()
  const source = [
    { title: '金湾区', data: [], ref: jinwanRef, name: 'jinwan' },
    { title: '斗门区', data: [], ref: doumenRef, name: 'doumen' },
    { title: '横琴区', data: [], ref: hengqinRef, name: 'hengqin' },
  ]

  const setOptions = ({ title, data, ref }) => {
    const newOption = { ...option }
    newOption.title.text = title
    newOption.series[0].data = data.map((item, index) => ({
      value: item,
      itemStyle: { color: color[index] },
    }))
    ref.current.clear()
    ref.current.setOption(newOption)
  }

  const fetchData = async () => {
    const data = await ClientService.getallregionsumtoday()
    Object.keys(data || {}).forEach((key, index) => {
      source[index].name = key
      source[index].title = data[key].district_name
      source[index].data = data[key].detailList.map((l) => l.num)
    })
    source.forEach((item) => setOptions(item))
  }

  useEffect(() => {
    fetchData()
  }, [])

  useInterval(() => {
    fetchData()
  }, 5000)

  return (
    <div className="activity-total">
      <div className="title">各区现场活动总量</div>
      <div className="container">
        {source.map((item) => (
          <ECharts
            width={339}
            height={249}
            key={item.name}
            getIChart={(ref) => (item.ref.current = ref)}
          />
        ))}
      </div>
    </div>
  )
}

```

B.
```js
/*
 * @Descripttion :
 * @Author       : zhangming
 * @Date         : 2021-06-10 14:21:45
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-15 16:10:07
 */

import React, { useRef, useEffect } from 'react'
import ECharts, { echarts } from 'components/ECharts'
import CommonOpts, { StationQuantConfig } from './CommonOpts'

const BottomChart = ({ fetchData }) => {
  const StationQuantRef = useRef()
  useEffect(() => {
    if (fetchData) init(fetchData)
  }, [fetchData])

  const init = (fetchData) => {
    updateSupplyCharts(fetchData)
  }
  const updateSupplyCharts = ({ y, y2, y3 }) => {
    let newLineOpts = _.cloneDeep(CommonOpts(StationQuantConfig))
    newLineOpts.series[0].data = y
    newLineOpts.series[1].data = y2
    newLineOpts.series[2].data = y3
    StationQuantRef.current.setOption(newLineOpts)
  }
  return (
    <section className="bottom-chart">
      <div className="title">近30日门站用气量（标方）</div>
      <div className="container">
        <ECharts
          className="chart-box"
          width={381}
          height={196}
          getIChart={(i) => (StationQuantRef.current = i)}
        />
      </div>
    </section>
  )
}
export default BottomChart

```

# 迭代组件:扩展Toolbar
```js
/*
 * @Descripttion : 父组件-列表页Toolbar扩展
 * @Author       : zhangming
 * @Date         : 2021-03-04 09:33:21
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-15 17:46:15
 */

import React, { Component } from 'react'
import Button from 'components/Button'
import { exportFile, getFileType, getAction } from 'utils/fileHandler'
import { configApiPrefix } from 'utils/prefixHandler'
import moment from 'utils/moment'
import ImportModalPanel from './ImportModalPanel'
import '../style/modal-importPart.less'
import { MultiModalHook } from './MultiModal'
import { notice } from 'components/Notification'
class ToolbarPartExpands extends Component {
  state = {
    importVisible: false,
    multiQRvisible: false,
    importType: undefined,
  }
  handleExport = async (opts) => {
    const { type } = opts
    const { parameters, pageData } = this.props

    let requestUrl, values, fileTempName
    if (type === 'empty') {
      values = {}
      fileTempName = '设备台账导入模板.xlsx'
      requestUrl = `${configApiPrefix()}/iemsgx/equipmentledger/generateimporttemplate`
      exportFile(requestUrl, { method: 'GET' }, fileTempName)
    } else if (type === 'relation') {
      values = {}
      fileTempName = '批量维护子设备模板.xlsx'
      requestUrl = `${configApiPrefix()}/iemsgx/equipmentledger/generaterelationimporttemplate`
      exportFile(requestUrl, { method: 'GET' }, fileTempName)
    } else if (type === 'condition') {
      values = { ...parameters }
      // values = { ...parameters, pagination: pageData }
      fileTempName = `设备台账_${moment().format('YYYY-MM-DD')}.xlsx`
      requestUrl = `${configApiPrefix()}/iemsgx/equipmentledger/equipmentinfoexport`
      exportFile(requestUrl, { body: JSON.stringify(values) }, fileTempName)
    }
  }
  stateController = (options = {}, cb = null) => {
    this.setState(options, cb)
  }
  render() {
    let { importVisible, multiQRvisible, importType } = this.state
    let {
      handleReload,
      mainStates: { idsList },
      functionAuthority: { isSupervised, functionAuthority },
    } = this.props
    let importProps = {
      visible: importVisible, //导入
      importType,
      stateController: this.stateController,
      onSuccess: handleReload,
    }
    let multiModalProps = {
      visible: multiQRvisible,
      idsList,
      stateController: this.stateController,
    }

    return (
      <>
        <Button
          type="primary"
          className="toolbar-item"
          onClick={() => {
            this.setState({ importVisible: true, importType: 0 })
          }}
          icon="import"
          display={functionAuthority.includes('btnImport') && !isSupervised}
        >
          导入
        </Button>
        <Button
          type="primary"
          className="toolbar-item"
          onClick={() => this.handleExport({ type: 'condition' })}
          icon="export"
          display={functionAuthority.includes('btnExport')}
        >
          导出
        </Button>

        <>
          <Button
            type="primary"
            className="toolbar-item"
            icon="print"
            onClick={() => {
              if (idsList.length === 0) {
                notice.warn('请选择设备再操作')
                return
              }
              this.setState({ multiQRvisible: true })
            }}
            display={functionAuthority.includes('btnPrint')}
          >
            打印
          </Button>
          <MultiModalHook {...multiModalProps} />
        </>

        <Button
          type="primary"
          className="toolbar-item"
          icon="function"
          onClick={() => {
            this.setState({ importVisible: true, importType: 1 })
          }}
          display={functionAuthority.includes('btnRelate') && !isSupervised}
        >
          批量维护子设备
        </Button>

        <ImportModalPanel {...importProps} handleExport={this.handleExport}></ImportModalPanel>
      </>
    )
  }
}

export default ToolbarPartExpands
```
```js
/*
 * @Descripttion : 子组件-导入功能面板 visible: importVisible
 * @Author       : zhangming
 * @Date         : 2021-03-04 09:57:01
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-05-10 08:51:15
 */
import React from 'react'
import { Modal, ModalNormal } from 'components/Modal'
import Toolbar from 'components/Toolbar'
import Input from 'components/Input'
import Button from 'components/Button'
import Upload from 'components/Upload'
import { Card, Result } from 'antd'
import { notice } from 'components/Notification'
import Spin from 'components/Spin'

export default class extends React.Component {
  state = {
    fileLoading: false,
    isNormalLoaded: false,
    isTested: false,
    testedResult: [],
    $inputValue: '',
  }

  handleUpload = (e) => {
    if (e.file.response) {
      let { code, message } = e.file.response
      if (code === 0) {
        this.setState({
          testedResult: '',
          isNormalLoaded: true,
        })
        notice.success('通过校验，操作成功')
      } else if (code === 2) {
        notice.warning('未通过校验，操作失败')
        this.setState({
          isTested: true,
          testedResult: e.file.response.data || [],
        })
      } else {
        notice.error(message)
      }

      this.setState({
        fileLoading: false,
      })
    }
  }
  handleCheck = (e) => {
    let fileTypes = ['.xlsx']
    //字符串截取
    let fileName = e.name.split('.')[1]
    // 如果含有一样的格式，就return true 否则，错误提示
    if (!fileTypes.includes(`.${fileName}`)) {
      notice.info('未上传，请选择正确的文件格式.xlsx')
      return false
    }
    this.setState({
      fileLoading: true,
      $inputValue: e.name,
    })
    return true
  }
  copy() {
    const copyEle = document.querySelector('.errMsg')
    const range = document.createRange()
    window.getSelection().removeAllRanges()
    range.selectNode(copyEle)
    window.getSelection().addRange(range)
    const copyStatus = document.execCommand('Copy')

    if (copyStatus) {
      notice.info('复制成功')
    } else {
      notice.info('复制失败')
    }
    window.getSelection().removeAllRanges()
  }
  render() {
    let { visible, stateController, onSuccess, importType } = this.props
    let { $inputValue, isNormalLoaded, fileLoading, testedResult } = this.state
    let importTitle = importType === 0 ? '导入设备清单' : '批量维护子设备'
    let modalNormalProps = {
      title: importTitle,
      visible,
      modalOpts: {
        width: 940,
      },
      footer: true,
      onCancel: () => {
        stateController({ importVisible: false })
        isNormalLoaded && onSuccess()
      },
    }

    return (
      <ModalNormal {...modalNormalProps} className="iems_standingbook-importModal">
        <Spin size="small" spinning={!!fileLoading}>
          <div className="module-function-wrap">
            <Toolbar>
              <label>文件名</label>
              <Input readOnly={true} id="fileName" value={$inputValue} />
              <Button
                type="primary"
                className="toolbar-item"
                onClick={() =>
                  this.props.handleExport({ type: importType === 0 ? 'empty' : 'relation' })
                }
                icon="download"
              >
                下载模板
              </Button>
              <Upload
                showUploadList={false}
                action={
                  importType === 0
                    ? '/iemsgx/equipmentledger/equipmentinfoimporter'
                    : '/iemsgx/equipmentledger/equipmentrelationinfoimporter'
                }
                onChange={(e) => {
                  this.handleUpload(e)
                }}
                beforeUpload={this.handleCheck}
              >
                <Button type="primary" className="toolbar-item" icon="import">
                  导入
                </Button>
              </Upload>
            </Toolbar>
            <Card title="导入说明" bordered={true}>
              <p>1. 请先下载模板，按照示例数据正确填写信息。</p>
              <p>2. 设备编号是由系统生成的，用户不用填写。</p>
              <p>3. {importTitle}不成功会在下方显示错误信息。</p>
            </Card>
            {testedResult.length ? (
              <Card bordered={true} style={{ marginTop: '40px' }}>
                <div className="errMsg-toolbarPart">
                  <Button onClick={this.copy} type="primary" className="copy-btn" icon="copy">
                    复制错误信息
                  </Button>
                </div>

                <div className="errMsg">
                  {testedResult.map((item, index) => (
                    <>
                      <p>
                        <span>错误{index + 1}: </span>
                        {item}
                      </p>
                    </>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>
        </Spin>
      </ModalNormal>
    )
  }
}
```

# 二维码功能
```js
/*
 * @Descripttion : 设备台账-二维码 保存/打印
 * @Author       : zhangming
 * @Date         : 2021-02-22 14:53:14
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-06-11 09:33:27
 */

import React, { useEffect, useState } from 'react'
import { Modal, ModalNormal } from 'components/Modal'
import Button from 'components/Button'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import getQRcodeData from '../model/service'
import { notice } from 'components/Notification'

/**
 * @description: 另存图片
 * @param {type} object
 * @return: void
 */
const saveQRcode = () => {
  html2canvas(document.querySelector('#QRcode-content')).then((canvas) => {
    var MIME_TYPE = 'image/png'
    var imgURL = canvas.toDataURL(MIME_TYPE)
    var dlLink = document.createElement('a')
    dlLink.download = 'fileName'
    dlLink.href = imgURL
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':')
    document.body.appendChild(dlLink)
    dlLink.click()
    document.body.removeChild(dlLink)
  })
}
/**
 * @description: 打印
 * @param {type} void
 * @return: void
 */
const printQRcode = () => {
  let PDF = new jsPDF('', 'pt', 'a4')
  html2canvas(document.querySelector('#printDom'))
    .then(function (canvas) {
      const imgData = canvas.toDataURL('image/png')
      const imgProps = PDF.getImageProperties(imgData)
      const pdfWidth = PDF.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      PDF.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    })
    .then(() => {
      // PDF.autoPrint({ variant: 'non-conform' })
      // PDF.output('dataurlnewwindow')

      let a = window.open(PDF.output('bloburl'), '_blank')
      a.print()
    })
}

export const PreviewQRCodeHook = (props) => {
  let { visible, record, stateController } = props
  let [qrItem, setQrItem] = useState({})
  useEffect(() => {
    if (visible) {
      ;(async () => {
        let { data, code } = await getQRcodeData([record.id])
        if (!data[0]) {
          // stateController({ singleQRvisible: false })
          notice.error('无数据返回!')
          return
        }
        setQrItem(data[0])
      })()
    }
  }, [visible])
  useEffect(() => {
    const templateString = `设备名称:${qrItem.name}
    设备编码:${qrItem.code}
    品牌:${qrItem.brandName}
    安装位置:${qrItem.installationSite}
    所属部门:${qrItem.orgName}`

    document.querySelector('#canvas') &&
      QRCode.toCanvas(templateString, { errorCorrectionLevel: 'H' }, function (error, canvas) {
        if (error) console.error(error)
        console.log('success!')
        document.querySelector('#canvas').getContext('2d').drawImage(canvas, 0, 0, 220, 220)
      })
  }, [qrItem])

  const modalNormalProps = {
    title: `查看二维码`,
    visible,
    onCancel: () => stateController({ singleQRvisible: false }),
    modalOpts: {
      width: 640,
      footer: [
        <Button
          key="submit"
          type="primary"
          className="footer-left"
          onClick={() => {
            saveQRcode()
          }}
        >
          保存图片
        </Button>,
        <Button
          key="back"
          type="primary"
          onClick={() => {
            printQRcode()
          }}
        >
          打印
        </Button>,
      ],
    },
  }
  return (
    <ModalNormal {...modalNormalProps} className="single-QRcode-modal-wrapper QRcode-modal-wrapper">
      <div id="printDom">
        {Object.keys(qrItem).length > 0 && (
          <div className="QRcode-content" id="QRcode-content" style={{ height: '100%' }}>
            <canvas id="canvas" width="220" height="220"></canvas>
            <div className="QRcode-details">
              <pre>{`设备名称:${qrItem.name}`}</pre>
              <pre>{`设备编码:${qrItem.code}`}</pre>
              <pre>{`品牌:${qrItem.brandName}`}</pre>
              <pre>{`安装位置:${qrItem.installationSite}`}</pre>
              <pre>{`所属部门:${qrItem.orgName}`}</pre>
            </div>
          </div>
        )}
      </div>
    </ModalNormal>
  )
}

```

# util-导出文件流 anchor.click()
```js
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
```

# util打印文件流 iframe.print()
```js
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
```

# 筛选组件
```js
/*
 * @Descripttion : Do not edit
 * @Author       : hezihua
 * @Date         : 2020-05-07 11:00:29
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-07-04 11:14:59
 */
import React, { Component, createRef } from 'react'
import Button from 'components/Button'
import Popover from 'components/Popover'
import Form from 'components/Form'
import './index.less'

export default class extends Component {
  $wrapper = createRef()
  prehandler = (fn) => () => {
    this.$wrapper.current.click()
    return fn
  }

  render() {
    let {
      columns,
      searchevent,
      buttonObj,
      type,
      cxExpands = '',
      formOpts = {},
    } = this.props

    let formProps = {
      columns: columns,
      searchevent: this.prehandler(searchevent),
      ...formOpts,
    }
    let popoverProps = {
      content: (
        <div
          className={`popover-content ${cxExpands}`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Form {...formProps}></Form>
        </div>
      ),
    }

    return (
      <Popover {...popoverProps}>
        <div ref={this.$wrapper}>
          <Button
            type={type || 'default'}
            className="toolbar-item"
            icon={buttonObj && buttonObj.icon ? buttonObj.icon : 'filter'}
          >
            {buttonObj && buttonObj.name ? buttonObj.name : '筛选'}
          </Button>
        </div>
      </Popover>
    )
  }
}

```

# 大文件分片上传
1. 在UI库截停,手动上传
2. 分片上传, 请求体formData中每片的**描述信息**只有索引不一样, 总量,文件名要保持一致
3. 每一片的数据要怎么裁取:
```js
let formData = new FormData()
//->A.数据

let blockSize = 1024 * 1024 * 2 //每一份的大小
let shardCount = Math.ceil(file.size / blockSize) //总片数
let nextSize = Math.min((skip + 1) * blockSize, file.size) //读取到结束为止
let fileData = file.slice(skip * blockSize, nextSize) //截取 部分文件快

//->B.描述
formData.append('data', fileData) //将部分文件 放进formData对象
formData.append('fileName', file.name) //保存文件名称
formData.append('index', skip + 1) //保存文件名称
formData.append('total', shardCount) //保存文件名称

//->C.往接口传输
$$.post(getAction(10, true), formData, {
  processData: false, //指定不处理分片后的数据需要配置该参数
      headers: { 'content-type': 'multipart/form-data' }, // 需要使用到这个content-type头
    })
```
4. 分片上传的伪代码结构
```js
sliceUpload = (fileObj)  => {
   let upload = (file, skip) => {
     upload(file, ++skip)
   }
    upload(fileObj, 0)
}
```

# format数组去重
```js
export function unique(arr) {
  return Array.from(new Set(arr))
}
```
