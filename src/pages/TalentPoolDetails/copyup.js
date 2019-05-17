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
import moment from 'moment';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;
const { Panel } = Collapse;
const { Link } = Anchor;

@connect(({ resumedetail, user, loading }) => ({
  resumedetail,
  user,
  loading: loading.models.resumedetail,
}))
@Form.create()
export default class Detail extends PureComponent {
  state = {};

  componentWillMount() {}

  componentDidMount() {}

  // 提交
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'resumedetail/copy',
          payload: values,
          callback: function (response) {
            if (response.status === 0) {
              const data = { ...response.data, fileName: `${response.data.fileName}.docx` };
              window.open(`/resumelibrary/pooldetails/new/4?data=${JSON.stringify(data)}`);
            }
          }
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      // Industry
      <PageHeaderLayout title={'复制上传'}>
        <Form layout="vertical">
          <Card
            // title="评价"
            bordered={false}
            style={{ marginTop: 24 }}
          >
            <Form.Item>
              {getFieldDecorator('text', {
                rules: [{ required: true, message: '请输入文本' }],
              })(<TextArea rows={4} autoComplete="off" />)}
            </Form.Item>
            <Button type="primary" onClick={this.handleSubmit}>
              一键上传解析
            </Button>
          </Card>
        </Form>
      </PageHeaderLayout>
    );
  }
}
