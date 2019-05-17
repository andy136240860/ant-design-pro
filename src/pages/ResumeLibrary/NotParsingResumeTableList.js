import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Form, Input, Select, Button, Menu, Modal, message, Divider, Drawer } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './UnparsedResumeTableList.less';
import { retry } from 'rxjs/operator/retry';
import UploadFilesButton from '../../privateComponents/UploadFilesButton';

import Iframe from '../TalentPoolDetails/components/iframe/index';
import { getAuthority, getUserInfo } from '../../utils/authority';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
var thispagination = {};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ resumefile, user, rule, loading }) => ({
  resumefile,
  user,
  rule,
  loading: loading.models.resumefile,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    visible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resumefile/notparsinglist',
      payload: {},
    });
  }

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
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'resumefile/notparsinglist',
      payload: params,
    });
  };

  refreshPage = () => {
    return this.handleStandardTableChange(thispagination, {}, {});
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  viewResumeDetail = val => {
    this.setState({
      reportBackUrl: val.filePath,
    });
    this.showDrawer();
  };

  handleParseResume = id => {
    window.open(`/resumelibrary/pooldetails/new/2?data=${JSON.stringify(id)}`)
    // this.props.dispatch(
    //   routerRedux.push(`/resumelibrary/pooldetails/new/2?data=${JSON.stringify(id)}`)
    // );
  };

  handleNotParseResume = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'resumefile/changeresumefilestate',
      payload: {
        resumeid: val.id,
        state: 3,
      },
      callback: () => {
        this.refreshPage();
      },
    });
  };

  handleDeleteResume = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'resumefile/changeresumefilestate',
      payload: {
        resumeid: val.id,
        state: 0,
      },
      callback: () => {
        this.refreshPage();
      },
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  render() {
    const {
      resumefile: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = [
      {
        title: '文件编号',
        dataIndex: 'id',
      },
      {
        title: '文件名',
        render: val => {
          return <a onClick={() => this.viewResumeDetail(val)}>{val.fileName}</a>;
        },
      },
      {
        title: '上传时间',
        dataIndex: 'updatedTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '上传者',
        dataIndex: 'updated_user',
        render: val => {
          if (val != null) {
            return <span>{val.user_name}</span>;
          }
        },
      },
      {
        title: '操作',
        render: val => {
          return (
            <Fragment>
              <a onClick={() => this.handleParseResume(val)}>解析</a>
              {/* {deleteable && <Divider type="vertical" />}
              {deleteable && <a onClick={() => this.handleDeleteResume(val)}>删除</a>} */}
                <Divider type="vertical" />
             
             <a onClick={() => this.handleDeleteResume(val)}>删除</a>
            </Fragment>
          );
        },
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/* <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  this.props.dispatch(routerRedux.push(`/resumelibrary/pooldetails/new/2`));
                }}
              >
                新建简历
              </Button> */}
              {/* <UploadFilesButton refreshFuc={this.refreshPage} /> */}
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowSelectionDisable
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Drawer
            title="预览简历"
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
            
            width={1000}
            style={{ height: 'calc(100% - 55px)', padding: '0' }}
          >
            {this.state.reportBackUrl ? <Iframe src={`${this.state.reportBackUrl}`} /> : null}
          </Drawer>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
