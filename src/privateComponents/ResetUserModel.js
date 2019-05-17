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
// import { FromEventObservable } from '../../node_modules/rxjs/observable/FromEventObservable';


const FormItem = Form.Item;
@Form.create()

@connect(({ user, loading }) => ({
    user,
    loading: loading.models.rule,
  }))

export default class ResetUserModal extends React.Component {
    static contextTypes = {
        userinfo: PropTypes.object,
        refreshFuc: PropTypes.func,
    };

    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }



    handleOk = () => {  

        const { dispatch , form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            this.handleReset(fieldsValue);
        });

        
    }

    handleReset = (fieldsValue) => {
        const { dispatch } = this.props;

        var pripayload = {};
        pripayload.id =  this.props.userinfo.id;
        if (fieldsValue.realname && fieldsValue.realname.length > 0 ) {
            pripayload.realname =  fieldsValue.realname;
        }
        if (fieldsValue.password && fieldsValue.password.length > 0 ) {
            pripayload.password =  fieldsValue.password;
        }
        this.setState({
            confirmLoading: true,
        });
        dispatch({
            type: 'user/updateUser',
            payload: {
                ...pripayload,   
            },
            callback: (response) => {
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

        setTimeout(() => {

        }, 2000);
    }

    handleCancel = () => {
        const { form } = this.props;
        form.resetFields();

        this.setState({
            visible: false,
        });
    }

    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        const { form } = this.props;


        return (
        <div>
            
            <a onClick={this.showModal}>设置</a>
                <Modal title='设置账号'
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账号">
                        {form.getFieldDecorator('username', {
                        rules: [{ required: false, message: 'Please input some description...' }],
                        initialValue:this.props.userinfo.user_name,
                        })(<Input disabled='false' placeholder="请输入" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="猎头姓名">
                        {form.getFieldDecorator('realname', {
                        initialValue: this.props.userinfo.realname,
                        rules: [{ required: false, message: 'Please input some description...' }],
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
                        {form.getFieldDecorator('password', {
                        rules: [{ required: false, message: 'Please input some description...' }],
                        })(<Input type="password" placeholder="请输入" />)}
                    </FormItem>
                </Modal>
        </div>
        );
    }
}
  