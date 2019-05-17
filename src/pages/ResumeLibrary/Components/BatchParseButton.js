import React, {
  PureComponent,
  Fragment
} from 'react';
import {
  Button,
  Progress,
  message,
  notification
} from 'antd';
import PropTypes from 'prop-types';
import {
  connect
} from 'dva';

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
  } from '../../../utils/info';

  var successResumeCount = 0;
  var failResumeCount = 0;
  var resumeCount = 0;

@connect(({
  resumefile,
  resumedetail,
  loading
}) => ({
  resumefile,
  resumedetail,
  loading: loading.models.rule,
}))




export default class BatchParseButton extends React.Component {
  static contextTypes = {
    refreshFuc: PropTypes.func,
    data: PropTypes.object,
  };

  state = {
    currentParsingResume: null,
  }




  parseResume = val => {
    console.info('parseResume',val)
    const {
      dispatch,
    } = this.props;
    const that = this;
    var data = val;

    let url = null;
    if (window.apiHost == 'http://hunter.zhantoubang.com') {
      console.log(data)
      url = data.filePath.replace(
        'http://hunter.zhantoubang.com',
        '/data/webapp/hunter/admin_php_cathy/public'
      );
    } else {
      url = data.filePath.replace(
        'http://hunter.zhantoubang.com',
        '/data/webapp/hunter/hunter_php/public'
      );
    }


    dispatch({
      type: 'resumedetail/parseResume',
      payload: {
        url
      },
      callback: function (response) {
        console.info(response);
        if (response.status != '0') {
            //标记进度条失败
            that.handleNotParseResume(that.state.currentParsingResume);
            message.error(`解析失败 - ${that.state.currentParsingResume.fileName} 错误代码：${response.status} 原因:${response.msg}`, 5);
            return;
        }
        
        var formatedData = that.formatResumeData(response.data);
        console.info(response.data,val,formatedData);
        that.saveResumeData(formatedData);
      },
    });
  };

  //保存简历数据至人才库
  saveResumeData = data => {
    const {
      dispatch,
    } = this.props;
    console.log(data)
    const that = this;

    dispatch({
        type: 'resumedetail/save',
        payload: { ...data },
        callback: function(response) {
            console.info(response);
          if (response.status == 0) {
            message.success(`解析成功 - ${that.state.currentParsingResume.fileName}`, 5);
            that.handleDeleteResume(that.state.currentParsingResume);
            
          } else {
            message.error(`解析失败 - ${that.state.currentParsingResume.fileName} 错误代码：${response.status} 原因:${response.msg}`, 5);
            that.handleNotParseResume(that.state.currentParsingResume);
          }
        },
      });
  };


  //整理数据
  formatResumeData = (responseData) => {
    const data = responseData;
    var myDate = new Date();

    var resuemFile = this.state.currentParsingResume;
    resuemFile.state = 1;

    var list = data.exp ? reListData(data.exp).slice(0) : [];
    const eduData = data.edu ? reEduData(data.edu).slice(0) : [];
    var proData = data.pro ? reProData(data.pro).slice(0) : [];
    const trainData = data.train ? reTraData(data.train).slice(0) : [];

    console.info(list, proData, data);
    if (list.length == 0) {
      list.push(...proData);
      proData = [];
    }

    let values = {
      base_person_name: data.base_person_name || '',
      base_person_phone: data.base_person_phone && /^[0-9]+.?[0-9]*/.test(data.base_person_phone) ?
        data.base_person_phone :
        '',
      worktime: data.worktime && /^[0-9]+.?[0-9]*/.test(data.worktime) ?
        `${myDate.getFullYear() - Math.round(data.worktime)}` :
        '',
      age: data.age !== '' && /^[0-9]+.?[0-9]*/.test(data.age) ? `${myDate.getFullYear() - data.age}` : '',
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

      salary: data.salary && /^[0-9]+.?[0-9]*/.test(data.salary) ?
        Number((Math.round(data.salary) / 10000).toFixed(2)) :
        '',
      salarypm: data.salarypm && /^[0-9]+.?[0-9]*/.test(data.salarypm) ?
        Number((Math.round(data.salarypm) / 1000).toFixed(2)) :
        '',
        edu:eduData,
        exp:list,
        project:proData,
        resume:[resuemFile],
    };
    return values;
  }

  handleNotParseResume = val => {
    const { dispatch } = this.props;
    var that = this;
    dispatch({
      type: 'resumefile/changeresumefilestate',
      payload: {
        resumeid: val.id,
        state: 3,
      },
      callback: () => {
        // that.setState({
        //   failResumeCount: that.state.failResumeCount + 1,
        // }, () => {
        //   that.handleBatchParse();
        // });
        failResumeCount = failResumeCount+1;
        that.handleBatchParse();
      },
    });
  };

  handleDeleteResume = val => {
    const { dispatch } = this.props;
    var that = this;
    dispatch({
      type: 'resumefile/changeresumefilestate',
      payload: {
        resumeid: val.id,
        state: 0,
      },
      callback: () => {
        // that.setState({
        //   successResumeCount: that.state.successResumeCount + 1,
        // }, () => {
        //   that.handleBatchParse();
        // });
        successResumeCount = successResumeCount+1;
        that.handleBatchParse();
      },
    });
  };

  //批量解析
  handleBatchParse = () => {
    var that = this;
    console.info(this);
    this.props.refreshFuc();
    if (!this.props.data.length) {
      console.info('简历全部解析完毕');
      var type, message, description;
      if (resumeCount ==  successResumeCount) {
        type = 'success';
        message = `全部解析成功 共${successResumeCount}条`
        description = '请在【全部人才】列表查看已解析简历，如有部分简历解析不准确，请手动修改保存'
      }
      else if (resumeCount == failResumeCount) {
        type = 'error';
        message = `解析失败 共${failResumeCount}条`
        description = '请在【解析失败】列表查看解析失败简历手动修改保存'
      }
      else {
        type = 'warning';
        message = `部分解析失败 成功${successResumeCount}条 失败${failResumeCount}条`;
        description = '请在【解析失败】列表查看解析失败简历手动修改保存，其余简历已经保存至【全部人才】列表'
      }
      this.openNotificationWithIcon(type,message,description);
      return;
    }

    if(this.props.data.length == 1) {
      this.setState({
        currentParsingResume: this.props.data[0],
      }, () => {
        console.info('currentParsingResume',that.state.currentParsingResume);
        this.props.data.shift();
        that.parseResume(that.state.currentParsingResume);
      });
    }
    else 
    {
      var currentResume = this.props.data.shift();
      this.setState({
        currentParsingResume: currentResume,
      }, () => {
        console.info('currentParsingResume',that.state.currentParsingResume);
        that.parseResume(currentResume);
      });
    }
  }

  openNotificationWithIcon = (type,message,description) => {
    notification[type]({
      message: message,
      description: description,
    });
  }

  startBatchParse = () => {
    var that = this;
    console.info(this);
    if (this.props.data.length == 0) return;
    resumeCount = this.props.data.length;
    failResumeCount = 0;
    successResumeCount = 0;
    that.handleBatchParse();
  }

  render() {
    const { currentParsingResume } = this.state;
    return ( 
        <div style={{display:'flex',flex:"1",width:"100%"}}>
          <Button onClick = {() => this.startBatchParse()}>批量解析</Button>
          {currentParsingResume && (
           
                <Progress  style={{flex:1,width:"100%"}} percent={((resumeCount - this.props.data.length)/resumeCount*100).toFixed(2)} status="active" />
              
           )}
        </div>
    );
  }
}
