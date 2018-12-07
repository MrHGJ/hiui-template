import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import axios from 'axios'
import isEqual from 'lodash/isEqual'
import Table from '@hi-ui/hiui/es/table'
import Icon from '@hi-ui/hiui/es/icon'
import QueryTool from './tools/query'
import FilterTool from './tools/filter'
import RowHeightTool from './tools/row-height'
import StatisticsTool from './tools/statistics'
import ColumnTool from './tools/column'
import Action from './action'
import './style/data-filter.scss'

export default class DataFilter extends Component {
  forms = {}
  toolsMap = {
    'query': {
      type: 'query',
      icon: 'approve',
      title: '查询',
      trigger: 'toggle'
    }, 
    'filter': {
      type: 'filter',
      popper: true,
      icon: 'label',
      title: '筛选',
      trigger: 'outside'
    }, 
    'row-height': {
      type: 'row-height',
      popper: true,
      icon: 'phone',
      title: '行高',
      trigger: 'outside'
    }, 
    'column': {
      type: 'column',
      popper: true,
      icon: 'phone',
      title: '列显示',
      trigger: 'outside'
    }, 
    'statistics': {
      type: 'statistics',
      popper: true,
      icon: 'linechart',
      title: '统计',
      trigger: 'outside'
    }
  }

  static propTypes = {
    canSubmit: PropTypes.bool,
    beforeSubmit: PropTypes.func,
    Map: PropTypes.array,
    actions: PropTypes.array
  }

  static defaultProps = {
    beforeSubmit: () => true,
    canSubmit: true,
    actions: [ 'search', 'add', 'download', 'share', 'more' ],
    tools: [ 'query', 'filter', 'row-height', 'column', 'statistics' ],
    columnMixins: [],
    columns: []
  }

  constructor(props) {
    super(props)

    this.state = {
      columns: this.mixinColumns(props.columns), // all columns
      filteredColumns: [], // filtered columns
      filters: [], // 筛选
      rowHeight: 'middle', // 行高
      activeTools: [ 'query' ],
      datas: [],
      page: 1,
      total: 0,
      pageSize: 0
    }
  }

  componentDidMount() {
    if (this.props.columns.length > 0) {
      const filteredColumns = this.filterColumns(this.props.columns)

      this.props.setState({filteredColumns})
    }
    this.fetchDatas(this.props)
    window.addEventListener('click', this.hidePopper.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.hidePopper.bind(this))
  }

  getChildContext () {
    return {
      component: this
    }
  }

  hidePopper(e, type) {
    const activeTools = this.state.activeTools.splice(0)

    activeTools.map((tool, index) => {
      if (this.toolsMap[tool].trigger === 'outside' && type!==tool) {
        activeTools.splice(index, 1)
      }
    })
    
    this.setState({activeTools})
  }

  fetchDatas(props, forms={}) {
    const {
      params,
      url
    } = props
    const {
      page
    } = this.state

    if (Object.keys(forms).length !== 0) {
      this.forms = forms
    }

    axios.get(url, {
      params: {
        page,
        ...params,
        ...this.forms
      }
    }).then(ret => {
      if (ret && ret.data.code === 200) {
        const data = ret.data.data
        const state = {
          datas: data.data,
          page: parseInt(data.pageInfo.page),
          total: parseInt(data.pageInfo.total),
          pageSize: parseInt(data.pageInfo.pageSize)
        }

        if (data.columns) {
          this.mixinColumns(data.columns, true)
          const filteredColumns = this.filterColumns()

          this.setState({filteredColumns, ...state})
        } else {
          this.setState(state)
        }
      }
    })
  }

  mixinColumns(columns, updateState=false) {
    const _columns = []

    columns.map(column => {
      const key = column.key

      _columns.push({
        ...column,
        ...this.props.columnMixins[key]
      })
    })

    updateState && this.setState({columns: _columns})

    return _columns
  }

  filterColumns() {
    const _columns = []

    this.state.columns.map(column => {
      if (column.display) {
        _columns.push({
          ...column
        })
      }
    })

    return _columns
  }

  renderActions() {
    const {
      actions,
      title
    } = this.props

    return (
      <div className="hi-form-filter__actions">
        <div className="hi-form-filter__title">
          {title}
        </div>
        <div className="hi-form-filter__actions--container">
          {
            actions.map((action, index) => (
              <Action type={action} key={index} />
            ))
          }
        </div>
      </div>
    )
  }

  setActiveTool(tool) {
    const {
      activeTools
    } = this.state
    const index = activeTools.indexOf(tool.type)

    if (index>-1) {
      activeTools.splice(index, 1)
    } else {
      activeTools.push(tool.type)
    }
    
    this.setState({
      activeTools
    })
  }

  renderTools() {
    const {
      tools
    } = this.props
    const {
      activeTools
    } = this.state

    return (
      <div className="hi-form-filter__tools">
        {
          tools.map((item, index) => {
            let tool

            if (typeof item === 'string') {
              tool = this.toolsMap[item]
            } else if (typeof item === 'object') {
              tool = Object.assign({}, this.toolsMap[item.type], item)
            } 
            if (!tool.title) {
              return (
                <div className="hi-form-filter__tool hi-form-filter__tool--custom" key={index}>
                  {item}
                </div>
              )
            }
            
            const active = activeTools.indexOf(tool.type) > -1

            return (
              <div 
                className={classNames('hi-form-filter__tool', {'hi-form-filter__tool--active': active})}
                key={index}
              >
                <div 
                  className="hi-form-filter__tool--title"
                  data-type={tool.type}
                  onClick={e => {
                    e.stopPropagation()
                    this.setActiveTool(tool)
                    this.hidePopper(e, tool.type)
                  }}
                >
                  <Icon name={tool.icon} />
                  {tool.title && tool.title}
                </div>
                {
                  active && tool.popper &&
                  <div className="hi-form-filter__tool--content">
                    {this.renderToolContent(tool)}
                  </div>
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  mixinTool(type) {
    for (let tool of this.props.tools) {
      if (tool.type === type) {
        return Object.assign({}, this.toolsMap[type], tool)
      }
    }
    
    return this.toolsMap[type]
  }

  renderToolContent(tool) {
    const {
      type,
      ...props
    } = tool

    if (type === 'query') {
      return <QueryTool {...props}/>
    } else if (type === 'filter') {
      return <FilterTool {...props}/>
    } else if (type === 'row-height') {
      return <RowHeightTool {...props}/>
    } else if (type === 'statistics') {
      return <StatisticsTool {...props}/>
    } else if (type === 'column') {
      return <ColumnTool {...props}/>
    }
  }

  render() {
    const {
      activeTools,
      filteredColumns,
      datas,
      page,
      total
    } = this.state
    const {
      table,
      params
    } = this.props
    const tableProps = Object.assign({}, table, {
      columns: filteredColumns,
      data: datas,
      name: 'sorter',
      pagination: {
        pageSize: params.pageSize,
        total: total,
        page: page,
        onChange: page => {
          this.setState({page: page}, () => {
            this.fetchDatas(this.props)
          })
        }
      }
    })

    return (
      <React.Fragment>
        <div className="hi-form-filter">
          {this.renderActions()}
          {this.renderTools()}
          { activeTools.indexOf('query')>-1 && this.renderToolContent(this.mixinTool('query')) }
        </div>
        <div className="hi-data">
          <Table {...tableProps} />
        </div>
      </React.Fragment>
    )
  }
}

DataFilter.childContextTypes = {
  component: PropTypes.any
}