import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import router from 'umi/router';
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
import StandardTable from '@/components/StandardTable';
import ProjectStatusDropDown from './Components/ProjectStatusDropDown';
import styles from './ResumeTableList.less';
import SearchForm from './Components/SearchForm';
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

@connect(({ resumelist, rule, loading }) => ({
  resumelist,
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
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.handleStandardTableChange(thispagination, {}, {});
  }

  handleSearch = values => {
    var that = this;
    var myDate = new Date();
    if(values.ageMax){
      values.ageMax=`${myDate.getFullYear() - values.ageMax}`;
    }
    if(values.ageMin){
      values.ageMin=`${myDate.getFullYear() - values.ageMin}`;
    }
    
    this.setState({formValues:values},()=> {
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
    // TODO:
    dispatch({
      type: 'resumelist/checkresume',
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
    const data =id;
    if(data.isShow == 0){
      router.push(`/resumes/${data.id}/edit`)
    }else{
      router.push(`/resumes/${data.id}`)
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

  render() {
    const {
      resumelist: { data },
      loading
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        width: 100,
      },
      {
        title: '姓名',
        align: 'center',
        render: val => {
          return (
            <div className="ListForm_Narrow">
              {
                val.base_person_sex == 1 ?<img src='../images/male.png'/> :null
              }
               {
                val.base_person_sex == 2 ?<img src='../images/famale.png'/> :null
              }
              <a onClick={() => this.viewResumeDetail(val)}> {val.isShow == 0 ?val.base_person_name:'***'}</a>
            </div>
          );
        },
        width: 160,
      },

      {
        title: '公司',
        dataIndex: 'experience',
        align: 'center',
        render(val) {
          if (Array.isArray(val)) {
            if (val.length > 0) {
              var company = val[0].company;
              return <span>{company}</span>;
            }
          }
          return <span>-</span>;
        },
        width: 200,
      },
      {
        title: '行业',
        dataIndex: 'base_person_industry',
        align: 'center',
        render(val) {
          try {
            const val_object = val;
            const c = val_object && val_object.length > 0 && Array.isArray(val_object) ? val_object.map((v, i) => <span key={`${v.value}${i}`} className={styles.labelYel}>{v.label}</span>) : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          } catch (e){
            return <div className={styles.wordBreak}>-</div>;
          }
        },
        width: 200,
      },
      {
        title: '职位',
        align: 'center',
        render(val) {
          var arr =[];
          if (val && val.experience && Array.isArray(val.experience)) {
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
            val_object.map((v, i)=>{
              // const arr =v.split(',');
              // const str =arr[arr.length -2];
             
             return (
              <span key={`${arr[arr.length -1]}${i}`} className={styles.labelYel}>{v}</span>
             )
            }) : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          } catch (e){
            return <div className={styles.wordBreak}>-</div>;
          }
        },
        width: 240,
      },
      {
        title: '城市',
        dataIndex: 'base_person_city_now',
        align: 'center',
        render(val) {
          try {
            const val_object = val;
            const c = val_object && val_object.label  ? 
           <span key={val_object.value} className={styles.labelYel}>{val_object.label}</span> : '-';
            return <div className={styles.wordBreak}>{c}</div>;
          } catch (e){
            return <div className={styles.wordBreak}>-</div>;
          }
        },
        width: 140,
      },
      {
        title: '年薪',
        dataIndex: 'base_person_salary',
        align: 'center',
        render(val) {
          if (val == '' || val == null) {
            return <span>-</span>;
          }
          return <span>{val}</span>;
        },
        width: 100,
      },
      {
        title: '年龄',
        dataIndex: 'base_person_age',
        align: 'center',
        render(val) {
          var datenow = new Date();
          var year = moment(datenow).format('YYYY');
          var age = year - val;
          if (val == '' || val == null) {
            return <span>-</span>;
          }
          return <span>{age}</span>;
        },
        width: 100,
      },
      {
        title: '入库时间',
        dataIndex: 'created_at',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
      },
      {
        title: '所在项目',
        align: 'center',
        render(val) {
          return <span>{val && val.project_info&&val.project_info.project_info?val.project_info.project_info.name:null}</span>
        },
        width: 140,
      },
      {
        title: '状态',
        align: 'center',
        render(val) {
          let status = val&&val.project_info?val.project_info.project_resume_status:null;
          return <ProjectStatusDropDown project={status} />;
         
        },
        width: 100,
      },
      {
        title: '上传者',
        dataIndex: 'updated_user',
        align: 'center',
        render: val => {
          if (val != null) {
            return <span>{val.user_name}</span>;
          }
        },
        width: 100,
      },
      {
        title: '操作',
        align: 'center',
        width: 80,
        render: val => {
          var deleteable = false;
     
          if (getAuthority() == 'admin' || (getUserInfo().id == val && val.updated_user && val.updated_user.id)) {
            deleteable = true
          }else{
            return null;
          }
       
          return (
            <div>
              {deleteable && (
                <Fragment>
                  <a onClick={() => this.handleDeleteResume(val)}>删除</a>
                </Fragment>
              )}
            </div>
          );
        },
      },
    ];

    return <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm searchFuc={this.handleSearch} />
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => {
                  this.props.dispatch(routerRedux.push(`/resumelibrary/pooldetails/new/3`));
                }}>
                新建简历
              </Button>
              <Button icon="plus" type="primary" onClick={() => {
              this.props.dispatch(routerRedux.push(`/resumelibrary/copyup`));
                }}>
                复制上传
              </Button>
            </div>
            <StandardTable selectedRows={selectedRows} loading={loading} data={data} columns={columns} onSelectRow={this.handleSelectRows} rowSelectionDisable onChange={this.handleStandardTableChange} scroll={{ x: 2000, y: '100%' }} />
          </div>
        </Card>
      </PageHeaderWrapper>;
  }
}
