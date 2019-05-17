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

const { TextArea } = Input;
// import { stringify } from '../../node_modules/querystring';

const FormItem = Form.Item;
@Form.create()
@connect(({ resumelist, loading }) => ({
  resumelist,
  loading: loading.models.rule,
}))
export default class SettingProjectResumeRemarkModel extends React.Component {
  static contextTypes = {
    resume: PropTypes.object,
    projectid: PropTypes.number,
    refreshFuc: PropTypes.func,
  };

  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleReset(fieldsValue);
    });
  };

  handleReset = fieldsValue => {
    const { dispatch } = this.props;

    var pripayload = {};
    pripayload.remark = fieldsValue.remark == null ? '' : fieldsValue.remark;
    pripayload.proid = this.props.projectid;
    pripayload.baseid = this.props.resume.id;
    pripayload.status = this.props.resume.proStatus.project_resume_status;
    this.setState({
      confirmLoading: true,
    });

    dispatch({
      type: 'resumelist/editProjectResumeState',
      payload: {
        ...pripayload,
      },
      callback: response => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        if (response.status == 0) {
          message.success('修改成功');
        }
        this.props.refreshFuc();
      },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    const {form} = this.props;

    var remark = '';
    if (this.props.resume!=null && this.props.resume!=undefined ) {
      if (this.props.resume.proStatus!=null && this.props.resume.proStatus!=undefined ) {
        if (this.props.resume.proStatus.project_remark!=null && this.props.resume.proStatus.project_remark!=undefined ) {
          remark = this.props.resume.proStatus.project_remark;
        }
      }
    }
    return (
      <div>
        <Fragment>
          <label>{remark}</label>
          <Divider type="vertical" hidden={!remark.length} />
          <a onClick={this.showModal}>修改</a>
          <Modal
            title="备注"
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
              {form.getFieldDecorator('remark', {
                initialValue: remark,
                rules: [{ required: false, message: 'Please input some description...' }],
              })(<TextArea type="password" placeholder="备注" autosize="true" />)}
            </FormItem>
          </Modal>
        </Fragment>
      </div>
    );
  }
}
