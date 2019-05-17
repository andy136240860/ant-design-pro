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
import Ellipsis from 'components/Ellipsis';
import { connect } from 'dva';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import SelectItem from './components/selectItem/index';
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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { geocity } from '../../utils/city';
import { jonInfo } from '../../utils/jonInfo';
import { ConcurrentRequest } from '../../utils/ConcurrentRequest';
import { handleCheckMail, handleCheckNum } from '../../utils/validation-message';
import ModlesProcess from '../Project/Components/processModel';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;
const { Panel } = Collapse;
const { Link } = Anchor;
@connect(({ rule, resumedetail, loading }) => ({
  resumedetail,
}))
@Form.create()
export default class Detail extends PureComponent {
  state = {
    statusData: [
      {
        id: 1,
        call: '\u4e0b\u73ed',
        date: '2018-10-7 12:07:09',
      },
      {
        id: 3,
        call: 'shang\u73ed',
        date: '2018-10-7 12:07:11',
      },
      {
        id: 4,
        call: 'shang\u73ed',
        date: '2018-10-7 12:07:11',
      },
      {
        id: 1,
        status_id: '1',
        date: '2018-11-22 11:23:45',
      },
    ],
  };

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return <ModlesProcess statusData={this.state.statusData} />;
  }
}
