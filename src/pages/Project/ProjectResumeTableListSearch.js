import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { crtTimeFtt } from '../../utils/info';
// import EditProject from './EditProjectView';

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
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SearchForm from './Components/SearchFormList';
import styles from './ProjectTableList.less';
import { stringify } from 'querystring';

import ProjectStatusDropDown from './Components/ProjectStatusDropDownDev';
import ProjectResumeStatusDropDownmain from './Components/ProjectStatusDropDownmain';
import { getAuthority, getUserInfo } from '../../utils/authority';

// const EditPro = Form.create()(EditProject);
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

var thispagination = {};

var currentEditingProject = {};

const CreateForm = Form.create(currentEditingProject)(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const dateFormat2 = 'YYYY-MM-dd HH:mm:ss';

  var moment2 = [];
  if (
    !(
      currentEditingProject.start_time == null ||
      currentEditingProject.start_time == undefined ||
      currentEditingProject.start_time == '' ||
      currentEditingProject.end_time == null ||
      currentEditingProject.end_time == undefined ||
      currentEditingProject.end_time == '' ||
      currentEditingProject == {}
    )
  ) {
    moment2.push(moment(currentEditingProject.start_time, dateFormat2));
    moment2.push(moment(currentEditingProject.end_time, dateFormat2));
  }

  return (
    <Modal
      title="新建项目"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="客户公司">
        {form.getFieldDecorator('projectCompany', {
          initialValue: currentEditingProject.company,
          rules: [{ required: true, message: '请输入客户公司名称' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目名称">
        {form.getFieldDecorator('projectName', {
          initialValue: currentEditingProject.name,
          rules: [{ required: true, message: '请输入项目名称' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="行业">
        {form.getFieldDecorator('projectIndustry', {
          initialValue: currentEditingProject.industry,
          rules: [{ required: true, message: '请选择行业' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="职能">
        {form.getFieldDecorator('projectMajor', {
          initialValue: currentEditingProject.major,
          rules: [{ required: true, message: '请选择职能' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="城市">
        {form.getFieldDecorator('projectCity', {
          initialValue: currentEditingProject.city,
          rules: [{ required: true, message: '请选择职位所在城市' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目时间">
        {form.getFieldDecorator('projectTime', {
          initialValue: moment2,
          rules: [{ required: true, message: '请选择项目开始结束时间' }],
        })(<RangePicker format={dateFormat} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="JD">
        {form.getFieldDecorator('projectJD', {
          initialValue: currentEditingProject.describe,
          rules: [{ required: true, message: '请输入项目职责要求' }],
        })(<TextArea placeholder="请输入" autosize="true" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ project, rule, loading }) => ({
  project,
  rule,
  loading: loading.models.project,
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
    this.requestFirstPage();
  }

  requestFirstPage() {
    return this.handleStandardTableChange({}, {}, {});
  }

  refreshPage = () => {
    return this.handleStandardTableChange(thispagination, {}, {});
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
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'project/list',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
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

  handleSearch = values => {
    var that = this;
    this.setState({ formValues: values }, () => {
      that.handleStandardTableChange(thispagination, {}, {});
    });
  };

  handleEditProject = id => {
    this.handleFormReset();
    currentEditingProject = {};
    if (id > 0) {
      if (Array.isArray(this.props.project.data.list)) {
        for (let i = 0; i < this.props.project.data.list.length; i++) {
          if (this.props.project.data.list[i].id == id) {
            currentEditingProject = this.props.project.data.list[i];
            break;
          }
        }
      }
    }
    this.handleModalVisible(true);
  };

  handleModalVisible = flag => {
    const { form } = this.props;
    form.resetFields();
    this.handleFormReset();
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;

    var starttime = crtTimeFtt(fields.projectTime[0], 1);
    var endtime = crtTimeFtt(fields.projectTime[1], 1);

    if (currentEditingProject.id > 0) {
      dispatch({
        type: 'project/edit',
        payload: {
          proid: currentEditingProject.id,
          company: fields.projectCompany,
          industry: fields.projectIndustry,
          major: fields.projectMajor,
          city: fields.projectCity,
          starttime: starttime,
          endtime: endtime,
          describe: fields.projectJD,
          name: fields.projectName,
        },
        callback: () => {
          this.requestFirstPage();
        },
      });
    } else {
      dispatch({
        type: 'project/new',
        payload: {
          company: fields.projectCompany,
          industry: fields.projectIndustry,
          major: fields.projectMajor,
          city: fields.projectCity,
          starttime: starttime,
          endtime: endtime,
          describe: fields.projectJD,
          name: fields.projectName,
        },
        callback: () => {
          this.requestFirstPage();
        },
      });
    }

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  viewProjectResumeList = val => {
    let data = {};
    data.projectId = val.id;
    data.projectName = val.name;
    window.open(`/project/projectresumelist/${val.id}?data=${JSON.stringify(data)}`);
    // this.props.dispatch(
    //   routerRedux.push(`/project/projectresumelist/${val.id}?data=${JSON.stringify(data)}`)
    // );
  };
  newList = val => {
    let data = {};
    data.projectId = val.id;
    data.projectName = val.name;
    window.open(`/resumelibrary/pooldetails/new/5?data=${JSON.stringify(data)}`);
    // this.props.dispatch(
    //   routerRedux.push(`/resumelibrary/pooldetails/new/5?data=${JSON.stringify(data)}`)
    // );
  };
  handleDeleteResume = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/delete',
      payload: {
        id: val.id,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.refreshPage();
      },
    });
  };

  render() {
    const {
      project: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'projectid',
        width: 80,
      },
      {
        title: '项目名称',
        render: val => {
          return <a onClick={() => this.viewProjectResumeList(val)}>{val.name}</a>;
        },
        width: 150,
      },
      {
        title: '公司名称',
        dataIndex: 'company',
        width: 120,
      },
      {
        title: '城市',
        dataIndex: 'city',
        width: 80,
      },
      {
        title: '截止时间',
        dataIndex: 'end_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 180,
      },
      {
        title: '重要程度',
        render: val => {
          return <ProjectResumeStatusDropDownmain project={val} refreshFuc={this.refreshPage} />;
        },
        width: 95,
      },
      {
        title: '状态',
        render: val => {
          return <ProjectStatusDropDown project={val} refreshFuc={this.refreshPage} />;
        },
        width: 95,
      },
      {
        title: '操作',
        render: val => {
          return (
            <Button type="primary" onClick={() => this.newList(val)}>
              投递新简历
            </Button>
          );
        },
        width: 120,
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
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator} />
            <SearchForm searchFuc={this.handleSearch} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1153, y: '100%' }}
              filterMultiple="false"
              rowSelectionDisable
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
