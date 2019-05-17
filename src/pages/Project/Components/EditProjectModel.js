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
// import { HighlightSpanKind } from '../../../../node_modules/typescript';

const { TextArea } = Input;


const FormItem = Form.Item;
@Form.create()

export default class EditProjectDetailModel extends React.Component {
    static contextTypes = {
        project: PropTypes.object,
        refreshFuc: PropTypes.func,
    };

    state = {
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
        if (fieldsValue.remark && fieldsValue.remark.length > 0 ) {
            pripayload.remark =  fieldsValue.remark;
        }
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

    }


    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        const { form , project } = this.props;

        return (
        <div>
            <Modal
                title={project.id == null ? "新建项目":"编辑项目"}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="客户公司">
                {form.getFieldDecorator('projectCompany', {
                    initialValue: currentEditingProject.company,
                    rules: [{ required: true, message: '请输入客户公司名称' }],
                })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目名称">
                {form.getFieldDecorator('projectName', {
                    initialValue: currentEditingProject.name,
                    rules: [{ required: true, message: '请输入项目名称' }],
                })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="行业">
                {form.getFieldDecorator('projectIndustry', {
                    initialValue: currentEditingProject.industry,
                    rules: [{ required: true, message: '请选择行业' }],
                })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="职能">
                {form.getFieldDecorator('projectMajor', {
                    initialValue: currentEditingProject.major,
                    rules: [{ required: true, message: '请选择职能' }],
                })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="城市">
                {form.getFieldDecorator('projectCity', {
                    initialValue: currentEditingProject.city,
                    rules: [{ required: true, message: '请选择职位所在城市' }],
                })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目时间">
                {form.getFieldDecorator('projectTime', {
                    initialValue: moment2,
                    rules: [{ required: true, message: '请选择项目开始结束时间' }],
                })(<RangePicker format={dateFormat} />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="JD">
                {form.getFieldDecorator('projectJD', {
                    initialValue: currentEditingProject.describe,
                    rules: [{ required: true, message: '请输入项目职责要求' }],
                })(<TextArea placeholder="请输入" autosize="true" />)}
                </FormItem>
            </Modal>
        </div>
        );
    }
}
  