/*
 * @Descripttion : 文件上传模块
 * @Author       : caojiarong
 * @Date         : 2020-08-25 11:14:07
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-05-28 14:10:47
 */
import React, { Component } from 'react'
import { connect } from 'dva'

import DataTable from 'components/DataTable'
import { fileInfoColumns } from './columns'
import fileHandler, { getFileType, getAction } from 'utils/fileHandler'
import { filetypes } from '../../../../../config'
import $$ from 'cmn-utils'
import Tooltip from 'components/Tooltip'
import Icon from 'components/Icon'
import { Modal } from 'components/Modal'
import Upload from 'components/Upload'
import { notice } from 'components/Notification'
import { Progress } from 'antd'

@connect(({ SGOnline_subModelAdd, loading }) => ({
  SGOnline_subModelAdd,
  loading: loading.models.SGOnline_subModelAdd,
}))
export default class extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    fileLoading: false,
    uploadShow: true,
    uploadPercent: 0,
    progressShow: false,
  }

  // 分片上传
  sliceUpload = (fileObj) => {
    this.setState({ progressShow: true })
    let upload = (file, skip) => {
      let formData = new FormData()
      let blockSize = 1024 * 1024 * 2 //每一份的大小
      let shardCount = Math.ceil(file.size / blockSize) //总片数
      let nextSize = Math.min((skip + 1) * blockSize, file.size) //读取到结束为止
      let fileData = file.slice(skip * blockSize, nextSize) //截取 部分文件快
      formData.append('data', fileData) //将部分文件 放进formData对象
      formData.append('fileName', file.name) //保存文件名称
      formData.append('index', skip + 1) //保存文件名称
      formData.append('total', shardCount) //保存文件名称
      // 传输文件
      $$.post(getAction(10, true), formData, {
        processData: false, //指定不处理分片后的数据需要配置该参数
        headers: { 'content-type': 'multipart/form-data' }, // 需要使用到这个content-type头
      }).then((response) => {
        let uploadPercent = ((skip / shardCount) * 100).toFixed(1) //计算上传的百分比进度，目前保留一位小数
        this.setState({ uploadPercent })
        if (file.size <= nextSize) {
          // alert('上传完成')
          this.setState({ progressShow: false, uploadPercent: 0 })
          this.handleUploadChange(response.data) //所有分片上传完后，将返回的数据显示在文件上传列表
          return
        }
        upload(file, ++skip)
      })
    }

    upload(fileObj, 0)
  }

  handleDownload = (record) => {
    fileHandler(record)
  }

  // 删除确认提示
  handleDelete = (record, type) => {
    Modal.confirm({
      title: '注意',
      content: '是否要删除这1项？',
      onOk: () => {
        // if (type == 'detail') {
        //   this.deleteFn(record)
        // } else {
        this.handleFileDelete(record)
        // }
      },
      onCancel() {},
    })
  }

  //上传操作
  handleBefore = (e) => {
    if (!filetypes.includes(getFileType(e.name))) {
      notice.warn(`该文件格式不支持上传, 支持文件格式:${filetypes.join(' ')}`)
      return
    }
    this.sliceUpload(e)
  }

  // 上传文件
  handleUploadChange = (e) => {
    if (!filetypes.includes(getFileType(e.fileName))) {
      notice.warn(`该文件格式不支持上传, 支持文件格式:${filetypes.join(' ')}`)
      return
    }
    this.setState({
      fileLoading: true,
    })
    if (e) {
      let {
        SGOnline_subModelAdd: { filePageData },
        dispatch,
      } = this.props
      let item = e.file
      filePageData.list.push({
        objectId: e.id,
        id: e.id,
        // index: e.lenght,
        fileSize: e.fileSize,
        fileName: e.fileName,
        createdOn: e.createdOn,
        filePath: e.filePath,
      })
      dispatch({
        type: 'SGOnline_subModelAdd/@change',
        payload: {
          filePageData,
        },
      })
      this.setState({
        fileLoading: false,
        uploadShow: false,
      })
    }
  }

  handleFileDelete = (record) => {
    let {
      SGOnline_subModelAdd: { filePageData },
      dispatch,
    } = this.props
    filePageData.list.splice(record.index, 1)
    filePageData.list.map((item, index) => {
      item.index = index
    })
    dispatch({
      type: 'SGOnline_subModelAdd/@change',
      payload: {
        filePageData,
      },
    })
    dispatch({
      type: 'SGOnline_subModelAdd/deleteFile',
      payload: {
        record,
      },
    })
  }

  render() {
    let { SGOnline_subModelAdd } = this.props
    let { fileLoading, uploadPercent, progressShow } = this.state
    let { filePageData, details } = SGOnline_subModelAdd
    let columnsFile = fileInfoColumns(this, this.state)

    const fileDataTableProps = {
      loading: fileLoading,
      showNum: true,
      columns: columnsFile,
      rowKey: 'id',
      dataItems: filePageData,
      showNum: false,
    }
    return (
      <section className="block-wrap big-file-upload">
        <div className="header">
          <span className="title">
            <span className="validFlag">*</span>相关附件
          </span>
          {(filePageData.list.length == 0 || details.attachment == null) && (
            <span>
              <Upload
                action=""
                customRequest={() => {
                  // 禁用自动上传
                }}
                showUploadList={false}
                beforeUpload={(file, fileList) => {
                  this.handleBefore(file)
                }}
              >
                <Tooltip title="新增">
                  <Icon ilng type="plus" className="icon-item"></Icon>
                </Tooltip>
              </Upload>
            </span>
          )}
        </div>
        <DataTable {...fileDataTableProps}></DataTable>
        {progressShow && (
          <div className="progress-line">
            <Progress type="circle" percent={uploadPercent} status="active" />
          </div>
        )}
      </section>
    )
  }
}
