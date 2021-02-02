import React, { Component } from 'react'
import { Button, Tabs, Stepper, Timeline, Icon, Grid, Loading, Breadcrumb, Table } from '@hi-ui/hiui'
import './index.scss'
import axios from 'axios'

const { Row, Col } = Grid

const delay = (timeout = 1000) => new Promise(resolve => setTimeout(() => resolve(), timeout))

export default class Template extends Component {
  state = {
    title: '小米8屏幕指纹版',
    activeTabIndex: 0,
    desc: Array(3).fill({
      key: '状态',
      value: '已借出'
    }),
    baseInfo: {},
    stepper: {
      data: Array(5).fill({
        title: '账号信息',
        content: '请输入账号信息'
      }),
      current: Math.round(Math.random() * 4)
    },
    timelineList: [
      {
        groupTitle: '2月',
        children: [
          {
            title: 'Title - 1',
            content: 'Here are some descriptions',
            timestamp: '10:00'
          },
          {
            dot: 'circle',
            title: 'Title 2',
            content: 'Here are some descriptions',
            timestamp: '10:00'
          },
          {
            dot: 'circle',
            title: 'Title 3',
            content: 'Here are some descriptions',
            timestamp: '12:00'
          },
          {
            dot: 'circle',
            title: 'Title 4',
            content: 'Here are some descriptions',
            timestamp: '11:00'
          }
        ]
      }
    ]
  }

  fetchBaseInfo = async () => {
    return axios
      .get('https://yapi.baidu.com/mock/34633/hiui/details')
      .then(res => {
        const resData = res?.data
        if (resData && resData.code === 200) {
          const data = resData.data
          this.setState({ baseInfo: data.baseInfo, title: data.title, desc: data.desc })
        } else {
          throw new Error('未知错误')
        }
      })
      .catch(error => {
        Notification.open({
          type: 'error',
          title: error.message
        })
      })
  }

  handleBackClick = () => {}
  handleSaveClick = () => {}
  handleEditClick = () => {}
  handleMoreClick = () => {}

  async componentDidMount() {
    Loading.open(null, { key: 'lk' })
    try {
      await this.fetchBaseInfo()
    } finally {
      Loading.close('lk')
    }
  }

  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { title, baseInfo, stepper, timelineList, activeTabIndex } = this.state

    return (
      <div className="page--detail-card">
        <Col className="detail-card">
          <Col className="detail-card__header">
            <Row className="row row-01" align="center">
              <Breadcrumb
                separator="|"
                onClick={this.handleBackClick}
                data={[
                  {
                    content: (
                      <span>
                        <Icon name="left" />
                        <span>返回</span>
                      </span>
                    ),
                    path: '/'
                  },
                  {
                    content: <span>详情</span>,
                    path: '/detail-card'
                  }
                ]}
              />
            </Row>
            <Row className="row row-02" justify="space-between">
              <Col>
                <h2>{title}</h2>
              </Col>
              <Col>
                <Button icon="edit" type="primary" onClick={this.handleEditClick}>
                  编辑
                </Button>
                <Button icon="collection" type="line" onClick={this.handleSaveClick}>
                  收藏
                </Button>
                <Button icon="more" type="line" onClick={this.handleMoreClick} />
              </Col>
            </Row>
          </Col>
          <Row className="row row-03">
            <Col className="detail-card__card detail-card__card--base page page--gutter">
              <Row className="title">基础信息</Row>
              <ul>
                {Object.values(baseInfo).map(({ key, value }, idx) => (
                  <li key={idx}>
                    <div>{key}</div>
                    <div>{value}</div>
                  </li>
                ))}
                {Object.values(baseInfo).map(({ key, value }, idx) => (
                  <li key={idx}>
                    <div>{key}</div>
                    <div>{value}</div>
                  </li>
                ))}
              </ul>
            </Col>
            <Col className="detail-card__card detail-card__card--record page page--gutter">
              <Row className="title">修改记录</Row>
              <Timeline data={timelineList} />
            </Col>
          </Row>

          <Col className="detail-card__card detail-card__card--stepper page page--gutter">
            <Row className="title">项目流程</Row>
            <Row className="stepper">
              <Stepper {...{ ...stepper, itemLayout: 'vertical' }} />
            </Row>
          </Col>
          <Col className="detail-card__card">
            <Tabs
              className="detail-card__table-container"
              type="line"
              activeId={activeTabIndex}
              onTabClick={tabId => {
                this.setState({
                  activeTabIndex: tabId
                })
              }}
            >
              <Tabs.Pane tabTitle="商品信息" tabId={0}>
                <QueryBasic />
              </Tabs.Pane>
              <Tabs.Pane tabTitle="车辆信息" tabId={1}>
                <QueryBasic />
              </Tabs.Pane>
            </Tabs>
          </Col>
        </Col>
      </div>
    )
  }
}

const queryData = {
  selectedRowKey: 'id',
  total: 20,
  current: 1,
  pageSize: 5,
  tableData: [
    {
      id: 3249,
      name: '小米9',
      sku: '8+64',
      phone: '11225568',
      channel: '小米商城',
      dealer: '线下KA',
      shareCount: '12,345,678',
      activeCount: '2'
    },
    {
      id: 3299,
      name: '小米9 SE',
      sku: '6+64',
      phone: '11225568',
      channel: '清河店',
      dealer: '线下KA',
      shareCount: '19.000',
      activeCount: '10,000'
    },
    {
      id: 4299,
      name: '小米8',
      sku: '6+64',
      phone: '11225568',
      channel: '双安店',
      dealer: '线下KA',
      shareCount: '25.000',
      activeCount: '10,000'
    },
    {
      id: 4219,
      name: 'Redmi Note7',
      sku: '4+64',
      phone: '11225568',
      channel: '华润五彩城店',
      dealer: '线下KA',
      shareCount: '9.000',
      activeCount: '100'
    },
    {
      id: 4229,
      name: 'Redmi k30',
      sku: '8+64',
      phone: '22225568',
      channel: '华润五彩城店',
      dealer: '线下KA',
      shareCount: '9.000',
      activeCount: '100'
    }
  ]
}

class QueryBasic extends Component {
  columnMixins = {
    columns: [
      {
        title: 'SKU',
        dataKey: 'sku'
      },
      {
        title: '商品ID',
        dataKey: 'id'
      },
      {
        title: '商品名',
        dataKey: 'name'
      },
      {
        title: '电话',
        dataKey: 'phone'
      },
      {
        title: '渠道',
        dataKey: 'channel'
      },
      {
        title: '经销商',
        dataKey: 'dealer'
      },
      {
        title: '分货量',
        dataKey: 'shareCount',
        sorter(pre, next) {
          return pre - next
        }
      },
      {
        title: '激活量',
        dataKey: 'activeCount',
        sorter(pre, next) {
          return pre - next
        }
      },
      {
        title: '操作',
        dataKey: 'id',
        render: (value, item) => {
          return (
            <React.Fragment>
              <Icon name="edit" onClick={() => this.tableUpdateControlor('edit', value)} />
              <Icon name="delete" onClick={() => this.tableUpdateControlor('delete', value)} />
              <Icon name="more" onClick={() => this.tableUpdateControlor('more', value)} />
            </React.Fragment>
          )
        }
      }
    ],
    sorter(pre, next) {
      return pre.column1 - next.column1
    }
  }

  state = {
    total: 0,
    current: 1,
    pageSize: 10,
    tableData: [],
    selectedRowKey: ''
  }

  fetchQueryBasic = async () => {
    await delay()
    const { tableData, ...rest } = queryData
    const _tableData = tableData.map(item => ({ ...item, key: item.id }))
    this.setState({ ...rest, tableData: _tableData })
  }

  async componentDidMount() {
    await this.fetchQueryBasic()
  }

  tableUpdateControlor = (name, value) => {
    console.log(name, value)
  }

  render() {
    const { columnMixins } = this
    const { total, current, pageSize, tableData, selectedRowKey } = this.state

    return (
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Table
            columns={columnMixins.columns}
            data={tableData}
            rowSelection={{
              selectedRowKeys: selectedRowKey,
              onChange: selectedRowKey => {
                this.setState({ selectedRowKey })
              }
            }}
            pagination={{
              total,
              current,
              pageSize,
              onChange: current => {
                this.setState({ current: current })
              }
            }}
          />
        </Col>
      </Row>
    )
  }
}
