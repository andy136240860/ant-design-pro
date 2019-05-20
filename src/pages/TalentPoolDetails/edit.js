/*eslint no-prototype-builtins: "error"*/
/*eslint object-shorthand: "error"*/
/*eslint-env es6*/
/* eslint lines-between-class-members: ["error", "always"]*/
import React, { PureComponent, Fragment } from 'react';
import {
  TreeSelect,
  Form,
  Input,
  Button,
  Card,
  List,
  Upload,
  Icon,
  Row,
  Col,
  DatePicker,
  message,
  Drawer,
  Checkbox,
  Affix,
  Avatar,
  InputNumber,
  Popconfirm,
  Collapse,
  Anchor,
} from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';

// 个人基本信息一些配置
import {
  routerMap,
  fieldLabels,
  industryData,
  countryOptions,
  errorStateOptions,
  heighteducationOptions,
  workChangeData,
  sexData,
  uploadProps,
  crtTimeFtt,
  rroptions,
  GetQueryString,
  initaialListData,
  reListData,
  initaialEduData,
  reEduData,
  initaialProData,
  reProData,
  initaialTraData,
  reTraData,
  formItemLayout,
  drawerOptions,
  reCityNow,
  reCityHope,
  checkRequired,
} from '../../utils/info';

import { geocity } from '../../utils/city';
import { jonInfo } from '../../utils/jonInfo';
import { ConcurrentRequest } from '../../utils/ConcurrentRequest';
import { handleCheckMail, handleCheckNum } from '../../utils/validation-message';
import Iframe from './components/iframe/index';
import SelectItem from './components/selectItem/index';

import styles from './style.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;
const { Panel } = Collapse;
const { Link } = Anchor;

@connect(({ rule, resumedetail, user, loading }) => ({
  resumedetail,
  user,
  // loading: loading.models.resumedetail,
}))
@Form.create()
export default class Detail extends PureComponent {
  initialRemark = '';

  resumeData = [];
  state = {
    list: [
      {
        describe: '',
        company: '',
        endtime: '',
        position: '',
        starttime: '',
      },
    ],
    eduData: [
      {
        describe: '',
        education: '',
        endtime: '',
        major: '',
        school: '',
        starttime: '',
      },
    ],
    proData: [],
    trainData: [],
    attachData: [],
    resumeData: [],
    visible: false,
    switchView: false,
    drawerData: {
      isopenphone: 2,
      isopenwchat: 2,
      isopenname: 2,
      remark: '',
    },
    inspect_age: 0,
    inspect_city_hope: 0,
    inspect_city_now: 0,
    inspect_country: 0,
    inspect_education: 0,
    inspect_educations: 0,
    inspect_email: 0,
    inspect_experience: 0,
    inspect_height_education: 0,
    inspect_industry: 0,
    inspect_job_state: 0,
    inspect_linkedin: 0,
    inspect_name: 0,
    inspect_personal: 0,
    inspect_phone: 0,
    inspect_position: 0,
    inspect_project: 0,
    inspect_rr: 0,
    inspect_salary: 0,
    inspect_salarypm: 0,
    inspect_sex: 0,
    inspect_wchat: 0,
    inspect_work_time: 0,
  };

  componentWillMount() {}

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    if (params.id) {
      this.fetchInfo(params.id);
    }
    this.setState({
      switchPageInfo: routerMap({ ...params }),
    });
    // 判断typeId取到前一页传来的data 信息（项目信息，简历信息）
    if (params.typeId == 5 && GetQueryString('data')) {
      let projectInfo = JSON.parse(GetQueryString('data'));
      this.setState({
        projectInfo,
      });
    } else if (params.typeId == 2 || params.typeId == 4) {
      if (GetQueryString('data')) {
        var data = JSON.parse(GetQueryString('data'));
        if (data && data.filePath) {
          var resumeData = [];
          data.state = 1;
          resumeData.push(data);
          this.setState({
            ...this.state,
            resumeData,
          });
          this.resumeData = resumeData;
          this.preParseResume();
        }
      }
    }
  }

  fetchInfo = id => {
    const { dispatch } = this.props;
    const that = this;
    ConcurrentRequest(
      dispatch,
      [
        { type: 'resumedetail/getDetail', payload: id },
        { type: 'resumedetail/getEvaluate', payload: { base_id: id } },
      ],
      that.fetchInfoCallback,
      that
    );
  };

  fetchInfoCallback = (responses, that) => {
    const {
      form: { setFieldsValue },
    } = that.props;
    if (responses[0] && responses[0].status === 0) {
      let renderData = responses[0].data;
      var myDate = new Date();
      let values = {
        base_person_name: renderData.base_person_name || '',
        base_person_phone: renderData.base_person_phone || '',
        sex: renderData.base_person_sex > 0 ? renderData.base_person_sex.toString() : '',
        wchat: renderData.base_person_wchat || '',
        email: renderData.base_person_email || '',
        rr: renderData.base_person_rr || '',
        worktime: renderData.base_person_work_time
          ? `${myDate.getFullYear() - renderData.base_person_work_time}`
          : '',
        age: renderData.base_person_age
          ? `${myDate.getFullYear() - renderData.base_person_age}`
          : '',

        jobstate: renderData.base_person_job_state || '',
        linkedin: renderData.base_person_linkedin || '',
        personal: renderData.base_person_personal || '',
        citynow: renderData.base_person_city_now ? renderData.base_person_city_now : [],
        industry: renderData.base_person_industry ? renderData.base_person_industry : [],
        position: renderData.base_person_position ? renderData.base_person_position : [],
        cityhope: renderData.base_person_city_hope ? renderData.base_person_city_hope : [],
        heighteducation: renderData.base_person_height_education || '',
        country: renderData.base_person_country || '中国',
        education: renderData.base_person_education || '',
        salarypm: renderData.base_person_salarypm || '',
        salary: renderData.base_person_salary || '',
      };
      console.log(renderData);

      const list = renderData.experience ? initaialListData(renderData.experience) : [];
      const eduData = renderData.education ? initaialEduData(renderData.education) : [];
      const proData = renderData.project ? initaialProData(renderData.project) : [];
      const trainData = renderData.train ? initaialTraData(renderData.train) : [];
      const attachData = renderData.attach || [];
      const resumeData = renderData.resume || [];

      that.setState({
        list,
        eduData,
        proData,
        trainData,
        attachData,
        resumeData,
        inspect_age: renderData.inspect_age || 0,
        inspect_city_hope: renderData.inspect_city_hope || 0,
        inspect_city_now: renderData.inspect_city_now || 0,
        inspect_country: renderData.inspect_country || 0,
        inspect_education: renderData.inspect_education || 0,
        inspect_educations: renderData.inspect_educations || 0,
        inspect_email: renderData.inspect_email || 0,
        inspect_experience: renderData.inspect_experience || 0,
        inspect_height_education: renderData.inspect_height_education || 0,
        inspect_industry: renderData.inspect_industry || 0,
        inspect_job_state: renderData.inspect_job_state || 0,
        inspect_linkedin: renderData.inspect_linkedin || 0,
        inspect_name: renderData.inspect_name || 0,
        inspect_personal: renderData.inspect_personal || 0,
        inspect_phone: renderData.inspect_phone || 0,
        inspect_position: renderData.inspect_position || 0,
        inspect_project: renderData.inspect_project || 0,
        inspect_rr: renderData.inspect_rr || 0,
        inspect_salary: renderData.inspect_salary || 0,
        inspect_salarypm: renderData.inspect_salarypm || 0,
        inspect_sex: renderData.inspect_sex || 0,
        inspect_wchat: renderData.inspect_wchat || 0,
        inspect_work_time: renderData.inspect_work_time || 0,
      });
      setFieldsValue(values);
    } else {
      message.error(`${responses[0].status}:${responses[0].msg}`);
    }
    if (responses[1] && responses[1].status === 0) {
      if (responses[1].data) {
        const data = responses[1].data;
        if (data.user && data.user.eval && data.user.eval.length > 0) {
          that.setState({
            ...that.state,
            remark: data.user.eval[0].eval,
            drawerData: {
              ...that.state.drawerData,
              remark: data.user.eval[0].eval,
            },
          });
          // 初始评论，后期判断是否改变
          that.initialRemark = data.user.eval[0].eval;
        }
        if (data.other && data.other.eval && data.other.eval.length > 0) {
          let otherRemark = [];
          otherRemark = data.other.eval.slice(0);
          that.setState({
            ...that.state,
            otherRemark,
          });
        }
      }
    } else {
      message.error(`${responses[1].status}:${responses[1].msg}`);
    }
  };

  // 提交
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      btnSwitch: e.target.getAttribute('clickName'),
    });
    const { list, proData, trainData, eduData, resumeData, attachData, remark } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      var myDate = new Date();
      myDate.getFullYear();
      if (!err) {
        let data = {
          ...values,
          inspect_age: this.state.inspect_age,
          inspect_city_hope: this.state.inspect_city_hope,
          inspect_city_now: this.state.inspect_city_now,
          inspect_country: this.state.inspect_country,
          inspect_education: this.state.inspect_education,
          inspect_educations: this.state.inspect_educations,
          inspect_email: this.state.inspect_email,
          inspect_experience: this.state.inspect_experience,
          inspect_height_education: this.state.inspect_height_education,
          inspect_industry: this.state.inspect_industry,
          inspect_job_state: this.state.inspect_job_state,
          inspect_linkedin: this.state.inspect_linkedin,
          inspect_name: this.state.inspect_name,
          inspect_personal: this.state.inspect_personal,
          inspect_phone: this.state.inspect_phone,
          inspect_position: this.state.inspect_position,
          inspect_project: this.state.inspect_project,
          inspect_rr: this.state.inspect_rr,
          inspect_salary: this.state.inspect_salary,
          inspect_salarypm: this.state.inspect_salarypm,
          inspect_sex: this.state.inspect_sex,
          inspect_wchat: this.state.inspect_wchat,
          inspect_work_time: this.state.inspect_work_time,
        };
        for (var attr in values) {
          if (attr == 'age' && values[attr]) {
            data.age = `${myDate.getFullYear() - values[attr]}`;
          }

          if (attr == 'worktime' && values[attr]) {
            data.worktime = `${myDate.getFullYear() - values[attr]}`;
          }
        }
        if (list.length >= 1) {
          data.exp = list;
        }
        if (trainData.length >= 1) {
          data.train = trainData;
        }
        if (proData.length >= 1) {
          data.pro = proData;
        }
        if (resumeData.length >= 1) {
          data.resume = resumeData;
        }
        if (attachData.length >= 1) {
          data.attach = attachData;
        }
        if (eduData.length >= 1) {
          data.edu = eduData;
        }
        console.log(data);
        this.handleSubmitFetch(data);
      }
    });
  };

  callback=(responses, that) =>{
    const { switchPageInfo, detailId } = that.state;
    const { dispatch } = that.props;
    message.success('保存成功');

    if (switchPageInfo && switchPageInfo.isNew) {
      dispatch(
        routerRedux.replace(
          `/resumetablelist/pooldetails/detail/${detailId}/${switchPageInfo.type}`
        )
      );
    } else if (switchPageInfo && !switchPageInfo.isNew && that.state.btnSwitch === 'show') {
      if (responses[responses.length - 1].status === 0) {
        const data = responses[responses.length - 1].data;

        that.setState({
          visible: true,
          reportBackUrl: data.url,
          reportCode: data.resume_code,
        });
      } else {
        message.error(
          `${responses[responses.length - 1].status}:${responses[responses.length - 1].msg}`
        );
      }
    }
  }

  handleSubmitFetch = data => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { remark, switchPageInfo, drawerData, projectInfo, resumeData } = this.state;
    const { id: detailId } = params;
    console.log(params);
    const that = this;

    if (detailId) {
      let newArray = [];
      dispatch({
        type: 'resumedetail/updateResume',
        payload: { ...data, resumeid: detailId },
        callback: function(response) {
          if (response.status == 0) {
            const detailId = response.data.id;
            that.setState({ detailId });
            if (that.initialRemark != remark) {
              newArray.push({
                type: 'resumedetail/postEvaluate',
                payload: { base_id: detailId, eval: remark || '' },
              });
            }
            if (switchPageInfo.type == 5 && projectInfo && projectInfo.projectId) {
              let baseId = [];
              baseId.push(detailId);
              newArray.push({
                type: 'resumedetail/getProtobase',
                payload: { baseid: baseId, proid: projectInfo.projectId },
              });
            }
            if (params.typeId == 2 || params.typeId == 4) {
              newArray.push({
                type: 'resumedetail/getAmend',
                payload: { state: 1, resumeid: resumeData[0].id },
              });
            }
            if (that.state.requiredTurn && that.state.requiredTurn.pass) {
              {
                projectInfo && projectInfo.projectId
                  ? newArray.push({
                      type: 'resumedetail/postReport',
                      payload: {
                        baseid: detailId,
                        eval: drawerData.remark,
                        ...drawerData,
                        proid: projectInfo.projectId,
                      },
                    })
                  : newArray.push({
                      type: 'resumedetail/postReport',
                      payload: { baseid: detailId, eval: drawerData.remark, ...drawerData },
                    });
              }
            }
            if (newArray.length == 0) {
              message.success('保存成功');

              dispatch(
                routerRedux.replace(
                  `/resumetablelist/pooldetails/detail/${response.data.id}/${switchPageInfo.type}`
                )
              );
            } else {
              ConcurrentRequest(dispatch, newArray, that.callback, that);
            }
          } else {
            message.error(`${response.status}:${response.msg}`);
          }
        },
      });
    } else {
      let newArray = [];
      dispatch({
        type: 'resumedetail/save',
        payload: data,
        callback: function(response) {
          if (response.status == 0) {
            const detailId = response.data.id;
            that.setState({ detailId });
            if (that.initialRemark != remark) {
              newArray.push({
                type: 'resumedetail/postEvaluate',
                payload: { base_id: detailId, eval: remark || '' },
              });
            }

            if (params.typeId == 2 || params.typeId == 4) {
              newArray.push({
                type: 'resumedetail/getAmend',
                payload: { state: 1, resumeid: resumeData[0].id },
              });
            }
            if (switchPageInfo.type == 5 && projectInfo && projectInfo.projectId) {
              let baseId = [];
              baseId.push(detailId);
              newArray.push({
                type: 'resumedetail/getProtobase',
                payload: { baseid: baseId, proid: projectInfo.projectId },
              });
            }
            console.log(newArray);
            if (newArray.length == 0) {
              message.success('保存成功');

              dispatch(
                routerRedux.replace(
                  `/resumetablelist/pooldetails/detail/${response.data.id}/${switchPageInfo.type}`
                )
              );
            } else {
              ConcurrentRequest(dispatch, newArray, that.callback, that);
            }
          } else {
            message.error(`${response.status}:${response.msg}`);
          }
        },
      });
    }
  };

  showDrawer = e => {
    console.log(e.target.getAttribute('clickName'));
    const data = this.props.form.getFieldsValue();
    const { list, eduData } = this.state;
    const newData = {
      ...data,
      experience: list,
      education: eduData,
    };
    console.log(data);
    this.props.form.validateFields((err, values) => {
      console.log(err);
      console.log(values);
    });
    const requiredTurn = checkRequired(newData);
    this.setState({
      requiredTurn,
      btnSwitch: e.target.getAttribute('clickName'),
    });
    if (requiredTurn && requiredTurn.pass) {
      this.handleSubmit(e);
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onDrawerChange = checkedValues => {
    let remark = this.state.remark;
    let newData = {
      isopenphone: 2,
      isopenwchat: 2,
      isopenname: 2,
    };
    if (checkedValues.indexOf('隐藏姓名') < 0) {
      newData.isopenname = 1;
    }
    if (checkedValues.indexOf('隐藏手机号') < 0) {
      newData.isopenphone = 1;
    }
    if (checkedValues.indexOf('隐藏微信号') < 0) {
      newData.isopenwchat = 1;
    }

    this.setState({
      ...this.state,
      drawerData: {
        ...newData,
        remark,
      },
    });
  };

  renderDrawer = () => {
    return (
      <Drawer
        title="预览报告"
        width={1000}
        closable={true}
        maskClosable={true}
        style={{ height: 'calc(100% - 55px)', padding: '0' }}
        visible={this.state.visible}
        onClose={this.onClose}
      >
        <div style={{ display: 'flex' }}>
          <Search
            enterButton="点击复制"
            size="large"
            id="inputText"
            value={`${this.state.reportCode}`}
            onSearch={value => {
              let input = document.getElementById('inputText');
              input.select(); // 选中文本
              document.execCommand('copy'); // 执行浏览器复制命令
              input.blur();
            }}
          />
          <Search
            enterButton="点击下载"
            size="large"
            id="inputText"
            value={`${this.state.reportBackUrl}`}
            onSearch={value => {
              window.open(`${this.state.reportBackUrl}`);
            }}
          />
        </div>

        {this.state.reportBackUrl ? <Iframe src={`${this.state.reportBackUrl}`} /> : null}
      </Drawer>
    );
  };

  checkData() {
    const { list, eduData } = this.state;

    if (!list.length && !eduData.length) {
      return false;
    } else {
      for (var i = 0; i < list.length; i++) {
        for (var attr in list[i]) {
          if (attr == 'company' && list[i][attr] == '') {
            return false;
          }
          if (attr == 'describe' && list[i][attr] == '') {
            return false;
          }
          if (attr == 'position' && list[i][attr] == '') {
            return false;
          }
        }
      }
      for (var i = 0; i < eduData.length; i++) {
        for (var attr in list[i]) {
          if (attr == 'major' && list[i][attr] == '') {
            return false;
          }
          if (attr == 'school' && list[i][attr] == '') {
            return false;
          }
          if (attr == 'education' && list[i][attr] == '') {
            return false;
          }
        }
      }
      return true;
    }
  }

  renderAffix = () => {
    const { switchPageInfo, projectInfo } = this.state;
    let labelTitle = '';
    if (switchPageInfo && switchPageInfo.type && switchPageInfo.type != 5) {
      labelTitle = switchPageInfo.subTitle;
    } else if (switchPageInfo && switchPageInfo.type == 5 && projectInfo) {
      labelTitle =
        switchPageInfo.subTitle +
        `${projectInfo && projectInfo.projectName ? projectInfo.projectName : null}`;
    }
    let authority = JSON.parse(`${localStorage.authority}`);
    if (!authority) {
      return null;
    }
    const auth = authority.auth;
    return (
      <Affix offsetTop={0} style={{ background: '#fff', paddingTop: '20px' }}>
        <Row justify="end" gutter="{md:24}">
          <Col
            xxl={{ span: 20 }}
            xl={{ span: 19 }}
            lg={{ span: 18 }}
            md={{ span: 18 }}
            sm={{ span: 16 }}
            xs={{ span: 24 }}
            style={{ background: '#fff' }}
          >
            <div className={styles.drawderCheckbox}>
              <CheckboxGroup
                options={drawerOptions}
                defaultValue={['隐藏姓名', '隐藏手机号', '隐藏微信号']}
                onChange={this.onDrawerChange}
              />
            </div>
          </Col>
          <Col
            xxl={{ span: 4, push: 0 }}
            xl={{ span: 5, push: 0 }}
            lg={{ span: 6, push: 0 }}
            md={{ span: 5, push: 0 }}
            sm={{ span: 8, push: 0 }}
            xs={{ span: 24, push: 13 }}
          >
            <div style={{ background: '#fff' }}>
              <Button
                type="primary"
                clickName="show"
                onClick={this.showDrawer}
                style={{ marginRight: 20 }}
                disabled={switchPageInfo && switchPageInfo.isNew}
              >
                生成报告
              </Button>
              <Button type="primary" clickName="save" onClick={this.handleSubmit}>
                保存
              </Button>
            </div>
          </Col>
        </Row>
        <Row style={{ background: '#fff' }}>
          <Col xs={{ span: 23 }}>
            <div
              style={{
                color: '#faad14',
                fontSize: '14px',
                textAlign: 'right',
                paddingTop: '20px',
                paddingBottom: '20px',
              }}
            >
              {this.state.requiredTurn && !this.state.requiredTurn.pass
                ? this.state.requiredTurn.string
                : null}
            </div>
          </Col>
        </Row>
      </Affix>
    );
  };

  renderRightView = () => {
    return (
      <div>
        {this.state.switchView ? (
          <Affix offsetTop={80} style={{ paddingTop: '20px' }}>
            <div style={{ background: '#fff', width: '100%', height: '100%' }}>
              <div onClick={this.turnViewResume}>
                <Icon type="close" theme="outlined" />
                点击关闭预览
              </div>
            </div>
            {this.renderRightResume()}
          </Affix>
        ) : (
          this.renderRightOne()
        )}
      </div>
    );
  };
  render() {
    const { switchPageInfo, projectInfo } = this.state;
    let labelTitle = '';
    if (switchPageInfo && switchPageInfo.type && switchPageInfo.type != 5) {
      labelTitle = switchPageInfo.subTitle;
    } else if (switchPageInfo && switchPageInfo.type == 5 && projectInfo) {
      labelTitle =
        switchPageInfo.subTitle +
        `${projectInfo && projectInfo.projectName ? projectInfo.projectName : null}`;
    }
    let authority = JSON.parse(`${localStorage.authority}`);
    if (!authority) {
      return null;
    }
    const auth = authority.auth;

    return (
      // Industry
      <PageHeaderWrapper title={`${labelTitle}`}>
        <Form layout="vertical">
          {this.renderAffix()}
          {/**上传简历*/}
          {this.renderResume()}
          <Row gutter={16} align="top">
            <Col lg={14} md={14} sm={24}>
              {/**基本信息*/}
              {this.renderBasicInfo()}
              {/**工作经历*/}
              {this.renderWork()}
              {this.renderEdu()}
              {this.renderPro()}
            </Col>
            <Col lg={10} md={10} sm={24}>
              {this.renderRightView()}
            </Col>
          </Row>
          {/**上传附件*/}
          {this.renderAttach()}
        </Form>
        {this.renderDrawer()}
      </PageHeaderWrapper>
    );
  }

  turnViewResume = () => {
    this.setState({
      switchView: false,
    });
  };

  // TODO:
  renderRightOne() {
    const ListContent = ({ data }) => (
      <div className={styles.listContent}>
        <div className={styles.description}>{data.eval}</div>
        <div className={styles.extra}>
          <em>{moment(data.updatedAt).format('YYYY-MM-DD HH:mm')}</em>
        </div>
      </div>
    );

    return (
      <div>
        <Card title="评价" bordered={false} className={styles.card} style={{ marginTop: 0 }}>
          <TextArea
            className={styles.remark}
            value={this.state.remark || ''}
            onChange={this.onSaveRemark}
          />
          <div>
            <div className="demo-infinite-container">
              <List
                size="large"
                rowKey="id"
                itemLayout="vertical"
                dataSource={this.state.otherRemark}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      title={<a className={styles.listItemMetaTitle}>{item.user_info.realname}</a>}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
              {/* <List
                      dataSource={this.state.otherRemark}
                      renderItem={item => (
                        <List.Item key={item.id}>
                          <List.Item.Meta
                            avatar={
                              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={<a href="javascript:;">{item.user_info.realname}</a>}
                            description={item.eval}
                            key={item.user_info.id}
                          />
                          <div>{item.user_info.updated_at}</div>
                        </List.Item>
                      )}
                    /> */}
            </div>
          </div>
        </Card>
      </div>
    );
  }
  renderRightResume() {
    let height = window.screen.height;
    const { resumeData } = this.state;
    if (!resumeData.length) {
      return null;
    }

    return (
      <div style={{ height: `${height - 200}px` }}>
        <Iframe src={`${resumeData[0].filePath}`} />
      </div>
    );
  }
  setStateData = (num, name) => {
    const numa = num;
    const key = name;
    this.setState({
      [key]: numa,
    });
  };

  // p评论提交
  onSaveRemark = e => {
    this.setState({
      ...this.state,
      remark: e.target.value,
      drawerData: {
        ...this.state.drawerData,
        remark: e.target.value,
      },
    });
  };

  // 基本信息、评价
  renderBasicInfo() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
        getFieldError,
        isFieldValidating,
        getFieldProps,
        isFieldTouched,
        isFieldsTouched,
      },
    } = this.props;

    const emailError = getFieldValue('email');
    const countryError = getFieldValue('country');
    const heighteducationError = getFieldValue('heighteducation');
    const worktimeError = getFieldValue('worktime');
    const citynowError = getFieldValue('citynow') instanceof Array;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <Row gutter={16}>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>
                  <div className={styles.basicInfoFontRed}>*</div>
                  {fieldLabels.base_person_name}
                </lable>
                <SelectItem
                  data={this.state.inspect_name}
                  keyname="inspect_name"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('base_person_name', {
                rules: [{ required: true, message: '请输入姓名' }],
              })(<Input placeholder="请输入姓名" autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>
                  <div className={styles.basicInfoFontRed}>*</div>
                  {fieldLabels.base_person_phone}
                </lable>
                <SelectItem
                  data={this.state.inspect_phone}
                  keyname="inspect_phone"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('base_person_phone', {
                rules: [
                  { required: true, message: '请输入正确手机号', pattern: /^1[345678]\d{9}$/ },
                ],
              })(<Input placeholder="请输入手机号" autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.sex}</lable>
                <SelectItem
                  data={this.state.inspect_sex}
                  keyname="inspect_sex"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('sex')(
                <TreeSelect
                  treeData={sexData}
                  placeholder="Please select"
                  allowClear
                  treeNodeFilterProp="value"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.wechat}</lable>
                <SelectItem
                  data={this.state.inspect_wchat}
                  keyname="inspect_wchat"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('wchat')(<Input placeholder="请输入微信号" autoComplete="off" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.email}</lable>
                <SelectItem
                  data={this.state.inspect_email}
                  keyname="inspect_email"
                  refreshState={this.setStateData}
                />
              </div>

              <div
                className={
                  !emailError && this.state.requiredTurn && !this.state.requiredTurn.pass
                    ? styles.infoWarning
                    : ''
                }
              >
                {getFieldDecorator('email', {
                  rules: [{ validator: handleCheckMail }],
                })(<Input placeholder="请输入邮箱地址" autoComplete="off" />)}
              </div>
              {!emailError && this.state.requiredTurn && !this.state.requiredTurn.pass ? (
                <div className={styles.infoFonts}>不输入无法生成报告通过阿里认证</div>
              ) : (
                ''
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.country}</lable>
                <SelectItem
                  data={this.state.inspect_country}
                  keyname="inspect_country"
                  refreshState={this.setStateData}
                />
              </div>
              <div
                className={
                  !countryError && this.state.requiredTurn && !this.state.requiredTurn.pass
                    ? styles.infoWarning
                    : ''
                }
              >
                {getFieldDecorator('country')(
                  <TreeSelect
                    treeData={countryOptions}
                    placeholder="Please select"
                    allowClear
                    treeNodeFilterProp="value"
                  />
                )}
              </div>
              {!countryError && this.state.requiredTurn && !this.state.requiredTurn.pass ? (
                <div className={styles.infoFonts}>不输入无法生成报告通过阿里认证</div>
              ) : (
                ''
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.heighteducation}</lable>
                <SelectItem
                  data={this.state.inspect_height_education}
                  keyname="inspect_height_education"
                  refreshState={this.setStateData}
                />
              </div>
              <div
                className={
                  !heighteducationError && this.state.requiredTurn && !this.state.requiredTurn.pass
                    ? styles.infoWarning
                    : ''
                }
              >
                {getFieldDecorator('heighteducation')(
                  <TreeSelect
                    treeData={heighteducationOptions}
                    placeholder="Please select"
                    allowClear
                    treeNodeFilterProp="value"
                  />
                )}
              </div>
              {!heighteducationError && this.state.requiredTurn && !this.state.requiredTurn.pass ? (
                <div className={styles.infoFonts}>不输入无法生成报告通过阿里认证</div>
              ) : (
                ''
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.education}</lable>
                <SelectItem
                  data={this.state.inspect_education}
                  keyname="inspect_education"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('education', {
                rules: [{ required: false, message: '请输入学校名称' }],
              })(<Input placeholder="大学学校全称" autoComplete="off" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.rr}</lable>
                <SelectItem
                  data={this.state.inspect_rr}
                  keyname="inspect_rr"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('rr')(
                <TreeSelect
                  treeData={rroptions}
                  placeholder="Please select"
                  allowClear
                  treeNodeFilterProp="value"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.industry}</lable>
                <SelectItem
                  data={this.state.inspect_industry}
                  keyname="inspect_industry"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('industry')(
                <TreeSelect
                  treeData={industryData}
                  placeholder="Please select"
                  treeDefaultExpandAll
                  treeCheckable={true}
                  showSearch
                  allowClear
                  multiple
                  treeCheckStrictly
                />
              )}
            </Form.Item>
          </Col>

          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.position}</lable>
                <SelectItem
                  data={this.state.inspect_position}
                  keyname="inspect_position"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('position')(
                <TreeSelect
                  treeData={jonInfo}
                  placeholder="Please select"
                  treeCheckable={true}
                  showSearch
                  allowClear
                  multiple
                />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.citynow}</lable>
                <SelectItem
                  data={this.state.inspect_city_now}
                  keyname="inspect_city_now"
                  refreshState={this.setStateData}
                />
              </div>
              <div
                className={
                  citynowError && this.state.requiredTurn && !this.state.requiredTurn.pass
                    ? styles.infoWarning
                    : ''
                }
              >
                {getFieldDecorator('citynow')(
                  <TreeSelect
                    treeData={geocity}
                    placeholder="Please select"
                    showSearch
                    allowClear
                    treeNodeFilterProp="title"
                    labelInValue
                    showCheckedStrategy="SHOW_PARENT"
                  />
                )}
              </div>
              {citynowError && this.state.requiredTurn && !this.state.requiredTurn.pass ? (
                <div className={styles.infoFonts}>不输入无法生成报告通过阿里认证</div>
              ) : (
                ''
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.cityhope}</lable>
                <SelectItem
                  data={this.state.inspect_city_hope}
                  keyname="inspect_city_hope"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('cityhope')(
                <TreeSelect
                  treeData={geocity}
                  placeholder="Please select"
                  treeCheckable={true}
                  showSearch
                  allowClear
                  multiple
                  treeNodeFilterProp="title"
                  showCheckedStrategy="SHOW_PARENT"
                  labelInValue
                />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.age}</lable>
                <SelectItem
                  data={this.state.inspect_age}
                  keyname="inspect_age"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('age', {
                rules: [{ validator: handleCheckNum }],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入年龄"
                  autoComplete="off"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.worktime}</lable>
                <SelectItem
                  data={this.state.inspect_work_time}
                  keyname="inspect_work_time"
                  refreshState={this.setStateData}
                />
              </div>
              <div
                className={
                  !worktimeError && this.state.requiredTurn && !this.state.requiredTurn.pass
                    ? styles.infoWarning
                    : ''
                }
              >
                {getFieldDecorator('worktime', {
                  rules: [{ validator: handleCheckNum }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="请输入工作年限"
                    autoComplete="off"
                  />
                )}
              </div>
              {!worktimeError && this.state.requiredTurn && !this.state.requiredTurn.pass ? (
                <div className={styles.infoFonts}>不输入无法生成报告通过阿里认证</div>
              ) : (
                ''
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.salary}</lable>
                <SelectItem
                  data={this.state.inspect_salary}
                  keyname="inspect_salary"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('salary', {
                rules: [{ validator: handleCheckNum }],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入年薪（万）"
                  autoComplete="off"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.salarypm}</lable>
                <SelectItem
                  data={this.state.inspect_salarypm}
                  keyname="inspect_salarypm"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('salarypm')(
                <Input placeholder="请输入月薪（3W-4W）" autoComplete="off" />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.jobstate}</lable>
                <SelectItem
                  data={this.state.inspect_job_state}
                  keyname="inspect_job_state"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('jobstate')(
                <TreeSelect
                  treeData={workChangeData}
                  placeholder="Please select"
                  allowClear
                  treeNodeFilterProp="value"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.linkedin}</lable>
                <SelectItem
                  data={this.state.inspect_linkedin}
                  keyname="inspect_linkedin"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('linkedin')(
                <Input placeholder="请输入Link主页" autoComplete="off" />
              )}
            </Form.Item>
          </Col>
          <Col {...formItemLayout.inputCol}>
            <Form.Item>
              <div className={styles.basicInfoItme}>
                <lable className={styles.basicInfoFont}>{fieldLabels.personal}</lable>
                <SelectItem
                  data={this.state.inspect_personal}
                  keyname="inspect_personal"
                  refreshState={this.setStateData}
                />
              </div>
              {getFieldDecorator('personal')(
                <Input placeholder="请输入个人主页" autoComplete="off" />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  }
  renderTrain() {
    const {
      dispatch,
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Card title="培训经历" bordered={false} style={{ marginTop: 24 }} className={styles.card}>
        <List
          size="large"
          rowKey="id"
          loading={loading}
          dataSource={this.state.trainData}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <a
                  onClick={() => {
                    this.onDataDel(index, 'trainData');
                  }}
                >
                  删除
                </a>,
              ]}
              key={index}
            >
              <div style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col {...formItemLayout.labelTwCol}>
                    <Form.Item label={'开始时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.starttime}` !== ''
                            ? moment(`${item.starttime}`, 'YYYY-MM-DD')
                            : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'trainTimeS' + index}`)}
                      />
                    </Form.Item>
                  </Col>

                  <Col {...formItemLayout.labelTwCol}>
                    <Form.Item label={'结束时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.endtime}` !== '' ? moment(`${item.endtime}`, 'YYYY-MM-DD') : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'trainTimeE' + index}`)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col {...formItemLayout.labelTrCol}>
                    <Form.Item label={'培训机构'}>
                      <Input
                        placeholder={`请输入培训机构`}
                        name="name"
                        value={`${item.name}`}
                        autoComplete="off"
                        onChange={e => {
                          this.onDataChange(e, index, 'trainData');
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formItemLayout.labelTrCol}>
                    <Form.Item label={'证书名称'}>
                      <Input
                        placeholder={`请输入证书名称`}
                        value={`${item.certname}`}
                        name="certname"
                        autoComplete="off"
                        onChange={e => {
                          this.onDataChange(e, index, 'trainData');
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <div className="page-edit-textarea">
                      <Form.Item label={'描述'}>
                        <TextArea
                          rows={4}
                          name="describe"
                          value={`${item.describe}`}
                          onChange={e => {
                            this.onDataChange(e, index, 'trainData');
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={() => this.addDataItem('trainData')}
        >
          添加
        </Button>
      </Card>
    );
  }
  // 经历选择时间
  DatePickerChange = (a, b, key) => {
    const { list, proData, trainData, eduData } = this.state;
    let time = b;
    var NewList = [];
    console.log(b);
    if (key.indexOf('workTimeS') >= 0) {
      const index = key.split('workTimeS')[1];
      NewList = list.slice(0);
      NewList[index].starttime = time;
      this.setState({
        ...this.state,
        list: NewList,
      });
    } else if (key.indexOf('proTimeS') >= 0) {
      const index = key.split('proTimeS')[1];
      NewList = proData.slice(0);
      NewList[index].starttime = time;

      this.setState({
        ...this.state,
        proData: NewList,
      });
    } else if (key.indexOf('trainTimeS') >= 0) {
      const index = key.split('trainTimeS')[1];
      NewList = trainData.slice(0);
      NewList[index].starttime = time;
      this.setState({
        ...this.state,
        trainData: NewList,
      });
    } else if (key.indexOf('eduTimeS') >= 0) {
      const index = key.split('eduTimeS')[1];
      NewList = eduData.slice(0);

      NewList[index].starttime = time;
      this.setState({
        ...this.state,
        eduData: NewList,
      });
    } else if (key.indexOf('workTimeE') >= 0) {
      const index = key.split('workTimeE')[1];
      NewList = list.slice(0);
      NewList[index].endtime = time;
      this.setState({
        ...this.state,
        list: NewList,
      });
    } else if (key.indexOf('proTimeE') >= 0) {
      const index = key.split('proTimeE')[1];
      NewList = proData.slice(0);
      NewList[index].endtime = time;
      this.setState({
        ...this.state,
        proData: NewList,
      });
    } else if (key.indexOf('trainTimeE') >= 0) {
      const index = key.split('trainTimeE')[1];
      NewList = trainData.slice(0);
      NewList[index].endtime = time;
      this.setState({
        ...this.state,
        trainData: NewList,
      });
    } else if (key.indexOf('eduTimeE') >= 0) {
      const index = key.split('eduTimeE')[1];
      NewList = eduData.slice(0);
      NewList[index].endtime = time;
      this.setState({
        ...this.state,
        eduData: NewList,
      });
    }
  };
  // 添加一条
  addDataItem = str => {
    const { list, eduData, trainData, proData } = this.state;

    if (str == 'list') {
      var newList = list.slice(0);
      newList.push({
        company: '',
        position: '',
        starttime: '',
        endtime: '',
        describe: '',
      });
      this.setState({
        ...this.state,
        list: newList,
      });
    } else if (str == 'eduData') {
      var newList = eduData.slice(0);
      newList.push({
        school: '',
        education: '',
        major: '',
        describe: '',
        starttime: '',
        endtime: '',
      });
      this.setState({
        ...this.state,
        eduData: newList,
      });
    } else if (str == 'trainData') {
      var newList = trainData.slice(0);
      newList.push({
        name: '',
        certname: '',
        starttime: '',
        endtime: '',
        describe: '',
      });
      this.setState({
        ...this.state,
        trainData: newList,
      });
    } else if (str == 'proData') {
      var newList = proData.slice(0);
      newList.push({
        name: '',
        starttime: '',
        endtime: '',
        describe: '',
      });
      this.setState({
        ...this.state,
        proData: newList,
      });
    }
  };
  // input输入
  onDataChange = (event, index, str) => {
    const { list, eduData, trainData, proData } = this.state;
    const name = event.target.name;
    const num = index;
    const value = event.target.value;

    if (str == 'list') {
      var newList = list.slice(0);

      newList[num][name] = value;
      this.setState({
        list: newList,
      });
    } else if (str == 'eduData') {
      var newList = eduData.slice(0);
      newList[num][name] = value;
      this.setState({
        eduData: newList,
      });
    } else if (str == 'trainData') {
      var newList = trainData.slice(0);
      newList[num][name] = value;
      this.setState({
        trainData: newList,
      });
    } else if (str == 'proData') {
      var newList = proData.slice(0);
      newList[num][name] = value;
      this.setState({
        proData: newList,
      });
    }
  };

  // 删除
  onDataDel = (index, str) => {
    const num = index;
    const { list, eduData, trainData, proData } = this.state;

    if (str == 'list') {
      var newList = list.slice(0);
      newList.splice(num, 1);
      this.setState({
        list: newList,
      });
    } else if (str == 'eduData') {
      var newList = eduData.slice(0);
      newList.splice(num, 1);
      this.setState({
        eduData: newList,
      });
    } else if (str == 'trainData') {
      var newList = trainData.slice(0);
      newList.splice(num, 1);
      this.setState({
        trainData: newList,
      });
    } else if (str == 'proData') {
      var newList = proData.slice(0);
      newList.splice(num, 1);
      this.setState({
        proData: newList,
      });
    }
  };

  renderWork() {
    const {
      dispatch,
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Card
        bordered={false}
        headStyle={{ color: '#fff', background: 'rgba(204,204,204,0.06)' }}
        style={{ marginTop: 24 }}
      >
        <div className={styles.cardTitle}>
          <div>工作经历</div>
          <div className={styles.basicInfoItme}>
            <SelectItem
              data={this.state.inspect_project}
              keyname="inspect_project"
              refreshState={this.setStateData}
            />
          </div>
        </div>
        <List
          size="large"
          rowKey="id"
          loading={loading}
          dataSource={this.state.list}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <a
                  onClick={() => {
                    this.onDataDel(index, 'list');
                  }}
                >
                  {' '}
                  删除
                </a>,
              ]}
              key={index}
            >
              <div style={{ width: '100%' }}>
                <Row gutter={24}>
                  <Col {...formItemLayout.labelTrCol}>
                    <Form.Item label={'开始时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.starttime}` !== ''
                            ? moment(`${item.starttime}`, 'YYYY-MM-DD')
                            : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'workTimeS' + index}`)}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formItemLayout.labelTrCol}>
                    <Form.Item label={'结束时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.endtime}` !== '' ? moment(`${item.endtime}`, 'YYYY-MM-DD') : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'workTimeE' + index}`)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col {...formItemLayout.labelTrCol}>
                    <Form.Item label={'公司名字'}>
                      <Input
                        className={
                          `${item.company}` == '' &&
                          this.state.requiredTurn &&
                          !this.state.requiredTurn.pass
                            ? styles.warning
                            : ''
                        }
                        placeholder={`请输入公司名字`}
                        name="company"
                        autoComplete="off"
                        value={`${item.company}`}
                        onChange={e => {
                          this.onDataChange(e, index, 'list');
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formItemLayout.labelTrCol}>
                    <Form.Item label={'职位'}>
                      <Input
                        placeholder={`请输入职位`}
                        autoComplete="off"
                        name="position"
                        value={`${item.position}`}
                        className={
                          `${item.position}` == '' &&
                          this.state.requiredTurn &&
                          !this.state.requiredTurn.pass
                            ? styles.warning
                            : ''
                        }
                        onChange={e => {
                          this.onDataChange(e, index, 'list');
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="page-edit-textarea">
                      <Form.Item label={'职责描述'}>
                        <TextArea
                          autosize
                          className={
                            `${item.describe}` == '' &&
                            this.state.requiredTurn &&
                            !this.state.requiredTurn.pass
                              ? styles.warning
                              : ''
                          }
                          name="describe"
                          value={`${item.describe}`}
                          onChange={e => {
                            this.onDataChange(e, index, 'list');
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={() => this.addDataItem('list')}
        >
          添加
        </Button>
      </Card>
    );
  }

  renderEdu() {
    const {
      dispatch,
      form: { getFieldDecorator },
      loading,
    } = this.props;

    return (
      <Card
        bordered={false}
        headStyle={{ color: '#fff', background: 'rgba(204,204,204,0.06)' }}
        style={{ marginTop: 24 }}
      >
        <div className={styles.cardTitle}>
          <div>教育经历</div>
          <div className={styles.basicInfoItme}>
            <SelectItem
              data={this.state.inspect_educations}
              keyname="inspect_educations"
              refreshState={this.setStateData}
            />
          </div>
        </div>
        <List
          size="large"
          rowKey="id"
          loading={loading}
          dataSource={this.state.eduData}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <a
                  key={index}
                  onClick={() => {
                    this.onDataDel(index, 'eduData');
                  }}
                >
                  删除
                </a>,
              ]}
            >
              <div style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col {...formItemLayout.labelFCol}>
                    <Form.Item label={'开始时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.starttime}` !== ''
                            ? moment(`${item.starttime}`, 'YYYY-MM-DD')
                            : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'eduTimeS' + index}`)}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formItemLayout.labelFCol}>
                    <Form.Item label={'结束时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.endtime}` !== '' ? moment(`${item.endtime}`, 'YYYY-MM-DD') : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'eduTimeE' + index}`)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col {...formItemLayout.labelFCol}>
                    <Form.Item label={'学校名字'}>
                      <Input
                        placeholder={`请输入学校名字`}
                        className={
                          `${item.school}` == '' &&
                          this.state.requiredTurn &&
                          !this.state.requiredTurn.pass
                            ? styles.warning
                            : ''
                        }
                        autoComplete="off"
                        name="school"
                        value={`${item.school}`}
                        onChange={e => {
                          this.onDataChange(e, index, 'eduData');
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formItemLayout.labelFCol}>
                    <Form.Item label={'学历'}>
                      <select
                        className={
                          `${item.education}` == '' &&
                          this.state.requiredTurn &&
                          !this.state.requiredTurn.pass
                            ? styles.selectEduWarning
                            : styles.selectEdu
                        }
                        name="education"
                        value={`${item.education}`}
                        onChange={e => {
                          this.onDataChange(e, index, 'eduData');
                        }}
                      >
                        <option value="" />
                        {heighteducationOptions.map((item, index) => {
                          return (
                            <option value={item.value} key={index}>
                              {item.title}
                            </option>
                          );
                        })}
                      </select>
                    </Form.Item>
                  </Col>
                  <Col {...formItemLayout.labelFCol}>
                    <Form.Item label={'专业'}>
                      <Input
                        placeholder={`请输入专业`}
                        className={
                          `${item.major}` == '' &&
                          this.state.requiredTurn &&
                          !this.state.requiredTurn.pass
                            ? styles.warning
                            : ''
                        }
                        autoComplete="off"
                        name="major"
                        value={`${item.major}`}
                        onChange={e => {
                          this.onDataChange(e, index, 'eduData');
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="page-edit-textarea">
                      <Form.Item label={'描述'}>
                        <TextArea
                          autosize
                          autoComplete="off"
                          value={`${item.describe}`}
                          name="describe"
                          onChange={e => {
                            this.onDataChange(e, index, 'eduData');
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={() => this.addDataItem('eduData')}
        >
          {' '}
          添加
        </Button>
      </Card>
    );
  }
  renderPro() {
    const {
      dispatch,
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Card
        bordered={false}
        headStyle={{ color: '#fff', background: 'rgba(204,204,204,0.06)' }}
        style={{ marginTop: 24 }}
        className={styles.card}
      >
        <div className={styles.cardTitle}>
          <div>项目经历</div>
          <div className={styles.basicInfoItme}>
            <SelectItem
              data={this.state.inspect_experience}
              keyname="inspect_experience"
              refreshState={this.setStateData}
            />
          </div>
        </div>
        <List
          size="large"
          rowKey="id"
          loading={loading}
          dataSource={this.state.proData}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <a
                  onClick={() => {
                    this.onDataDel(index, 'proData');
                  }}
                >
                  删除
                </a>,
              ]}
              key={index}
            >
              <div style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col {...formItemLayout.labelTwCol}>
                    <Form.Item label={'项目名称'}>
                      <Input
                        placeholder={`请输入项目名称`}
                        autoComplete="off"
                        name="name"
                        value={`${item.name}`}
                        onChange={e => {
                          this.onDataChange(e, index, 'proData');
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formItemLayout.labelTwCol}>
                    <Form.Item label={'开始时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.starttime}` !== ''
                            ? moment(`${item.starttime}`, 'YYYY-MM-DD')
                            : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'proTimeS' + index}`)}
                      />
                    </Form.Item>
                  </Col>

                  <Col {...formItemLayout.labelTwCol}>
                    <Form.Item label={'结束时间'}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={
                          `${item.endtime}` !== '' ? moment(`${item.endtime}`, 'YYYY-MM-DD') : ''
                        }
                        onChange={(a, b) => this.DatePickerChange(a, b, `${'proTimeE' + index}`)}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <div className="page-edit-textarea">
                      <Form.Item label={'描述'}>
                        <TextArea
                          autosize
                          name="describe"
                          value={`${item.describe}`}
                          onChange={e => {
                            this.onDataChange(e, index, 'proData');
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={() => this.addDataItem('proData')}
        >
          添加
        </Button>
      </Card>
    );
  }
  // 附件
  renderAttach() {
    const {
      dispatch,
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Card title="附件" bordered={false} style={{ marginTop: 24 }} className={styles.card}>
        <Upload {...uploadProps} onChange={this.onAttachUp}>
          <Button>
            <Icon type="upload" />上传附件
          </Button>
        </Upload>

        <List
          size="large"
          rowKey="id"
          loading={loading}
          dataSource={this.state.attachData}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <a
                  data={index}
                  onClick={e => {
                    this.onAttachDel(e, index);
                  }}
                >
                  删除
                </a>,
              ]}
              key={index}
            >
              <div style={{ width: '100%' }}>
                <Row>附件{index + 1}</Row>
              </div>
            </List.Item>
          )}
        />
      </Card>
    );
  }

  // 上传简历
  onResumeUp = file => {
    const resumeData = this.state.resumeData;
    if (file.file.status === 'done') {
      if (file.file.response.errno == 0) {
        message.success(`${file.file.name} 上传成功`);
        var time = crtTimeFtt(`${file.file.lastModifiedDate}`, 2);
        const newResumeData = [];

        newResumeData.push({
          filePath: file.file.response.data[0],
          fileName: `${file.file.name}`,
          updatedTime: time,
        });
        this.resumeData = resumeData;
        this.setState(
          {
            resumeData: newResumeData,
          },
          () => {
            console.log(this.state.resumeData);
            this.preParseResume();
          }
        );
      } else {
        message.success(`${file.file.name} 删除失败`);
      }
    } else if (file.file.status === 'error') {
      message.error(`${file.file.name} 上传失败`);
    }
  };
  onResumeDel = (event, index) => {
    this.setState({
      ...this.state,
      resumeData: [],
    });
    this.resetFieldsAndState();
  };
  resetFieldsAndState() {
    this.props.form.resetFields();

    this.setState({
      list: [],
      eduData: [],
      proData: [],
      trainData: [],
      visible: false,
      drawerData: {
        isopenphone: 2,
        isopenwchat: 2,
        isopenname: 2,
        remark: '',
      },
      remark: '',
      inspect_age: 0,
      inspect_city_hope: 0,
      inspect_city_now: 0,
      inspect_country: 0,
      inspect_education: 0,
      inspect_educations: 0,
      inspect_email: 0,
      inspect_experience: 0,
      inspect_height_education: 0,
      inspect_industry: 0,
      inspect_job_state: 0,
      inspect_linkedin: 0,
      inspect_name: 0,
      inspect_personal: 0,
      inspect_phone: 0,
      inspect_position: 0,
      inspect_project: 0,
      inspect_rr: 0,
      inspect_salary: 0,
      inspect_salarypm: 0,
      inspect_sex: 0,
      inspect_wchat: 0,
      inspect_work_time: 0,
    });
    this.initialRemark = '';
    this.resumeData = [];
  }

  preParseResume = event => {
    let index, num, data;
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    const that = this;
    const { resumeData } = this.state;
    data = resumeData[0] || this.resumeData[0];
    let url = null;
    // if (window.apiHost == 'http://hunter.zhantoubang.com') {
    //   console.log(data);
      url = data.filePath.replace(
        'http://hunter.zhantoubang.com',
        '/data/webapp/hunter/admin_php_cathy/public'
      );
    // } else {
    //   url = data.filePath.replace(
    //     'http://hunter.zhantoubang.com',
    //     '/data/webapp/hunter/hunter_php/public'
    //   );
    // }

    dispatch({
      type: 'resumedetail/parseResume',
      payload: { url },
      callback: function(response) {
        if (response.status != '0') {
          message.error(`${response.status}:${response.msg}`);
        } else {
          // 先清空一遍，否则有BUG
          that.resetFieldsAndState();
          const data = response.data;

          let values = {
            base_person_name: data.base_person_name || '',
            base_person_phone:
              data.base_person_phone && /^[0-9]+.?[0-9]*/.test(data.base_person_phone)
                ? data.base_person_phone
                : '',
            worktime:
              data.worktime && /^[0-9]+.?[0-9]*/.test(data.worktime)
                ? Math.round(data.worktime)
                : '',
            age: data.age !== '' && /^[0-9]+.?[0-9]*/.test(data.age) ? data.age : '',
            heighteducation: data.heighteducation || '',
            education: data.education || '',
            wchat: data.wechat || '',
            email: data.email ? data.email : '',
            country: data.country || '中国',

            sex: data.sex > 0 ? data.sex : '',
            linkedin: data.linkedin || '',
            personal: data.personal || '',

            rr: data.base_person_rr || '',
            jobstate: `${data.jobstate + 1}` || '',

            industry: data.base_person_industry ? data.base_person_industry : [],
            position: data.base_person_position ? data.base_person_position : [],

            citynow: data.citynow && data.citynow['code'] ? reCityNow(data.citynow) : [],
            cityhope: data.cityhope && data.cityhope.length > 0 ? reCityHope(data.cityhope) : [],

            salary:
              data.salary && /^[0-9]+.?[0-9]*/.test(data.salary)
                ? Number((Math.round(data.salary) / 10000).toFixed(2))
                : '',
            salarypm:
              data.salarypm && /^[0-9]+.?[0-9]*/.test(data.salarypm)
                ? Number((Math.round(data.salarypm) / 1000).toFixed(2))
                : '',
          };

          var list = data.exp ? reListData(data.exp).slice(0) : [];
          const eduData = data.edu ? reEduData(data.edu).slice(0) : [];
          var proData = data.pro ? reProData(data.pro).slice(0) : [];
          const trainData = data.train ? reTraData(data.train).slice(0) : [];

          console.info(list, proData, data);
          if (list.length == 0) {
            list.push(...proData);
            proData = [];
          }

          that.setState({
            list,
            eduData,
            proData: [],
            trainData,
          });
          setFieldsValue(values);
        }
      },
    });
  };
  preViewResume = event => {
    const index = event.target.getAttribute('data');
    const num = index;
    const { resumeData } = this.state;

    const data = resumeData[num];
    const url = data.filePath;

    if (/\.(xlsx|xls|XLSX|XLS|doc|docx)$/.test(url)) {
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${url}`);
    } else {
      window.open(`${url}`);
    }
  };
  // 上传附件
  onAttachUp = file => {
    let attachData = this.state.attachData;
    if (file.file.status === 'done') {
      if (file.file.response.errno == 0) {
        message.success(`${file.file.name} 上传成功`);
        var time = crtTimeFtt(`${file.file.lastModifiedDate}`, 2);
        const newResumeData = attachData.slice(0);
        newResumeData.push({
          filePath: file.file.response.data[0],
          fileName: `${file.file.name}`,
          updatedTime: time,
        });
        this.setState({
          attachData: newResumeData,
        });
      } else {
        message.success(`${file.file.name} 删除失败`);
      }
    } else if (file.file.status === 'error') {
      message.error(`${file.file.name} 上传失败`);
    }
  };
  onAttachDel = (e, index) => {
    const num = index;
    const { attachData } = this.state;
    let newResumeData = attachData.slice(0);
    newResumeData.splice(num, 1);
    this.setState({
      ...this.state,
      attachData: newResumeData,
    });
  };
  preSwitchResume = () => {
    this.setState({
      ...this.state,
      switchView: true,
    });
  };
  // 上传简历
  renderResume() {
    const {
      dispatch,
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const that = this;
    return (
      <Card bordered={false} style={{ marginBottom: 24, marginTop: 10 }} className={styles.card}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={[...this.state.resumeData, '']}
            renderItem={(item, index) =>
              item ? (
                <List.Item key={item.id} data={index}>
                  <Card
                    hoverable
                    className={styles.card}
                    data={index}
                    actions={
                      that.state.resumeData
                        ? [
                            <a
                              href="javascript:void(0);"
                              data={index}
                              onClick={() => this.preSwitchResume()}
                            >
                              预览
                            </a>,
                            <a
                              href="javascript:void(0);"
                              data={index}
                              onClick={event => this.preParseResume(event)}
                            >
                              解析
                            </a>,
                            <Popconfirm
                              title="是否删除"
                              okText="Yes"
                              cancelText="No"
                              onConfirm={event => this.onResumeDel(event, index)}
                            >
                              <a href="javascript:void(0);">删除</a>
                            </Popconfirm>,
                          ]
                        : [
                            <a
                              href="javascript:void(0);"
                              data={index}
                              onClick={event => this.preParseResume(event)}
                            >
                              解析
                            </a>,
                            <Popconfirm
                              title="是否删除"
                              okText="Yes"
                              cancelText="No"
                              onConfirm={event => this.onResumeDel(event, index)}
                            >
                              <a href="javascript:void(0);">删除</a>
                            </Popconfirm>,
                          ]
                    }
                  >
                    <Card.Meta
                      avatar={
                        item.fileName.split('.')[1] == 'htm' ||
                        item.fileName.split('.')[1] == 'html' ? (
                          <img
                            className={styles.cardAvatar}
                            src="../../../../images/html.png"
                            data={index}
                            onClick={event => this.preViewResume(event)}
                          />
                        ) : item.fileName.split('.')[1] == 'pdf' ? (
                          <img
                            src="../../../../images/pdf.png"
                            className={styles.cardAvatar}
                            data={index}
                            onClick={event => this.preViewResume(event)}
                          />
                        ) : /\.(xlsx|xls|XLSX|XLS|doc|docx)$/.test(item.fileName) ? (
                          <img
                            src="../../../../images/doc.jpg"
                            className={styles.cardAvatar}
                            data={index}
                            onClick={event => this.preViewResume(event)}
                          />
                        ) : null
                      }
                      title={
                        <a
                          href="javascript:void(0);"
                          data={index}
                          onClick={event => this.preViewResume(event)}
                        >
                          {item.fileName}
                        </a>
                      }
                      description={
                        <Ellipsis className={styles.item} lines={1}>
                          {item.updatedTime}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Dragger {...uploadProps} onChange={this.onResumeUp}>
                    <div
                      style={{
                        height: '111px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Icon type="plus" />
                      {this.state.resumeData.length >= 1 ? '重新上传简历' : '上传简历'}
                    </div>
                  </Dragger>
                </List.Item>
              )
            }
          />
        </div>
      </Card>
    );
  }
}
