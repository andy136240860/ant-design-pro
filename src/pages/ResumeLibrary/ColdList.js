import React, {PureComponent, Fragment} from 'react';
import {
    Icon,
    Divider,
    Card,
    Button,
    Popconfirm,
    message,
    Modal,
    Form,
    Input,
    Row,
    Col,
    Radio,
    Select,
    TreeSelect,
    Upload,
    DatePicker,
    Tabs,
} from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import moment from 'moment';
import {heighteducationOptions} from '../../utils/info';
import StandardTable from '@/components/StandardTable';
import {connect} from 'dva';
import styles from './ColdList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

let thispagination = {};
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const AddModal = Form.create()(props => {
    const {TextArea} = Input;
    const RadioGroup = Radio.Group;
    const InputGroup = Input.Group;
    const {MonthPicker} = DatePicker;
    const Option = Select.Option;
    const {form, isShowModal, closeModal, onAddColdListOk, defaultValue} = props;
    const {getFieldDecorator} = form;
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 6},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        },
    };
    const modalRowLayout = {
        sm: 20,
        xs: 20,
    };
    const modalColLayout = {
        sm: 12,
        xs: 20,
    };
    const sex = [{label: '男', value: '1'}, {label: '女', value: '2'}];
    const sonOptions = [
        {value: '无', title: '无'},
        {value: '一胎', title: '一胎'},
        {value: '二胎', title: '二胎'},
        {value: '三胎', title: '三胎'},
        {value: '多胎', title: '多胎'},
    ];
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            onAddColdListOk(fieldsValue);
        });
    };
    console.log()
    return (
        <Modal
            title="添加cold list"
            visible={isShowModal}
            width="1000px"
            onOk={okHandle}
            onCancel={closeModal}
        >
            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="姓名" {...formItemLayout}>
                        {getFieldDecorator('name', {
                            initialValue: defaultValue ? defaultValue.name : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="手机号码" {...formItemLayout}>
                        {getFieldDecorator('phone', {
                            initialValue: defaultValue ? defaultValue.phone : '',
                            rules: [
                                {
                                    message: '手机号不合法!',
                                    pattern: /^1[345678]\d{9}$/,
                                },
                            ],
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="所在公司" {...formItemLayout}>
                        {getFieldDecorator('company', {
                            initialValue: defaultValue ? defaultValue.company : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="性别" {...formItemLayout}>
                        {getFieldDecorator('sex', {
                            initialValue: defaultValue ? defaultValue.sex : '',
                        })(<RadioGroup options={[{label: '男', value: 1}, {label: '女', value: 2}]}/>)}
                    </FormItem>
                </Col>
            </Row>

            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="职位" {...formItemLayout}>
                        {getFieldDecorator('position', {
                            initialValue: defaultValue ? defaultValue.position : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="城市" {...formItemLayout}>
                        {getFieldDecorator('city', {
                            initialValue: defaultValue ? defaultValue.city : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>

            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="邮箱" {...formItemLayout}>
                        {getFieldDecorator('email', {
                            initialValue: defaultValue ? defaultValue.email : '',
                            rules: [
                                {
                                    type: 'email',
                                    message: '邮箱不合法!',
                                },
                            ],
                        })(<Input/>)}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="婚姻状况" {...formItemLayout}>
                        {getFieldDecorator('mary', {
                            initialValue: defaultValue ? defaultValue.mary : '',
                        })(<RadioGroup options={[{label: '已婚', value: 1}, {label: '单身', value: 2}]}/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="子女状况" {...formItemLayout}>
                        {getFieldDecorator('son', {
                            initialValue: defaultValue ? defaultValue.son : '',
                        })(
                            <TreeSelect
                                style={{width: '60%'}}
                                treeData={sonOptions}
                                placeholder="Please select"
                                allowClear
                                treeNodeFilterProp="value"
                            />
                        )}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="学历" {...formItemLayout}>
                        {getFieldDecorator('education', {
                            initialValue: defaultValue ? defaultValue.education : '',
                        })(
                            <TreeSelect
                                style={{width: '60%'}}
                                treeData={heighteducationOptions}
                                placeholder="Please select"
                                allowClear
                                treeNodeFilterProp="value"
                            />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="是否异地" {...formItemLayout}>
                        {getFieldDecorator('is_here', {
                            initialValue: defaultValue ? defaultValue.is_here : '',
                        })(<RadioGroup options={[{label: '是', value: 1}, {label: '否', value: 2}]}/>)}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="来源" {...formItemLayout}>
                        {getFieldDecorator('source', {
                            initialValue: defaultValue ? defaultValue.source : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>
            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="出生年月" {...formItemLayout}>
                        {getFieldDecorator('birth', {
                            initialValue: defaultValue && defaultValue.birth ? moment(defaultValue.birth, 'YYYYMM') : null
                        })(<MonthPicker format="YYYY-MM" placeholder="选择出生年月"/>)}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="籍贯" {...formItemLayout}>
                        {getFieldDecorator('hometown', {
                            initialValue: defaultValue ? defaultValue.hometown : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>

            <Row {...modalRowLayout}>
                <Col {...modalColLayout}>
                    <FormItem label="语言" {...formItemLayout}>
                        {getFieldDecorator('language', {
                            initialValue: defaultValue ? defaultValue.language : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
                <Col {...modalColLayout}>
                    <FormItem label="年薪(万)" {...formItemLayout}>
                        {getFieldDecorator('salary', {
                            initialValue: defaultValue ? defaultValue.salary : '',
                        })(<Input/>)}
                    </FormItem>
                </Col>
            </Row>

            <Row sm={({span: 20}, {offset: 2})} xs={20}>
                <Col sm={({span: 6}, {offset: 2})} xs={24}>
                    <FormItem label="评价" sm={24}/>
                </Col>
            </Row>
            <Row sm={({span: 20}, {offset: 2})} xs={20}>
                <Col sm={({span: 18}, {offset: 2})} xs={20}>
                    {getFieldDecorator('evaluate', {
                        initialValue: defaultValue ? defaultValue.evaluate : '',
                    })(<TextArea rows="2" maxlength="50"/>)}
                </Col>
            </Row>
        </Modal>
    );
});
@connect(({coldList, loading}) => ({
    coldList,
    loading: loading.models.coldList,
}))
export default class ColdList extends PureComponent {
    // state = {
    //     pagination: {
    //         position: 'bottom',
    //         showSizeChanger: true,
    //         showQuickJumper: true,
    //     },
    //     hasData: true,
    //     expandRowByClick: true,
    //     rowKey: 'id',
    //     expandedRowRender: record =>
    //         <p>{record && record.resume && record.resume.length > 0 && record.resume.map((item, index) => (
    //             <a onClick={() => {
    //                 window.open(`${window.location.protocol}//${window.location.host}/resumetablelist/pooldetails/detail/${item.id}/3`)
    //             }} key={index}>{item.base_person_name ? item.base_person_name : `人才库${index}`}&nbsp;&nbsp;</a>))}</p>,
    //     rowSelection: {
    //         key: 'coldList'
    //     },
    //     selectedRows: [],
    //     confirmLoading: false,
    //     isShowModal: false,
    //     listPaginate: parseInt(window.location.hash.slice(1), 0) || 1,
    // };
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [
            { title: 'Tab 1', content: 'Content of Tab Pane 1', key: '1' },
            { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
        ];
        this.state = {
            activeKey: panes[0].key,
            panes,
            pagination: {
                position: 'bottom',
                showSizeChanger: true,
                showQuickJumper: true,
            },
            hasData: true,
            expandRowByClick: true,
            rowKey: 'id',
            expandedRowRender: record =>
                <p>{record && record.resume && record.resume.length > 0 && record.resume.map((item, index) => (
                    <a onClick={() => {
                        window.open(`${window.location.protocol}//${window.location.host}/resumetablelist/pooldetails/detail/${item.id}/3`)
                    }} key={index}>{item.base_person_name ? item.base_person_name : `人才库${index}`}&nbsp;&nbsp;</a>))}</p>,
            rowSelection: {
                key: 'coldList'
            },
            selectedRows: [],
            confirmLoading: false,
            isShowModal: false,
            listPaginate: parseInt(window.location.hash.slice(1), 0) || 1,
        };
    }
    componentDidMount() {
        this.handleStandardTableChange(
            {
                current: this.state.listPaginate,
            },
            {},
            {}
        );
    }

    refreshPage = () => {
        return this.handleStandardTableChange(thispagination, {}, {});
    };
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const {dispatch} = this.props;
        const {formValues} = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = {...obj};
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            current_page: pagination.current || 1,
            page_size: pagination.pageSize || 10,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }
        dispatch({
            type: 'coldList/getCodeLists',
            payload: params,
        }).then(() => {
            window.location.hash = `#${params.current_page}`;
        });
    };
    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };
    deleteManyColdList = () => {
        //删除cold list    一行或多行
        const {dispatch} = this.props;
        const list = this.state.selectedRows;
        let params = null;
        list.map(item => {
            if (params == null) {
                params = item.id;
            } else {
                params += `,${item.id}`;
            }
        });
        if (params == null) {
            message.success('未选择code list');
            return;
        }
        dispatch({
            type: 'coldList/deleteColdList',
            payload: params,
            callback: () => {
                message.success('删除成功');
                this.setState({
                    selectedRows: []
                })
            },
        }).then(res => {
            this.refreshPage();
        });
    };
    addColdList = () => {
        this.setState({
            defaultValue: null,
            isShowModal: true,
        });
    };
    closeModal = () => {
        this.setState({
            defaultValue: null,
            isShowModal: false,
        });
    };
    onAddColdListOk = data => {
        const {dispatch} = this.props;
        if (
            !data.company &&
            !data.education &&
            !data.email &&
            !data.evaluate &&
            !data.is_here &&
            !data.mary &&
            !data.name &&
            !data.source &&
            !data.phone &&
            !data.sex &&
            !data.son &&
            !data.birth &&
            !data.position &&
            !data.city &&
            !data.hometown &&
            !data.salary &&
            !data.language
        ) {
            message.info('请至少填写一项');
            return;
        }
        if (data.birth) {
            data.birth = moment(data.birth._d).format('YYYY-MM-DD');
        } else {
            data.birth = '';
        }
        if (this.state.defaultValue) {
            let defaultValue = this.state.defaultValue;
            data.proid = defaultValue.id;
            dispatch({
                type: 'coldList/editColdList',
                payload: data,
                callback: () => {
                    message.success('编辑成功');
                    this.closeModal();
                },
            }).then(res => {
                this.refreshPage();
            });
        } else {
            dispatch({
                type: 'coldList/coldLists',
                payload: data,
                callback: () => {
                    message.success('添加成功');
                    this.closeModal();
                },
            }).then(res => {
                this.refreshPage();
            });
        }
    };
    confirm = e => {
        const {dispatch} = this.props;
        dispatch({
            type: 'coldList/deleteColdList',
            payload: e,
            callback: () => {
                message.success('删除成功');
            },
        }).then(res => {
            this.refreshPage();
        });
    };
    editColdList = e => {
        const {
            coldList: {getColdList},
        } = this.props;
        if (getColdList && getColdList.list && getColdList.list.length > 0) {
            getColdList.list.map(item => {
                if (item.id === e) {
                    this.setState({
                        defaultValue: item,
                        isShowModal: true,
                    });
                }
            });
        }
    };
    uploadOnChange = file => {
        console.log(file);
        if (file.file.response && file.file.response.data && file.file.status === 'done') {
            message.success('上传成功');
            this.handleStandardTableChange({}, {}, {});
        } else if (file.file.status === 'uploading') {
            message.success('上传中');
        } else if (file.file.status === 'error') {
            message.success('上传失败');
        }
    };



    onChange = activeKey => {
        this.setState({ activeKey });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
        this.setState({ panes, activeKey });
    };

    remove = targetKey => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        this.setState({ panes, activeKey });
    };
    onTabClick=(key)=>{
        console.log(key, this.state.activeKey)
    };
    onEditTab=()=>{
        let active = null;
        this.state.panes.map(item=>{
            if(item.key == this.state.activeKey) {
                active = item;
            }
        });
        if(!active) {
            return;
        }
        this.setState({
            activeTab: active,
            editTabModal: true
        })
    };
    closeTabModal=()=>{
        this.setState({
            editTabModal: false
        })
    };
    renderTabBar=(props, DefaultTabBar)=>{
        console.log(props)
        const children = this.state.panes.map(pane => (
            <Button>
                {pane.title}
            </Button>
        ));
        console.log(children);
        return <Sticky bottomOffset={80}>
            {({ style }) => (
                <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
            )}
        </Sticky>
    };
    render() {
        const state = this.state;
        const {
            loading,
            coldList: {getColdList},
        } = this.props;
        if (getColdList && getColdList.pagination) {
            getColdList.pagination.current = getColdList.pagination.current_page;
            getColdList.pagination.total =
                getColdList.pagination.total_page * getColdList.pagination.page_size;
        }
        if (getColdList && getColdList.list && getColdList.list.length > 0) {
            getColdList.list.map(item => {
                if (item.birth) {
                    item.birth = moment(item.birth).format('YYYY-MM');
                }
            })
        }
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 130,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{record.resume && record.resume.length > 0 ?
                    <Icon type="paper-clip"/> : ' '}&nbsp;{text}</a>,
            },
            {
                title: '手机号码',
                dataIndex: 'phone',
                key: 'phone',
                width: 150,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '所在公司',
                dataIndex: 'company',
                key: 'company',
                width: 220,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '性别',
                key: 'sex',
                dataIndex: 'sex',
                width: 100,
                render: (txt, record) => <a onClick={() => this.editColdList(record.id)}
                                            href="javascript:;">{txt == 1 ? '男' : txt == 2 ? '女' : ''}</a>
            },
            {
                title: '邮箱',
                key: 'email',
                dataIndex: 'email',
                width: 250,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '婚姻',
                key: 'mary',
                dataIndex: 'mary',
                width: 100,
                render: (txt, record) => <a onClick={() => this.editColdList(record.id)}
                                            href="javascript:;">{txt == 1 ? '已婚' : txt == 2 ? '单身' : ''}</a>
            },
            {
                title: '子女',
                key: 'son',
                dataIndex: 'son',
                width: 100,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '学历',
                key: 'education',
                dataIndex: 'education',
                width: 130,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '异地',
                key: 'is_here',
                dataIndex: 'is_here',
                width: 100,
                render: (txt, record) => <a onClick={() => this.editColdList(record.id)}
                                            href="javascript:;">{txt == 1 ? '是' : txt == 2 ? '否' : ''}</a>
            },
            {
                title: '职位',
                key: 'position',
                dataIndex: 'position',
                width: 160,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '城市',
                key: 'city',
                dataIndex: 'city',
                width: 130,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '来源',
                key: 'source',
                dataIndex: 'source',
                width: 150,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '出生年月',
                key: 'birth',
                dataIndex: 'birth',
                width: 160,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            }, {
                title: '籍贯',
                key: 'hometown',
                dataIndex: 'hometown',
                width: 200,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            }, {
                title: '语言',
                key: 'language',
                dataIndex: 'language',
                width: 100,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            }, {
                title: '年薪(万)',
                key: 'salary',
                dataIndex: 'salary',
                width: 150,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '评价',
                key: 'evaluate',
                dataIndex: 'evaluate',
                width: 400,
                render: (text, record) => <a onClick={() => this.editColdList(record.id)}
                                             href="javascript:;">{text}</a>,
            },
            {
                title: '操作',
                key: 'operate',
                dataIndex: 'operate',
                width: 360,
                render: (text, record) => (
                    <div>
                        <Popconfirm
                            title="您确定删除此项吗?"
                            onConfirm={() => this.confirm(record.id)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a href="#">删除</a>
                        </Popconfirm>
                        <a onClick={() => this.editColdList(record.id)} className={styles.mrl15} href="#">
                            编辑
                        </a>
                    </div>
                ),
            },
        ];
        let width = 0;
        columns.map(item => {
            width += item.width;
        });
        const props = {
            action: `${window.apiHost}/api/coldlist/import`,
            onChange: this.uploadOnChange,
            accept: '.xls',
            withCredentials: true,
        };
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>

                    <div className={styles.coldList}>
                        <div className={styles.add_cold_list}>
                            <Button onClick={this.addColdList} icon="plus" type="primary">
                                新建cold list
                            </Button>
                            <Upload {...props}>
                                <Button className={styles.del_cold_row} type="primary">
                                    <Icon type="upload"/>导入cold list
                                </Button>
                            </Upload>
                            {this.state.selectedRows.length > 0 ? (
                                <Popconfirm placement="bottom" onConfirm={this.deleteManyColdList} title="请确认要删除选中项"
                                            okText="确认" cancelText="取消">
                                    <Button
                                        className={styles.del_cold_row_item}
                                        type="danger"
                                    >
                                        删除
                                    </Button>
                                </Popconfirm>
                            ) : null}
                        </div>
                        <div className="tabStyle">
                            <Tabs
                                onChange={this.onChange}
                                activeKey={this.state.activeKey}
                                type="editable-card"
                                onEdit={this.onEdit}
                                onTabClick={this.onTabClick}
                                tabBarStyle={{alignItem: 'center'}}
                                tabBarExtraContent={<Button
                                    icon="ellipsis"
                                    onClick={this.onEditTab}
                                    style={{marginLeft: '10px',position: 'relative', top: '-4px'}}
                                >设置</Button>}
                            >
                                {this.state.panes.map(pane => (
                                    <TabPane tab={pane.title} key={pane.key}>
                                        <StandardTable
                                            {...this.state}
                                            scroll={{x: width, y: '100%'}}
                                            loading={loading}
                                            data={getColdList ? getColdList : {list: [], paginate: {}}}
                                            onSelectRow={this.handleSelectRows}
                                            columns={columns}
                                            onChange={this.handleStandardTableChange}
                                        />
                                    </TabPane>
                                ))}
                            </Tabs>
                        </div>
                    </div>
                </Card>
                <AddModal
                    {...this.state}
                    onAddColdListOk={this.onAddColdListOk}
                    closeModal={this.closeModal}
                />
                <EditTab
                    {...this.state}
                    closeTabModal={this.closeTabModal}
                />
            </PageHeaderWrapper>
        );
    }
}
const EditTab = Form.create()(props=>{
    const {form, activeTab, editTabModal, closeTabModal} = props;
    const {getFieldDecorator} = form;
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 6},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        },
    };
    return (
        <Modal
            title={`修改${activeTab&&activeTab.title}`}
            visible={editTabModal}
            width="1000px"
            // onOk={okHandle}
            onCancel={closeTabModal}
        >
            {
                !activeTab ? null :
                    <div>
                        <FormItem label="名称" {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入名称'}],
                                initialValue: activeTab.title
                            })(<Input/>)}
                        </FormItem>
                    </div>
            }

        </Modal>
    )
});