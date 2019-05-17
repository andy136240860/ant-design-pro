import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Tag,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './ResumeTableList.less';
import { retry } from 'rxjs/operator/retry';
import SearchForm from './Components/SearchFormDev';
import { getAuthority, getUserInfo } from '../../utils/authority';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
var thispagination = {};

@connect(({ resumelist, user,  loading }) => ({
  resumelist,
  user,
  loading: loading.models.resumelist,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.handleStandardTableChange(thispagination, {}, {});

    // dispatch({
    //   type: 'resumelist/checkresume',
    // });
  }

  handleSearch = values => {
    var that = this;
    this.setState({ formValues: values }, () => {
      that.handleStandardTableChange(thispagination, {}, {});
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    thispagination = pagination;

    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      ...filters,
      desc: 2,
    };
    dispatch({
      type: 'resumelist/checkDev',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  viewResumeDetail = id => {
    const data = id;
    if (data.isShow == 0) {
      window.open(`/resumetablelist/pooldetails/detail/${data.id}/3`)
      // this.props.dispatch(routerRedux.push(`/resumetablelist/pooldetails/detail/${data.id}/3`));
    } else {
      window.open(`/resumetablelist/pooldetails/view/${data.id}`)
      // this.props.dispatch(routerRedux.push(`/resumetablelist/pooldetails/view/${data.id}`));
    }
  };

  handleDeleteResume = id => {
    const { dispatch } = this.props;

    dispatch({
      type: 'resumelist/deleteresume',
      payload: {
        ...id,
      },
      callback: () => {
        this.handleStandardTableChange(thispagination, {}, {});
      },
    });
  };
 
  handleResetProjectResumeStatus = (id, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resumelist/changeStatus',
      payload: {
        id,
        status,
      },
      callback: () => {
        this.handleStandardTableChange(thispagination, {}, {});
      },
    });
  };
  render() {
    const {
      resumelist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const that = this;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align:'center',
        width: 120,
      },
      {
        title: '简历姓名',
        align:'center',
        render: val => {
          return (
            <div className="ListForm_Narrow">
              {val.base_person_sex == 1 ? <img src="../images/male.png" /> : null}
              {val.base_person_sex == 2 ? <img src="../images/famale.png" /> : null}
              <a onClick={() => this.viewResumeDetail(val)}>
                {' '}
                {val.isShow == 0 ? val.base_person_name : '***'}
              </a>
            </div>
          );
        },
        width: 120,
      },
      {
        title: '姓名',
        dataIndex: 'inspect_name',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '性别',
        dataIndex: 'inspect_sex',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '年龄',
        dataIndex: 'inspect_age',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '手机号',
        dataIndex: 'inspect_phone',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '邮箱',
        dataIndex: 'inspect_email',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '最高学历',
        dataIndex: 'inspect_height_education',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '第一学历',
        dataIndex: 'inspect_education',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '是否统招',
        dataIndex: 'inspect_rr',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '工作年限',
        dataIndex: 'inspect_work_time',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '当前城市',
        dataIndex: 'inspect_city_now',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '期望城市',
        dataIndex: 'inspect_city_hope',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '月薪',
        dataIndex: 'inspect_salarypm',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '年薪',
        dataIndex: 'inspect_salary',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
      {
        title: '工作经历',
        dataIndex: 'inspect_project',
        align:'center',
        render(val) {
          switch (Number(val)) {
            case 0:
              return null;
            case 1:
              return <Tag color="#f50">解析错误</Tag>;
            case 2:
              return <Tag color="magenta">已解决</Tag>;
            case 3:
              return <Tag color="volcano">不解决</Tag>;
            case 4:
              return <Tag color="cyan">暂缓</Tag>;
          }
        },
        width: 120,
      },
    ];

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm searchFuc={this.handleSearch} />
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  window.open(`/resumelibrary/pooldetails/new/3`)
                  // this.props.dispatch(routerRedux.push(`/resumelibrary/pooldetails/new/3`));
                }}
              >
                新建简历
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              rowSelectionDisable
              onChange={this.handleStandardTableChange}
              scroll={{ x: 2000, y: '100%' }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
import PropTypes from 'prop-types';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
class SelectItem extends PureComponent {
  static contextTypes = {
    status: PropTypes.object,
    refreshState: PropTypes.func,
    id: PropTypes.number,
  };

  state = {
    visible: false,
  };

  handleMenuClick = e => {
    if (e.item.props.status >= 0) {
      // TODO:接口未调
      // dispatch({
      //   type: 'project/edit',
      //   payload: {
      //     proid: this.props.id,
      //     state : e.item.props.status,
      //   },
      // }).then(() => {
      //   this.props.refreshState();
      // });
    }
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  menuTitle = data => {
    switch (Number(data)) {
      case 0:
        return '正常';
      case 1:
        return '解析错误';
      case 2:
        return '已解决';
      case 3:
        return '不解决';
      case 4:
        return '暂缓';
    }
  };

  menuStatus = status => {
    // 'success' | 'processing' | 'default' | 'error' | 'warning';
    switch (Number(status)) {
      case 0:
        return 'processing';
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'error';
      case 4:
        return 'default';
      default:
        return 'default';
    }
  };
  componentWillMount() {}
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item status="0">正常</Menu.Item>
        <Menu.Item status="1">解析错误</Menu.Item>
        <Menu.Item status="2">已解决</Menu.Item>
        <Menu.Item status="3">不解决</Menu.Item>
        <Menu.Item status="4">暂缓</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        overlay={menu}
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
      >
        <Badge
          status={this.menuStatus(this.props.status)}
          text={this.menuTitle(this.props.status)}
        />
      </Dropdown>
    );
  }
}
