import PropTypes from 'prop-types';
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
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './ProjectResumeTableList.less';
import { retry } from 'rxjs/operator/retry';
import SearchForm from '../ResumeLibrary/Components/SearchForm'

var thispagination = {};

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ resumelist, user, rule, loading }) => ({
  resumelist,
  user,
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class ProjectAddResumeDrawerList extends PureComponent {

  static contextTypes = {
    projectInfo: PropTypes.object,
    refreshFuc: PropTypes.func,
  };

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

  handleSearch = (values) => {
    var that = this;
    this.setState({ formValues: values }, () => {
      that.handleStandardTableChange(thispagination, {}, {});
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
      desc: 2,
      proid: this.props.projectInfo.projectId,
    };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    dispatch({
      type: 'resumelist/AddProjectResumeList',
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

  viewResumeDetail = (data) => {
    if(data.isShow == 0){
      this.props.dispatch(routerRedux.push(`/resumetablelist/pooldetails/detail/${data.id}/5?data=${JSON.stringify(this.props.projectInfo)}`));
    }else{
      this.props.dispatch(routerRedux.push(`/resumetablelist/pooldetails/view/${data.id}`));
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

  }


  importResumeToProject = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    var that = this;

    var baseid = [];
    if (Array.isArray(selectedRows)) {
      for (let i = 0; i < selectedRows.length; i++) {
        baseid.push(selectedRows[i].id);
      }
    }
    dispatch({
      type: 'resumelist/importResumeToProject',
      payload: {
        proid: this.props.projectInfo.projectId,
        baseid: baseid,
      },
      callback: () => {
        that.setState({
          selectedRows: [],
        });
        that.props.refreshFuc();
        that.handleStandardTableChange(thispagination, {}, {});
      },
    });
  };



  render() {
    const {
      resumelist: { AddProjectResumeList },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 60,
      },
      {
        title: '姓名',
        render: (val) => {
          // if (val.base_person_sex == '' || val.base_person_sex == null) {
          //   return <div className={styles.ListForm_Narrow}><a onClick={() => this.viewResumeDetail(val.id)}>{val.base_person_name}</a></div>;
          // }
          return <div className="ListForm_Narrow">
            {
              val.base_person_sex == 1 ? <img src='../../images/male.png' /> : null
            }
            {
              val.base_person_sex == 2 ? <img src='../../images/famale.png' /> : null
            }
            <a onClick={() => this.viewResumeDetail(val)}> {val.isShow == 0 ?val.base_person_name:'***'}</a></div>
        },
        width: 120,
      },

      {
        title: '公司',
        dataIndex: 'experience',
        render(val) {
          if (Array.isArray(val)) {
            if (val.length > 0) {
              var company = val[0].company;
              return <span>{company}</span>;
            }
          }
          return <span>-</span>;
        },
        width: 120,
      },
      {
        title: '行业',
        dataIndex: 'base_person_industry',
        render(val) {
          try {
            const val_object = JSON.parse(val);
            const c = val_object && val_object.length > 0 && Array.isArray(val_object) ? val_object.map(v => <span key={v.value} className={styles.labelYel}>{v.label}</span>) : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          }
          catch {
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
              if(val.experience[i] && val.experience[i].position && val.experience[i].position.replace(/[\u0391-\uFFE5]/g,"aa").length >= 10){
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
        dataIndex: 'base_person_city_now',
        render(val) {
          try {
            const val_object = JSON.parse(val);
            const c = val_object && val_object.length > 0 && Array.isArray(val_object) ? val_object.map(v => <span key={v.value} className={styles.labelYel}>{v.label}</span>) : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          }
          catch {
            return <div className={styles.wordBreak}>-</div>;
          }

        },
        width: 120,
      },
      {
        title: '年薪',
        dataIndex: 'base_person_salary',
        render(val) {
          if (val == '' || val == null) {
            return <span>-</span>;
          }
          return <span>{val}</span>;
        },
        width: 60,
      },
      {
        title: '年龄',
        dataIndex: 'base_person_age',
        render(val) {
          var datenow = new Date();
          var year = moment(datenow).format('YYYY');
          var age = year - val;
          if (val == '' || val == null) {
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
        title: '上传者',
        dataIndex: 'updatedUser',
        render: val => {
          if (val != null) {
            return <span>{val.user_name}</span>;
          }
        },
        width: 80,
      },
    ];
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm searchFuc={this.handleSearch} />
            <div className={styles.tableListOperator}>


              {selectedRows.length > 0 && (
                <span>
                  <Button icon="plus" type="primary" onClick={() => this.importResumeToProject()}>
                    导入
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={AddProjectResumeList}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1216, y: '100%' }}
                
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
