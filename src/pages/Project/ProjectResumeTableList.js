import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import SettingProjectResumeRemarkModel from '../../privateComponents/SettingProjectResumeRemarkModel';
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
  Drawer,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Tabs,
  Cascader,
  Radio
} from 'antd';
import StandardTable from '@/components/StandardTable';

import { processCon } from '../../utils/processConfig';
import styles from './ProjectResumeTableList.less';
import { retry } from 'rxjs/operator/retry';
import ProjectAddResumeDrawerList from './ProjectAddResumeDrawerList';
import ProjectResumeStatusDropDown from './Components/ProjectResumeStatusDropDown';
import ProjectResumeStatusDropDownmain from './Components/ProjectStatusDropDownmain';
import { ConcurrentRequest } from '../../utils/ConcurrentRequest';
import { NotificationCenter } from '../../utils/NotificationCenter';
import { GetQueryString } from '../../utils/info';

import ModlesProcess from './Components/processModel';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var projectid = 0;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

var thispagination = {};
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

const description = (
  <div>aaaaaaaaaaaaaaaa</div>
);

@connect(({ resumelist, user, rule, loading }) => ({
  resumelist,
  user,
  rule,
  loading: loading.models.resumelist,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    smallvisible: false,
    columns:[],
  };
  componentDidMount() {
    that = this;
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    this.switchTableStatus('baseInfo');

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
    }).then(() => {});
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
  handleType = type => {
    this.setState({ switchtype: type, smallvisible: true });
  };
  handelModalCancel = () => {
    this.setState({
      smallvisible: false,
    });
  };

  handelModalok = () => {
    const {
      dispatch,
      form,
      match: {
        params: { id },
      },
    } = this.props;
    const { switchtype, selectedRows } = this.state;


    if (!selectedRows) return;
    var arr = [];
    for (var i = 0; i < selectedRows.length; i++) {
      arr.push(selectedRows[i].base_id);
    }
    const proid = id;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const data = {
        ...fieldsValue,
        status_id: fieldsValue.status_id >= 0 ? fieldsValue.status_id : null,
        date: moment(fieldsValue.date._d).format('YYYY-MM-DD HH:mm:ss'),
        baseid: arr ,
        proid,
      };
      form.resetFields();
      if (switchtype == 1) {

        dispatch({
          type: 'resumelist/addstatus',
          payload: data,
          callback: () => {
            this.setState({ smallvisible: false });
            that.refreshPage();
          },
        })
        } else if (switchtype == 2) {
          dispatch({
            type: 'resumelist/addcall',
            payload: data,
            callback: () => {
              this.setState({ smallvisible: false });
              this.refreshPage();
            },
          });
      }
    });
  };
  delFuceteProjectResume = () => {
    const { selectedRows, modalVisible } = this.state;
    const { dispatch } = this.props;
    var requestArr = [];
    for (let i = 0; i < selectedRows.length; i++) {
      requestArr.push({
        type: 'resumelist/deleteProjectResume',
        payload: {
          proid: this.props.match.params.id,
          baseid: selectedRows[i].base_id,
        },
      });
    }
    ConcurrentRequest(dispatch, requestArr, this.refreshPage, this);
  };

  handleResetProjectResumeStatus = (projectResume, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resumelist/editProjectResumeState',
      payload: {
        proid: this.props.match.params.id,
        baseid: projectResume.base_id,
        remark: projectResume.project_remark == null ? '' : projectResume.project_remark,
        status: status,
      },
      callback: () => {
        this.refreshPage();
      },
    });
  };
  handleProcessDel = (type, proid, baseid, id) => {
    const { dispatch } = this.props;
    // const data = { proid: ...proid, baseid:...baseid, id:...id };

    if (type == 'status') {
      dispatch({
        type: 'resumelist/dellstatus',
        payload: { proid: proid, baseid: baseid, id: id },
        callback: () => {
          this.refreshPage();
        },
      });
    } else if (type == 'call') {
      dispatch({
        type: 'resumelist/delcall',
        payload: { proid: proid, baseid: baseid, id: id },
        callback: () => {
          this.refreshPage();
        },
      });
    }
  };

  handleProcessAdd = () => {};
  handleProcessEdi = () => {};

  switchTableStatus = (e) => {
    console.info(e);

    const {
      resumelist: { projectResumeData }
    } = this.props;
    let mindate = null;
    let maxdate = null;
    projectResumeData && projectResumeData.list && projectResumeData.list.length > 0 && projectResumeData.list.map(
        (item, index) => {
          if (item.status_info && item.status_info.length > 0) {
            item.status_info.map((line, idx) => {
              if (line.date) {
                if (mindate === null) {
                  mindate = line.date;
                } else {
                  if (new Date(mindate) > new Date(line.date)) {
                    mindate = line.date;
                  }
                }
                if (maxdate === null) {
                  maxdate = line.date;
                } else {
                  if (new Date(maxdate) < new Date(line.date)) {
                    maxdate = line.date;
                  }
                }
              }
            });
          }
        }
      );

    const columnsBaseInfo = [
      {
        title: 'ID',
        // dataIndex: 'id',
        render(val) {
          return <span>{val.id}</span>;
        },
        width: 60,
        align: 'center',
        // fixed: 'left',
      },
      {
        title: '姓名',
        align: 'center',
        render: val => {
          if (
            val.resume &&
            (val.resume.base_person_sex == '' || val.resume.base_person_sex == null)
          ) {
            return (
              <div className={styles.ListForm_Narrow}>
                <a onClick={() => this.viewResumeDetail(val)}>{val.resume.base_person_name}</a>
              </div>
            );
          }
          return (
            <div className="ListForm_Narrow">
              {val.resume && val.resume.base_person_sex == 1 ? (
                <img src="../../images/male.png" />
              ) : null}
              {val.resume && val.resume.base_person_sex == 2 ? (
                <img src="../../images/famale.png" />
              ) : null}

              <a onClick={() => this.viewResumeDetail(val)}>
                {val.resume && val.isShow == 0 ? val.resume.base_person_name : '***'}
              </a>
            </div>
          );
        },
        width: 160,
        // fixed: 'left',
      },

      {
        title: '在职公司',
        align: 'center',
        render(val) {
          if (Array.isArray(val.resume && val.resume.experience)) {
            if (val.resume.experience.length > 0) {
              var company = val.resume.experience[0].company;
              return <span>{company}</span>;
            }
          }
          return <span>-</span>;
        },
        width: 240,
      },
      {
        title: '行业',
        align: 'center',
        render(val) {
          try {
            const val_object = val.resume && val.resume.base_person_industry;
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
        width: 260,
      },
      {
        title: '职位',
        align: 'center',
        render(val) {
          let arr = [];
          if (val && val.resume && val.resume.experience && val.resume.experience.length) {
            for (var i = 0; i < val.resume.experience.length; i++) {
              if (
                val.resume.experience[i] &&
                val.resume.experience[i].position &&
                val.resume.experience[i].position.replace(/[\u0391-\uFFE5]/g, 'aa').length >= 10
              ) {
                const name = val.resume.experience[i].position;
                var str = `... `;
                str += `${name.substring(name.length - 8)}`;
                arr.push(str);
              } else if (val.resume.experience[i] && val.resume.experience[i].position !== null) {
                arr.push(val.resume.experience[i].position);
              }
            }
          }
          try {
            const val_object = arr;
            const c =
              val_object && val_object.length > 0 && Array.isArray(val_object)
                ? val_object.map(v => {
                    // const arr =v.split(',');
                    // const str =arr[arr.length -2];

                    return <span className={styles.labelYel}>{v}</span>;
                  })
                : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          } catch {
            return <div className={styles.wordBreak}>-</div>;
          }
        },
        width: 240,
      },
      {
        title: '城市',
        align: 'center',
        render(val) {
          try {
            const val_object = val.resume && val.resume.base_person_city_now;
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
        width: 240,
      },
      {
        title: '年薪',
        render(val) {
          if (
            (val.resume && val.resume.base_person_salary == '') ||
            (val.resume && val.resume.base_person_salary == null)
          ) {
            return <span>-</span>;
          }
          return <span>{val.resume.base_person_salary}</span>;
        },
        width: 100,
      },
      {
        title: '年龄',
        align: 'center',
        render(val) {
          if (!val.resume) {
            return null;
          }
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
      // {
      //   title: '创建时间',
      //   dataIndex: 'created_at',
      //   align: 'center',
      //   render: val => {
      //     if (val) {
      //       return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
      //     } else {
      //       return <span>-</span>;
      //     }
      //   },
      //   width: 180,
      // },
      {
        title: '最后更新',
        dataIndex: 'updated_at',
        align: 'center',
        render: val => {
          if (val) {
            return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
          } else {
            return <span>-</span>;
          }
        },
        width: 180,
      },
      {
        title: '状态',
        align: 'center',
        render: val => {
          if (val != null && val != undefined) {
            return (
              <ProjectResumeStatusDropDown
                projectResume={val}
                isChange
                selectStatus={this.handleResetProjectResumeStatus}
              />
            );
          }
          return <Fragment />;
        },
        width: 120,
      },
    ];

    const columnsProcessRemark = [
      {
        title: 'ID',
        // dataIndex: 'id',
        render(val) {
          return <span>{val.id}</span>;
        },
        width: 60,
        align: 'center',
        // fixed: 'left',
      },
      {
        title: '姓名',
        align: 'center',
        render: val => {
          if (
            val.resume &&
            (val.resume.base_person_sex == '' || val.resume.base_person_sex == null)
          ) {
            return (
              <div className={styles.ListForm_Narrow}>
                <a onClick={() => this.viewResumeDetail(val)}>{val.resume.base_person_name}</a>
              </div>
            );
          }
          return (
            <div className="ListForm_Narrow">
              {val.resume && val.resume.base_person_sex == 1 ? (
                <img src="../../images/male.png" />
              ) : null}
              {val.resume && val.resume.base_person_sex == 2 ? (
                <img src="../../images/famale.png" />
              ) : null}

              <a onClick={() => this.viewResumeDetail(val)}>
                {val.resume && val.isShow == 0 ? val.resume.base_person_name : '***'}
              </a>
            </div>
          );
        },
        width: 160,
        // fixed: 'left',
      },
      {
        title: '备注',
        align: 'center',
        render: val => {
          if (val != null && val != undefined) {
            return (
              <Fragment>
                <SettingProjectResumeRemarkModel
                  resume={val}
                  projectid={this.props.match.params.id}
                  refreshFuc={this.refreshPage}
                />
              </Fragment>
            );
          }
          return <Fragment />;
        },
        width: 80,
      },
      {
        title: '流程状态',
        align: 'center',
        render(val) {
          var data = val.status_info && val.status_info.slice(0);
          return (
            <div style={{width:'900px',background:'transparent',display:'flex'}}>
              <ModlesProcess
                statusData={data}
                maxdate={maxdate}
                mindate={mindate}
                baseId={val.base_id}
                projectId={val.project_id}
                refreshFuc={that.refreshPage}
                delFuc={that.handleProcessDel}
              />
           </div>
          );
        },
        width: 1000,
      },
      {
        title: '推荐人',
        align: 'center',
        width: 60,
      },
    ];

    if(e && e.target && e.target.value && e.target.value === 'processRemark') {
      this.setState({
        columns: columnsProcessRemark,
      });
    } 
    else {
      this.setState({
        columns: columnsBaseInfo,
      });
    }
  }
  
  render() {
    const {
      resumelist: { projectResumeData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, smallvisible, switchtype } = this.state;
    const {
      dispatch,
      form: { getFieldDecorator },
    } = this.props;
 
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="" children={description}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <AddResumesButton />
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleDeleteProjectResume}>从此项目移除</Button>
                  <Button onClick={() => this.handleType(1)}>添加状态</Button>
                  <Button onClick={() => this.handleType(2)}>添加提醒</Button>
                </span>
              )}
              <RadioGroup onChange={this.switchTableStatus} defaultValue="baseInfo">
                <RadioButton value="baseInfo">摘要列表</RadioButton>
                <RadioButton value="processRemark">流程状态</RadioButton>
              </RadioGroup>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={projectResumeData}
              columns={this.state.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              expandedRowRender={record => <p style={{ margin: 0 }}>12313213123131231131</p>}
              defaultExpandAllRows={true}
              expandRowByClick
              expandIconAsCell={false}
              // expandedRowKeys={[]}
              // expandIconColumnIndex={-1}
              scroll={{ x: 1500, y: '100%' }}
            />
          </div>
        </Card>
        <Form layout="vertical">
          <Modal
            title={`添加：${switchtype == 1 ? '状态' : '提醒'}`}
            visible={smallvisible}
            onOk={this.handelModalok}
            onCancel={this.handelModalCancel}
          >
            {switchtype == 1 ? (
              <FormItem label="状态">
                {getFieldDecorator('status_id', {
                  rules: [{ required: switchtype == 1, message: '请选择流程状态' }],
                })(
                  <Select style={{ width: '100%' }}>
                    {processCon.map(item => {
                      return <option value={item.value}>{item.label}</option>;
                    })}
                  </Select>
                )}
              </FormItem>
            ) : null}
            {switchtype == 2 ? (
              <FormItem label="提醒">
                {getFieldDecorator('call', {
                  rules: [{ required: switchtype == 2, message: '请选择是否提醒' }],
                })(<Input type="textarea" />)}
              </FormItem>
            ) : null}
            <FormItem label="时间">
              {getFieldDecorator('date', {
                rules: [{ required: true, message: '请选择时间' }],
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
            </FormItem>
          </Modal>
        </Form>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
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
            projectInfo={projectInfo}
            refreshFuc={tableList_refreshFuc}
          />
        </Drawer>
      </div>
    );
  }
}
