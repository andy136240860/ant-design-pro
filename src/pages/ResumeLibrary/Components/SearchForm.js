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
    Radio,
} from 'antd';
// import { HighlightSpanKind } from '../../../../node_modules/typescript';
import styles from './SearchForm.less'
import { workChangeData, sexData, rroptions } from '../../../utils/info'
const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;
@Form.create()


export default class SearchForm extends React.Component {
    static contextTypes = {
        searchFuc: PropTypes.func,
    };

    state = {
        expandForm: false,
        formValues: {},
    };
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };


    handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;
        var that = this;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                formValues: values,
            });
            that.props.searchFuc(values);
        });
    };

    renderSimpleForm() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="关键词">
                            {getFieldDecorator('keywords')(
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    // onChange={handleChange}
                                    tokenSeparators={[',']}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="职能">
                            {getFieldDecorator('fun')(
                                <Input placeholder="不限" />
                            )}
                        </FormItem>
                    </Col>
                    <FormItem label="年龄" layout="inline">
                        <InputGroup compact>
                            {getFieldDecorator('ageMin')(
                                <InputNumber min={18} max={80} placeholder='不限' />
                            )}

                            <Input style={{ width: 30, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                            {getFieldDecorator('ageMax')(
                                <InputNumber min={18} max={80} placeholder='不限' />
                            )}
                        </InputGroup>
                    </FormItem>
                    <div style={{ overflow: 'hidden' }}>
                        <span className={styles.submitButtons} style={{ float: 'right', marginBottom: 24 }}>
                            <Button type="primary" htmlType="submit">
                                查询
                    </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                    </Button>
                            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a>
                        </span>
                    </div>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        var keywords = [];
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="关键词">
                            {getFieldDecorator('keywords')(
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    // onChange={handleChange}
                                    tokenSeparators={[',']}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="职能">
                            {getFieldDecorator('fun')(
                                <Input placeholder="不限" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="行业">
                            {getFieldDecorator('industry')(
                                <Input placeholder="不限" />
                            )}
                        </FormItem>
                    </Col>
                    {/* <Col md={8} sm={24}>
            <FormItem label="职位名称">
                {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
            </Col> */}
                    <Col md={8} sm={24}>
                        <FormItem label="公司名称">
                            {getFieldDecorator('company')(<Input placeholder="不限" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="期望工作地区">
                            {getFieldDecorator('hopeCity')(
                                <Input placeholder="不限" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="目前工作地区">
                            {getFieldDecorator('nowCity')(
                                <Input placeholder="不限" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="学历">

                            <InputGroup compact>
                                {getFieldDecorator('educationMin')(
                                    <Select placeholder="不限" style={{ width: 100, textAlign: 'center' }}>
                                        <Option value="10">中专</Option>
                                        <Option value="20">高中</Option>
                                        <Option value="30">本科</Option>
                                        <Option value="40">硕士</Option>
                                        <Option value="50">博士</Option>
                                        <Option value="60">博士后</Option>
                                        <Option value="100">其它</Option>
                                    </Select>
                                )}

                                <Input style={{ width: 30, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                {getFieldDecorator('educationMax')(
                                    <Select placeholder="不限" style={{ width: 100, textAlign: 'center', borderLeft: 0 }}>
                                        <Option value="10">中专</Option>
                                        <Option value="20">高中</Option>
                                        <Option value="30">本科</Option>
                                        <Option value="40">硕士</Option>
                                        <Option value="50">博士</Option>
                                        <Option value="60">博士后</Option>
                                        <Option value="100">其它</Option>
                                    </Select>
                                )}
                            </InputGroup>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="年龄" layout="inline">
                            <InputGroup compact>
                                {getFieldDecorator('ageMin')(
                                    <InputNumber min={18} max={80} placeholder='不限' />
                                )}

                                <Input style={{ width: 30, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                {getFieldDecorator('ageMax')(
                                    <InputNumber min={18} max={80} placeholder='不限' />
                                )}
                            </InputGroup>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="工作年限" layout="inline">
                            <InputGroup compact>
                                {getFieldDecorator('workTimeMin')(
                                    <InputNumber min={0} max={50} placeholder='不限' />
                                )}

                                <Input style={{ width: 30, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                {getFieldDecorator('workTimeMax')(
                                    <InputNumber min={0} max={50} placeholder='不限' />
                                )}
                            </InputGroup>
                        </FormItem>
                    </Col>
                    {/* rroptions */}
                    <Col md={8} sm={24}>
                        <FormItem label="是否统招">
                            {getFieldDecorator('rr')(
                                <RadioGroup>
                                    <RadioButton value='不限'>不限</RadioButton>
                                    {rroptions.map((item)=>{
                                        return (
                                            <RadioButton value={item.value}>{item.title}</RadioButton>
                                        )
                                    })}
                                    
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="性别">
                            {getFieldDecorator('sex')(
                                <RadioGroup>
                                    <RadioButton value='0'>不限</RadioButton>
                                    {sexData.map((item,index)=>{
                                        return (
                                            <RadioButton value={item.value} key={index}>{item.title}</RadioButton>
                                        )
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="求职状态">
                            {getFieldDecorator('jobState')(
                                <Select placeholder="请选择" allowClear='ture' style={{ width: '100%' }} >
                                    {
                                        workChangeData.map((item,index) => {
                                            return (
                                                <Option value={`${item.value}`} key={index}>{item.title}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>{' '}
                    <Col md={8} sm={24}>
                        {/* <FormItem label="更新时间">
                {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">关闭</Option>
                    <Option value="1">运行中</Option>
                </Select>
                )}
            </FormItem> */}
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">
                            查询
            </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                            重置
            </Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                        </a>
                    </span>
                </div>
            </Form>
        );
    }

    renderForm() {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        const { form, project } = this.props;

        return (
            <div className={styles.tableListForm}>{this.renderForm()}</div>
        );
    }
}

