import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './view.less';

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
} from 'antd';
import Ellipsis from '@/components/Ellipsis';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;

// 个人基本信息一些配置
import {
    routerMap,
    fieldLabels,
    industryData,
    countryOptions,
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
@connect(({ rule, resumedetail, loading }) => ({
    resumedetail,
    saving: loading.effects['resumedetail/save'],
    updateResuming: loading.effects['resumedetail/updateResume'],
    postEvaluating: loading.effects['resumedetail/postEvaluate'],
    postReporting: loading.effects['resumedetail/postReport'],

}))
@Form.create()
export default class Detail extends PureComponent {
    state = {
        list: [
        ],
        eduData: [
        ],
        proData: [],
        trainData: [],
        visible: false,
        drawerData: {
            isopenphone: 2,
            isopenwchat: 2,
            isopenname: 2,
            remark: '',
        },
    };
    initialRemark = '';
    componentWillMount() { }
    componentWillMount() { }
    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        if (params.id) {
            this.fetchInfo(params.id);
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
            var cityhope = renderData.base_person_city_hope ? renderData.base_person_city_hope : [];
            var position = renderData.base_person_position ? renderData.base_person_position : [];
            var industry = renderData.base_person_industry ? renderData.base_person_industry : [];
            let values = {
                base_person_name: '***',
                base_person_phone: '***********',
                sex: renderData.base_person_sex > 0 ? renderData.base_person_sex.toString() : '',
                wchat: '***',
                email: '***',
                rr: renderData.base_person_rr || '',
                worktime: renderData.base_person_work_time
                    ? `${myDate.getFullYear() - renderData.base_person_work_time}`
                    : '',
                age: renderData.base_person_age
                    ? `${myDate.getFullYear() - renderData.base_person_age}`
                    : '',

                jobstate: renderData.base_person_job_state || '',
                linkedin: '***',
                personal: '***',
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
            const list = renderData.experience ? initaialListData(renderData.experience) : [];
            const eduData = renderData.education ? initaialEduData(renderData.education) : [];
            const proData = renderData.project ? initaialProData(renderData.project) : [];
            const trainData = renderData.train ? initaialTraData(renderData.train) : [];

            that.setState({
                list,
                eduData,
                proData,
                trainData,
                cityhope,
                position,
                industry
            });
            setFieldsValue(values);
        } else {
            message.error(`${responses[0].status}:${responses[0].msg}`)
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
            message.error(`${responses[1].status}:${responses[1].msg}`)
        }
    };

    onView = () => {
        const {
            form: { setFieldsValue },
            match: { params },
            dispatch
        } = this.props;
        const id = params.id;
        const that = this;
        dispatch({
            type: 'resumedetail/getLink',
            payload: {
                base_id: id
            },
            callback: function (response) {
                if (response.status == 0) {
                    let renderData = response.data;
                    that.props.form.resetFields();
                    that.setState({

                        cityhope: [],
                        position: [],
                        industry: [],
                        list: [],
                        eduData: [],
                        proData: [],
                        trainData: [],
                    });
                    var myDate = new Date();
                    var cityhope = renderData.base_person_city_hope ? renderData.base_person_city_hope : [];
                    var position = renderData.base_person_position ? renderData.base_person_position : [];
                    var industry = renderData.base_person_industry ? renderData.base_person_industry : [];

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
                    const list = renderData.experience ? initaialListData(renderData.experience) : [];
                    const eduData = renderData.education ? initaialEduData(renderData.education) : [];
                    const proData = renderData.project ? initaialProData(renderData.project) : [];
                    const trainData = renderData.train ? initaialTraData(renderData.train) : [];

                    that.setState({
                        list,
                        eduData,
                        proData,
                        trainData,
                        cityhope,
                        position,
                        industry
                    });
                    setFieldsValue(values);
                } else {
                    message.error(`${response.status}:${response.msg}`)
                }

            }
        })
    }

    render() {
        return (
            // Industry
            <PageHeaderWrapper title='查看详情'>
                <Form layout="vertical">
                    <Affix offsetTop={10} style={{background:'#fff',paddingTop:'20px'}}>

                        <Row justify="end" >
                            {/* <Col xxl={{span:17}} xl={{span:14}} lg={{span:10}} md={{span:24}} sm={{span:24}} xs={{span:24}}    style={{ background: '#fff' }}>
                                <div className={styles.drawderCheckbox}>
                                    <CheckboxGroup
                                        options={drawerOptions}
                                        defaultValue={['隐藏姓名', '隐藏手机号', '隐藏微信号']}
                                        onChange={this.onDrawerChange}
                                    />
                                </div>
                            </Col> */}
                            <Col xxl={{span:7, push: 20}} xl={{span:10, push: 20}} lg={{span:10, push: 20}} md={{span:24, push: 20}} sm={{span:24, push: 20}} xs={{span:24 ,push:20}} >
                            <    Button type="primary" style={{ marginRight: '20px', marginLeft: '20px' }} onClick={this.onSubmmit}>
                                    提交评价
                                </Button>
                                {/* // <Button type="primary" onClick={this.showDrawer}>
                                //     生成报告
                                // </Button>
                                // <Button type="primary" style={{ marginRight: '20px', marginLeft: '20px' }} onClick={this.onSubmmit}>
                                //     提交评价
                                // </Button>
                                // <Button type="primary" onClick={this.onView}>
                                //     点击查看联系方式
                                // </Button> */}
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col xs={{span:23 }} style={{background:'#fff'}}>
                                <div style={{color:'#faad14',fontSize:"14px",textAlign:'right',paddingTop:'20px',paddingBottom:'20px'}}>
                                    {this.state.requiredTurn && !this.state.requiredTurn.pass ? this.state.requiredTurn.string : null}
                                </div>
                            </Col>
                        </Row> */}
                    </Affix>
                    {/**基本信息*/}
                    {this.renderBasicInfo()}
                    {/**工作经历*/}
                    {
                        this.state.list && this.state.list.length > 0 ? this.renderWork() : null
                    }
                    {
                        this.state.eduData && this.state.eduData.length > 0 ? this.renderEdu() : null
                    }
                    {
                        this.state.proData && this.state.proData.length > 0 ? this.renderPro() : null
                    }
                    {
                        this.state.trainData && this.state.trainData.length > 0 ? this.renderTrain() : null
                    }

                </Form>
                {this.renderDrawer()}
            </PageHeaderWrapper>
        );
    }
    showDrawer = e => {
        const data = this.props.form.getFieldsValue();
        const { list, eduData } = this.state;
        const newData = {
            ...data,
            experience: list,
            education: eduData,
        }
        const requiredTurn = checkRequired(newData);
        this.setState({
            requiredTurn
        })
        this.setState({
            requiredTurn,
        });

        if (requiredTurn && requiredTurn.pass) {

            this.handleSubmitReport(e);

        }
    };
    handleSubmitReport = e => {
        const { drawerData } = that.state;
        const {
            dispatch,
            match: { params },
        } = this.props;
        const { id: detailId } = params;
        dispatch({
            type: 'resumedetail/postReport',
            payload: {
                baseid: detailId,
                eval: drawerData.remark,
                ...drawerData,
                proid: projectInfo.projectId,
            },
            callback: function (response) {
                if (response.status == 0) {
                    const data = response.data;
                    that.setState({
                        visible: true,
                        reportBackUrl: data.url,
                        reportCode: data.resume_code,
                    });
                } else {
                    message.error(`${response.status}:${response.msg}`)
                }
            }
        })
    }
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
                {this.state.reportBackUrl ? <Iframe src={`${this.state.reportBackUrl}`} /> : null}


            </Drawer>
        );
    };
    onSubmmit = () => {
        const {
            dispatch,
            match: { params },
        } = this.props;
        const { remark } = this.state;
        const { id: detailId } = params;

        const that = this;
        if (that.initialRemark != remark) {
            dispatch({
                type: 'resumedetail/postEvaluate',
                payload: { base_id: detailId, eval: remark },
                callback: function (response) {
                    if (response.status == 0) {
                        message.success(`保存成功`)
                    } else {
                        message.error(`${response.status}:${response.msg}`)
                    }
                }
            })
        }


    }
    // 基本信息、评价
    renderBasicInfo() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Row gutter={16} align="top">
                <Col lg={16} md={16} sm={24}>
                    <Card title="基础信息" className={styles.card} bordered={false}>
                        <Row gutter={16}>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.base_person_name}>
                                    {getFieldDecorator('base_person_name')(
                                        <Input disabled={true} className={styles.view} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.base_person_phone}>
                                    {getFieldDecorator('base_person_phone')(<Input disabled={true} className={styles.view} />)}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.sex}>
                                    {getFieldDecorator('sex')(
                                        <TreeSelect
                                            treeData={sexData}
                                            allowClear
                                            treeNodeFilterProp="value"
                                            className={styles.view}
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.wechat}>
                                    {getFieldDecorator('wchat')(
                                        <Input className={styles.view} disabled={true} className={styles.view} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item
                                    label={fieldLabels.email}
                                >
                                    {getFieldDecorator('email', {
                                        rules: [{ validator: handleCheckMail }],
                                    })(<Input className={styles.view} disabled={true} className={styles.view} />)}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item
                                    label={fieldLabels.country}
                                >
                                    {getFieldDecorator('country')(
                                        <TreeSelect
                                            treeData={countryOptions}
                                            className={styles.view}
                                            allowClear
                                            treeNodeFilterProp="value"
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item
                                    label={fieldLabels.heighteducation}
                                >
                                    {getFieldDecorator('heighteducation')(
                                        <TreeSelect
                                            treeData={heighteducationOptions}
                                            className={styles.view}
                                            allowClear
                                            treeNodeFilterProp="value"
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.education}>
                                    {getFieldDecorator('education')(<Input className={styles.view} disabled={true} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.rr}>
                                    {getFieldDecorator('rr')(
                                        <TreeSelect
                                            treeData={rroptions}
                                            className={styles.view}
                                            allowClear
                                            treeNodeFilterProp="value"
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.industry}>
                                    <span className={styles.viewCityhope}>
                                        <span className={styles.span}>
                                            <ul>
                                                {this.state.industry && this.state.industry.length > 1 ?
                                                    this.state.industry.map((item) => {

                                                        return (
                                                            <li>{item.label}</li>
                                                        )
                                                    })
                                                    : null
                                                }

                                            </ul>
                                        </span>
                                    </span>
                                </Form.Item>
                            </Col>

                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.position}>
                                    <span className={styles.viewCityhope}>
                                        <span className={styles.span}>
                                            <ul>
                                                {this.state.position && this.state.position.length > 1 ?
                                                    this.state.position.map((item) => {

                                                        const newItem = item.split(',');
                                                        return (
                                                            <li>{newItem[0]}/{newItem[1]}</li>
                                                        )
                                                    })
                                                    : null
                                                }

                                            </ul>
                                        </span>
                                    </span>
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item
                                    label={fieldLabels.citynow}
                                >
                                    {getFieldDecorator('citynow')(
                                        <TreeSelect
                                            treeData={geocity}
                                            className={styles.view}
                                            showSearch
                                            allowClear
                                            treeNodeFilterProp="title"
                                            labelInValue
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.cityhope}
                                >

                                    <span className={styles.viewCityhope}>
                                        <span className={styles.span}>
                                            <ul>
                                                {this.state.cityhope && this.state.cityhope.length > 1 ?
                                                    this.state.cityhope.map((item) => {
                                                        return (
                                                            <li>{item.label}</li>
                                                        )
                                                    })
                                                    : null
                                                }

                                            </ul>
                                        </span>
                                    </span>

                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.age}>
                                    {getFieldDecorator('age', {
                                        rules: [{ validator: handleCheckNum }],
                                    })(
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={0}
                                            className={styles.view}
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item
                                    label={fieldLabels.worktime}
                                >
                                    {getFieldDecorator('worktime', {
                                        rules: [{ validator: handleCheckNum }],
                                    })(
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={0}
                                            className={styles.view}
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.salary}>
                                    {getFieldDecorator('salary', {
                                        rules: [{ validator: handleCheckNum }],
                                    })(
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={0}
                                            className={styles.view}
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.salarypm}>
                                    {getFieldDecorator('salarypm')(
                                        <Input className={styles.view} disabled={true} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.jobstate}>
                                    {getFieldDecorator('jobstate')(
                                        <TreeSelect
                                            treeData={workChangeData}
                                            className={styles.view}
                                            allowClear
                                            treeNodeFilterProp="value"
                                            disabled={true}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.linkedin}>
                                    {getFieldDecorator('linkedin')(
                                        <Input className={styles.view} disabled={true} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {...formItemLayout.inputCol}>
                                <Form.Item label={fieldLabels.personal}>
                                    {getFieldDecorator('personal')(
                                        <Input className={styles.view} disabled={true} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col lg={8} md={8} sm={24}>
                    <Card title="评价" bordered={false} className={styles.card}>
                        <TextArea
                            className={styles.remark}
                            value={this.state.remark || ''}
                            onChange={this.onSaveRemark}
                        />
                        <div>
                            <div className="demo-infinite-container">
                                <List
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
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        );
    }
    onSaveRemark = e => {
        this.setState({
            ...this.state,
            remark: e.target.value,
        });
    };
    renderTrain() {
        const {
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
                        <List.Item>
                            <div style={{ width: '100%' }}>
                                <Row gutter={16}>
                                    <Col {...formItemLayout.labelTrCol}>
                                        <Form.Item label={'培训机构'}>
                                            <Input
                                                className={styles.view}
                                                name="name"
                                                value={`${item.name}`}
                                                disabled={true}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col {...formItemLayout.labelTrCol}>
                                        <Form.Item label={'证书名称'}>
                                            <Input
                                                className={styles.view}
                                                value={`${item.certname}`}
                                                name="certname"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col {...formItemLayout.labelTrCol}>
                                        <Form.Item label={'时间'}>
                                            {item.starttime && item.endtime ? <div style={{ width: '100%' }} className={styles.viewTimeInput} >{item.starttime}~{item.endtime}</div> : (
                                                <div>
                                                    {getFieldDecorator(`${'trainTime' + index}`)(
                                                        <RangePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD" />
                                                    )}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24}>
                                        <div className="page-edit-textarea">
                                            <Form.Item label={'描述'}>
                                                <TextArea
                                                    rows={4}
                                                    className={styles.view}
                                                    name="describe"
                                                    value={`${item.describe}`}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </List.Item>
                    )}
                />

            </Card>
        );
    }
    renderWork() {
        const {
            form: { getFieldDecorator },
            loading,
        } = this.props;
        return (
            <Card title="工作经历" bordered={false} style={{ marginTop: 24 }} className={styles.card}>
                <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    dataSource={this.state.list}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div style={{ width: '100%' }}>

                                <Row gutter={24}>
                                    <Col {...formItemLayout.labelTrCol}>
                                        <Form.Item label={'公司名字'}>
                                            <Input
                                                className={styles.view}
                                                value={`${item.company}`}
                                                disabled={true} />
                                        </Form.Item>
                                    </Col>
                                    <Col {...formItemLayout.labelTrCol}>
                                        <Form.Item label={'职位'}>
                                            <Input
                                                className={styles.view}
                                                value={`${item.position}`}
                                                disabled={true} />
                                        </Form.Item>
                                    </Col>
                                    <Col {...formItemLayout.labelTrCol}>
                                        <Form.Item label={'时间'}>
                                            {item.starttime && item.endtime ? <div style={{ width: '100%' }} className={styles.viewTimeInput} >{item.starttime}~{item.endtime}</div> : (
                                                <div>
                                                    {getFieldDecorator(`${'workTime' + index}`)(
                                                        <RangePicker style={{ width: '100%' }} className={styles.view} showTime format="YYYY-MM-DD" disabled={true} />
                                                    )}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <div className="page-edit-textarea">
                                            <Form.Item label={'职责描述'}>
                                                <TextArea
                                                    autosize
                                                    className={styles.view}
                                                    value={`${item.describe}`}
                                                    disabled={true}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </List.Item>
                    )}
                />

            </Card>
        );
    }

    renderEdu() {
        const {
            form: { getFieldDecorator },
            loading,
        } = this.props;

        return (
            <Card title="教育经历" bordered={false} style={{ marginTop: 24 }} className={styles.card}>
                <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    dataSource={this.state.eduData}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div style={{ width: '100%' }}>

                                <Row gutter={16}>
                                    <Col {...formItemLayout.labelFCol}>
                                        <Form.Item label={'学校名字'}>
                                            <Input
                                                className={styles.view}
                                                disabled={true}
                                                value={`${item.school}`}

                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col {...formItemLayout.labelFCol}>
                                        <Form.Item label={'时间'}>
                                            {item.starttime && item.endtime ? <div style={{ width: '100%' }} className={styles.viewTimeInput} >{item.starttime}~{item.endtime}</div> : (
                                                <div>
                                                    {getFieldDecorator(`${'eduTime' + index}`)(
                                                        <RangePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD" disabled={true} />
                                                    )}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col {...formItemLayout.labelFCol}>
                                        <Form.Item label={'学历'}>
                                            <select
                                                value={`${item.education}`}
                                                disabled={true}
                                                className={styles.viewSlect}
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
                                                className={styles.viewSlect}
                                                disabled={true}
                                                value={`${item.major}`}
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
                                                    disabled={true}
                                                    value={`${item.describe}`}
                                                    className={styles.viewSlect}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </List.Item>
                    )}
                />

            </Card>
        );
    }
    renderPro() {
        const {
            form: { getFieldDecorator },
            loading,
        } = this.props;
        return (
            <Card title="项目经历" bordered={false} style={{ marginTop: 24 }} className={styles.card}>
                <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    dataSource={this.state.proData}
                    renderItem={(item, index) => (
                        <List.Item
                        >
                            <div style={{ width: '100%' }}>
                                <Row gutter={16}>
                                    <Col {...formItemLayout.labelTwCol}>
                                        <Form.Item label={'项目名称'}>
                                            <Input
                                                className={styles.viewSlect}
                                                value={`${item.name}`}
                                                disabled={true}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col {...formItemLayout.labelTwCol}>
                                        <Form.Item label={'时间'}>
                                            {item.starttime && item.endtime ? <div style={{ width: '100%' }} className={styles.viewTimeInput} >{item.starttime}~{item.endtime}</div> : (
                                                <div>
                                                    {getFieldDecorator(`${'proTime' + index}`)(
                                                        <RangePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD" disabled={true} />
                                                    )}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24}>
                                        <div className="page-edit-textarea">
                                            <Form.Item label={'描述'}>
                                                <TextArea
                                                    autosize
                                                    className={styles.viewSlect}
                                                    disabled={true}
                                                    value={`${item.describe}`}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </List.Item>
                    )}
                />

            </Card>
        );
    }

}
