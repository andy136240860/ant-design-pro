import PropTypes from 'prop-types';

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';

import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Icon,
    Button,
    InputNumber,
    Radio,
    Switch,
    Tag,
    TreeSelect
} from 'antd';
// import { HighlightSpanKind } from '../../../../node_modules/typescript';
import styles from './SearchForm.less'
import { workChangeData, sexData, rroptions } from '../../../utils/info'
const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import { fieldLabels } from '../../../utils/info';
import SelectItem from '../../TalentPoolDetails/components/selectItem/index';
const FormItem = Form.Item;
let selectData =[
    {
        value: 'inspect_name',
        title: '姓名',
    },
    {
        value: 'inspect_sex',
        title: '性别',
    },
    {
        value: 'inspect_age',
        title: '年龄',
    },
    {
        value: 'inspect_phone',
        title: '手机',
    },
    {
        value: 'inspect_email',
        title: '邮箱',
    },
    // {
    //     value: 'inspect_wchat',
    //     title: '微信',
    // },
    {
        value: 'inspect_height_education',
        title: '最高学历',
    },
    {
        value: 'inspect_education',
        title: '第一学历',
    },

    {
        value: 'inspect_rr',
        title: '是否统招',
    },
    {
        value: 'inspect_city_hope',
        title: '期望城市',
    },
    {
        value: 'inspect_city_now',
        title: '当前城市',
    },
    {
        value: 'inspect_country',
        title: '国籍',
    },
    // {
    //     value: 'inspect_job_state',
    //     title: '工作状态',
    // },
    // {
    //     value: 'inspect_linkedin',
    //     title: 'linkeding主页',
    // },
    {
        value: 'inspect_personal',
        title: '个人主页',
    },
    {
        value: 'inspect_work_time',
        title: '工作年限',
    },
    {
        value: 'inspect_salarypm',
        title: '月薪',
    },
    {
        value: 'inspect_salary',
        title: '年薪',
    },
    // {
    //     value: 'inspect_job_state',
    //     title: '工作状态',
    // },
    // {
    //     value: 'inspect_industry',
    //     title: '行业',
    // },
    // {
    //     value: 'inspect_position',
    //     title: '职能',
    // },
    // {
    //     value: 'inspect_experience',
    //     title: '项目经历',
    // },
    {
        value: 'inspect_project',
        title: '工作经历',
    },
    {
        value: 'inspect_educations',
        title: '教育经历',
    }
];
let statusData =[
    {
        value: 1,
        title: '解析错误',
    },
    {
        value: 2,
        title: '已解决',
    },
    {
        value: 3,
        title: '不解决',
    },
    {
        value: 4,
        title: '暂缓',
    }
]
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
            };
            console.log(values)
           
            that.props.searchFuc(values);
        });
    };
    setStateData = (num, name) => {
        const numa = num;
        const key = name;
        this.setState({
          [key]: numa
        })
      }
    renderSimpleForm() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
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
                    <Col md={6} sm={24}>
                        <Form.Item label="请选择有问题选项">
                        {getFieldDecorator('field')(
                            <TreeSelect
                            treeData={selectData}
                            placeholder="Please select"
                            allowClear
                            treeNodeFilterProp="value"
                            />
                        )}
                        </Form.Item>
                    </Col>
                    <Col md={6} sm={24}>
                        <Form.Item label="请选择标记状态">
                        {getFieldDecorator('state')(
                            <TreeSelect
                            treeData={statusData}
                            placeholder="Please select"
                            allowClear
                            treeNodeFilterProp="value"
                            />
                        )}
                        </Form.Item>
                    </Col>
                    <div style={{ overflow: 'hidden' }}>
                        <span className={styles.submitButtons} style={{ float: 'right', marginBottom: 24 }}>
                            <Button type="primary" htmlType="submit">
                                查询
                    </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                    </Button>
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
                    <Col md={6} sm={24}>
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
                </Row>
             
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">
                            查询
            </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                            重置
            </Button>
                        
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

