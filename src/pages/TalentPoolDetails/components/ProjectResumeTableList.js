import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import SettingProjectResumeRemarkModel from '../../privateComponents/SettingProjectResumeRemarkModel';
import { Card, Form, Input, Select, Button, Menu, Modal, message, Drawer } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './ProjectResumeTableList.less';
import { retry } from 'rxjs/operator/retry';
import ProjectAddResumeDrawerList from './ProjectAddResumeDrawerList';
import ProjectResumeStatusDropDown from './Components/ProjectResumeStatusDropDown';
import { ConcurrentRequest } from '../../utils/ConcurrentRequest';
import { NotificationCenter } from '../../utils/NotificationCenter';
import { GetQueryString } from '../../utils/info';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

var thispagination = {};
var projectid = 0;
var tableList_refreshFuc;
var projectInfo = null;
var that;

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

@connect(({ resumelist, user, rule, loading }) => ({
  resumelist,
  user,
  rule,
  loading: loading.models.rule,
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
    that = this;
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    tableList_refreshFuc = this.refreshPage;
    if (id) {
      projectid = id;
      dispatch({
        type: 'resumelist/proresume',
        payload: {
          id: id,
        },
      });
    }
  }
  componentWillMount() {
    projectInfo = JSON.parse(GetQueryString('data'));
  }
  refreshPage = () => {
    this.setState({
      selectedRows: [],
    });
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
      id: this.props.match.params.id,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'resumelist/proresume',
      payload: params,
    });
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

  viewResumeDetail = data => {
    const id = data.resume.id;
    if (data.isShow == 0) {
      this.props.dispatch(
        routerRedux.push(
          `/resumetablelist/pooldetails/detail/${id}/5?data=${JSON.stringify(projectInfo)}`
        )
      );
    } else {
      this.props.dispatch(routerRedux.push(`/resumetablelist/pooldetails/view/${id}`));
    }
  };

  handleDeleteProjectResume = () => {
    const { selectedRows, modalVisible } = this.state;
    const { dispatch } = this.props;
    var requestArr = [];
    for (let i = 0; i < selectedRows.length; i++) {
      requestArr.push({
        type: 'resumelist/deleteProjectResume',
        payload: {
          proid: this.props.match.params.id,
          baseid: selectedRows[i].id,
        },
      });
    }
    ConcurrentRequest(dispatch, requestArr, this.refreshPage, this);
    // dispatch({
    //   type: 'resumelist/deleteProjectResume',
    //   payload: {
    //     proid:this.props.match.params.id,
    //     baseid:val.id,
    //   },
    //   callback: () => {
    //     this.refreshPage();
    //   },
    // });
  };

  handleResetProjectResumeStatus = (projectResume, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resumelist/editProjectResumeState',
      payload: {
        proid: this.props.match.params.id,
        baseid: projectResume.id,
        remark:
          projectResume.proStatus.project_remark == null
            ? ''
            : projectResume.proStatus.project_remark,
        status: status,
      },
      callback: () => {
        this.refreshPage();
      },
    });
  };

  render() {
    const {
      resumelist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const { dispatch } = this.props;
    const columns = [
      {
        title: 'ID',
        // dataIndex: 'id',
        render(val) {
          return <span>{val.id}</span>;
        },
        width: 60,
      },
      {
        title: '姓名',
        render: val => {
          // if (val.resume.base_person_sex == '' || val.resume.base_person_sex == null) {
          //   return (
          //     <div className={styles.ListForm_Narrow}>
          //       <a onClick={() => this.viewResumeDetail(val.resume.id)}>{val.resume.base_person_name}</a>
          //     </div>
          //   );
          // }
          return (
            <div className="ListForm_Narrow">
              {val.resume.base_person_sex == 1 ? <img src="../images/male.png" /> : null}
              {val.resume.base_person_sex == 2 ? <img src="../images/famale.png" /> : null}

              <a onClick={() => this.viewResumeDetail(val)}>
                {' '}
                {val.isShow == 0 ? val.resume.base_person_name : '***'}
              </a>
            </div>
          );
        },
        width: 120,
      },

      {
        title: '公司',
        // dataIndex: 'experience',
        render(val) {
          if (Array.isArray(val.resume.experience)) {
            if (val.resume.experience.length > 0) {
              var company = val.resume.experience[0].company;
              return <span>{company}</span>;
            }
          }
          return <span>-</span>;
        },
        width: 120,
      },
      {
        title: '行业',
        // dataIndex: 'base_person_industry',
        render(val) {
          try {
            const val_object = val.resume.base_person_industry;
            const c =
              val_object && val_object.length > 0 && Array.isArray(val_object)
                ? val_object.map(v => (
                    <span key={v.value} className={styles.labelYel}>
                      {v.label}
                    </span>
                  ))
                : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          } catch {
            return <div className={styles.wordBreak}>-</div>;
          }
        },
        width: 180,
      },
      {
        title: '职位',
        align: 'center',
        render(val) {
          var arr =[];
          if(val && val.experience && val.experience.length){
            for(var i =0 ;i<val.experience.length;i++){
              console.log(val.experience[i].position)
              if(val.experience[i] && val.experience[i].position && val.experience[i] && val.experience[i].position && val.experience[i].position.replace(/[\u0391-\uFFE5]/g,"aa").length >= 10){
                const name =val.experience[i].position;
                var str = `... `;
                str+=`${name.substring(name.length - 8)}`;
                arr.push(str)
              }else if(val.experience[i] && val.experience[i].position !== null){
                arr.push(val.experience[i].position)
               }
            }
          }
         
          try {
            const val_object = arr;
            const c = val_object && val_object.length > 0 && Array.isArray(val_object) ? 
            val_object.map((v)=>{
              // const arr =v.split(',');
              // const str =arr[arr.length -2];
             
             return (
              <span key={arr[arr.length -1]} className={styles.labelYel}>{v}</span>
             )
            }) : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          } catch {
            return <div className={styles.wordBreak}>-</div>;
          }
        },
        width: 120,
      },
      {
        title: '城市',
        // dataIndex: 'base_person_city_now',
        render(val) {
          try {
            const val_object = val.resume.base_person_city_now;
            const c =
              val_object && val_object.label ? (
                <span key={val_object.value} className={styles.labelYel}>
                  {val_object.label}
                </span>
              ) : (
                '-'
              );
            return <div className={styles.wordBreak}>{c}</div>;
          } catch {
            return <div className={styles.wordBreak}>-</div>;
          }
        },
        width: 120,
      },
      {
        title: '年薪',
        // dataIndex: 'base_person_salary',
        render(val) {
          if (val.resume.base_person_salary == '' || val.resume.base_person_salary == null) {
            return <span>-</span>;
          }
          return <span>{val.resume.base_person_salary}</span>;
        },
        width: 60,
      },
      {
        title: '年龄',
        // dataIndex: 'base_person_age',
        render(val) {
          var datenow = new Date();
          var year = moment(datenow).format('YYYY');
          var age = year - val.resume.base_person_age;
          if (val.resume.base_person_age == '' || val.resume.base_person_age == null) {
            return <span>-</span>;
          }
          return <span>{age}</span>;
        },
        width: 60,
      },

      {
        title: '更新时间',
        dataIndex: 'updated_at',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 164,
      },
      {
        title: '状态',
        render: val => {
          if (val != null && val != undefined) {
            return (
              <ProjectResumeStatusDropDown
                projectResume={val}
                selectStatus={this.handleResetProjectResumeStatus}
              />
            );
          }
          return <Fragment />;
        },
        width: 120,
      },
      {
        title: '备注',
        render: val => {
          if (val != null && val != undefined) {
            return (
              <Fragment>
                <SettingProjectResumeRemarkModel
                  resume={val}
                  projectid={this.props.match.params.id}
                  refreshFuc={this.refreshPage}
                />
                {/* <a onClick={() => this.handleDeleteProjectResume()}>删除</a> */}
              </Fragment>
            );
          }
          return <Fragment />;
        },
        width: 80,
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
            <div className={styles.tableListOperator}>
              <AddResumesButton />

              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleDeleteProjectResume}>从此项目移除</Button>
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1286, y: '100%' }}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}

class AddResumesButton extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div className={styles.AddResumesButton}>
        <Button
          icon="plus"
          type="primary"
          onClick={() => {
            that.props.dispatch(
              routerRedux.push(
                `/resumelibrary/pooldetails/new/5?data=${JSON.stringify(projectInfo)}`
              )
            );
          }}
        >
          新建简历至此项目
        </Button>
        <Button icon="plus" type="primary" onClick={this.showDrawer}>
          添加简历库简历至此项目
        </Button>
        <Drawer
          title="添加简历库简历至此项目"
          placement="right"
          width="1000"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <ProjectAddResumeDrawerList
            ref="test"
            projectid={projectid}
            refreshFuc={tableList_refreshFuc}
          />
        </Drawer>
      </div>
    );
  }
}
