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
                        <FormItem label="项目名称">
                            {getFieldDecorator('proName')(
                                <Input
                                    style={{ width: '100%' }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <Form.Item label="公司名称">
                     
                           {getFieldDecorator('comName')(
                            <Input
                                style={{ width: '100%' }}
                            />
                        
                        )}
                        </Form.Item>
                    </Col>
                    <Col md={6} sm={24}>
                        <Form.Item label="城市">
                        {getFieldDecorator('cityName')(
                        
                                <Input
                                    style={{ width: '100%' }}
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

