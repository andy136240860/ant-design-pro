import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';

import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  message,
  Tabs,
  Timeline,
  Dropdown,
  Menu,
  Icon,
} from 'antd';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import styles from './processModel.less';
import { processCon } from '../../../utils/processConfig';
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
function color() {
  var color = '';
  var colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
  for (var i = 0; i < 6; i++) {
    var n = Math.ceil(Math.random() * 15);
    color += '' + colors[n];
    if (i == 5) {
      return '#' + color;
    }
  }
}

function addByTransDate(dateParameter, num) {
  var translateDate = '',
    dateString = '',
    monthString = '',
    dayString = '';
  translateDate = dateParameter.replace('-', '/').replace('-', '/');
  var newDate = new Date(translateDate);
  newDate = newDate.valueOf();
  newDate = newDate + num * 24 * 60 * 60 * 1000; //备注 如果是往前计算日期则为减号 否则为加号
  newDate = new Date(newDate);
  //如果月份长度少于2，则前加 0 补位
  if ((newDate.getMonth() + 1).toString().length == 1) {
    monthString = 0 + '' + (newDate.getMonth() + 1).toString();
  } else {
    monthString = (newDate.getMonth() + 1).toString();
  }
  //如果天数长度少于2，则前加 0 补位
  if (newDate.getDate().toString().length == 1) {
    dayString = 0 + '' + newDate.getDate().toString();
  } else {
    dayString = newDate.getDate().toString();
  }
  dateString = newDate.getFullYear() + '-' + monthString + '-' + dayString;
  return dateString;
}
@Form.create()
@connect(({ resumelist, loading }) => ({
  resumelist,
  loading: loading.models.rule,
}))
export default class SettingProjectResumeRemarkModel extends React.Component {
  static contextTypes = {
    projectId: PropTypes.number,
    baseId: PropTypes.number,
    statusData: PropTypes.oneOfType(PropTypes.arrayOf, PropTypes.object),
    mindate: PropTypes.oneOfType(PropTypes.object, PropTypes.string),
    maxdate: PropTypes.oneOfType(PropTypes.object, PropTypes.string),
    refreshFuc: PropTypes.func,
    delFuc: PropTypes.func,
  };

  state = {
    visible: false,
    smallvisible: false,
    confirmLoading: false,
    statusData: [],
    editDetail: false,
    editId: null,
    renderData: {
      status_id: '',
      call: '',
      date: '',
    },
  };

  componentDidMount() {
    const { statusData } = this.props;
    if (statusData && statusData.length >= 1) {
      this.setState({ statusData: this.transformData(statusData) });
    } else {
      this.setState({ statusData: [] });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { statusData } = nextProps;
    if (statusData && statusData.length >= 1) {
      this.setState({ statusData: this.transformData(statusData) });
    } else {
      this.setState({ statusData: [] });
    }
  }

  transformData = statusData => {
    var arr = [];
    var obj = {};
    for (let i = 0; i < statusData.length; i++) {
      arr.push({ date: statusData[i].date.split(' ')[0], info: [] });
    }
    arr = arr.reduce((cur, next) => {
      obj[next.date] ? '' : (obj[next.date] = true && cur.push(next));
      return cur;
    }, []);
    for (let i = 0; i < arr.length; i++) {
      for (let z = 0; z < statusData.length; z++) {
        if (arr[i].date === statusData[z].date.split(' ')[0]) {
          arr[i].info.push(this.switchItem(statusData[z]));
        }
      }
    }
    return arr;
  };

  handelModal = type => {
    let switchtype = type;
    this.props.form.resetFields();
    const that = this;
    this.setState(
      {
        editDetail: false,
        editId: null,
        renderData: {
          status_id: '',
          call: '',
          date: '',
        },
      },
      () => {
        that.setState({
          smallvisible: true,
          switchtype,
        });
      }
    );
  };

  switchItem = item => {
    if (item && item.call) {
      return {
        color: '#D0021B',
        label: `提醒:${item.call}`,
        id: `${item.id}`,
        date: `${item.date}`,
      };
    } else if (item && item.status_id >= 0) {
      const id = item.status_id;
      for (var i = 0; i < processCon.length; i++) {
        if (Number(id) === processCon[i].value) {
          return { ...processCon[i], id: `${item.id}`, date: `${item.date}` };
        }
      }
    }
  };

  viewlineTransform = () => {
    const { statusData } = this.state;
    let data = [];
    // let pickDate = moment(statusData[0].date);
    let pickDate = moment(this.props.mindate);
    // let last = statusData[statusData.length - 1];
    let last = moment(this.props.maxdate);
    // let diff = -pickDate.diff(moment(last.date), 'days');
    let diff = last.diff(pickDate, 'days');
    data.push({ date: this.props.mindate.split(' ')[0], info: [] });
    for (let i = 1; i < diff + 1; i++) {
      const obj = { date: addByTransDate(this.props.mindate, i), info: [] };
      data.push(obj);
    }
    for (let i = 0; i < data.length; i++) {
      for (let a = 0; a < statusData.length; a++) {
        if (data[i].date == statusData[a].date) {
          data[i].info = statusData[a].info.slice(0);
        }
      }
    }
    var firstInfoNode = null;
    var limit = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].info.length > 0) {
        limit.push(i);
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (limit.length > 2) {
        if (data[i].info.length > 0) {
          firstInfoNode = { ...data[i], index: i };
          break;
        }
      }
    }

    for (let i = 0; i < data.length; i++) {
      let liminIndex = limit.length > 0 && limit[limit.length - 1];
      console.log(liminIndex);
      if (firstInfoNode) {
        if (i < firstInfoNode.index) {
          data[i].showLine = false;
        } else if (i >= firstInfoNode.index && i < liminIndex) {
          data[i].showLine = true;
        } else if (i >= liminIndex) {
          // TODO:限制最后一个线是否显示
          data[i].showLine = true;
        }
      } else {
        data[i].showLine = false;
      }
    }
    for (let i = 0; i < data.length; i++) {
      let statusArray = [];
      let allArray = [];
      let item = data[i];
      if (item.info && item.info.length > 0) {
        item.info.filter((ite, inde) => {
          if (ite.value >= 0) {
            statusArray.push(ite);
          }
        });
        allArray = statusArray.slice(0);
        item.info.filter((ite, inde) => {
          if (!ite.value) {
            allArray.push(ite);
          }
        });
      }
      data[i].statusArray = statusArray.slice(0);
      data[i].allArray = allArray.slice(0);
    }

    let isWholeColor = null;
    for (let a = 0; a < data.length; a++) {
      if (data[a].allArray.length > 0) {
        isWholeColor = data[a].allArray[0].color;
        data[a].isWholeColor = isWholeColor;
      } else {
        data[a].isWholeColor = isWholeColor;
      }
    }
    console.log(data);
    const width = 900 / data.length;
    let n = 0;
    data.map((item, index) => {
      if (item.info && item.info.length > 0) {
        if (index != n) {
          if (width * (index - n) > 50) {
            n = index;
            item.showFonts = true;
          } else {
            // item.date = '';
            item.showFonts = false;
          }
        } else {
          n = index;
          item.showFonts = true;
        }
      } else {
        // item.date = '';
        item.showFonts = false;
      }
    });
    return data;
  };

  viewline = () => {
    const { statusData } = this.state;
    if (!statusData || statusData.length == 0) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          添加
        </div>
      );
    }
    let data = this.viewlineTransform();
    const width = 900 / data.length;
    return (
      <div className={styles.linelist}>
        {data.map((item, index, array) => {
          let menu = (
            <Menu>
              <Menu.Item>
                <div style={{ textAlign: 'center', fontWeight: '400' }}> {item.date}</div>
              </Menu.Item>
              {item.info.map((ite, inde) => {
                return (
                  <Menu.Item keys={inde}>
                    <span style={{ color: `${(ite && ite.color) || ''}` }}>
                      {ite.date.split(' ')[1]} {ite.label}
                    </span>
                  </Menu.Item>
                );
              })}
            </Menu>
          );

          const { statusArray, allArray, isWholeColor } = item;
          return (
            <div keys={index} className={styles.box} style={{ width: `${width}px` }}>
              {item && item.showFonts ? (
                <div className={styles.top}>
                  {(statusArray && statusArray[0] && statusArray[0].label) || allArray[0].label}
                </div>
              ) : null}
              <div className={styles.middle}>
                {item && item.info && item.info.length > 0 ? (
                  <Dropdown overlay={menu}>
                    {allArray.length <= 1 ? (
                      <div
                        className={styles.itempoint}
                        style={{
                          background: `${
                            item &&
                            item.info &&
                            item.info.length > 0 &&
                            allArray &&
                            allArray.length > 0
                              ? `${allArray[0].color}`
                              : ''
                          }`,
                        }}
                      />
                    ) : (
                      <div>
                        {allArray.slice(0, 2).map((it, ide) => {
                          return (
                            <div
                              className={styles.itempoint}
                              style={{
                                background: `${it.color}`,
                                top: `${-(3 * ide) + 20}px`,
                                zIndex: `${ide + 1}`,
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </Dropdown>
                ) : null}{' '}
                {!item.showLine || index == array.length - 1 ? null : (
                  <div
                    className={styles.line1px}
                    style={{ background: `${item && item.showLine ? `${isWholeColor}` : ''}` }}
                  />
                )}
              </div>
              {item && item.showFonts ? (
                <div
                  className={styles.bottom}
                  style={
                    {
                      // left: `-${width}px`,
                    }
                  }
                >
                  {item.date.split('-')[1]}-{item.date.split('-')[2]}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handelModalok = () => {
    const { dispatch, form } = this.props;
    const { renderData, editDetail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const data = {
        ...fieldsValue,
        status_id: fieldsValue.status_id >= 0 ? fieldsValue.status_id : null,
        date: moment(fieldsValue.date._d).format('YYYY-MM-DD HH:mm:ss'),
        id: this.state.editId,
      };
      this.handleReset(data);
      form.resetFields();
    });
  };
  handleReset = fieldsValue => {
    const { dispatch, projectId, baseId } = this.props;
    const { switchtype, editDetail } = this.state;
    const that = this;
    var arr = null;
    if (!editDetail) {
      arr = [];
      arr.push(baseId);
    } else {
      arr = baseId;
    }
    const data = { ...fieldsValue, proid: projectId, baseid: arr };
    if (!editDetail) {
      if (switchtype == 1) {
        dispatch({
          type: 'resumelist/addstatus',
          payload: data,
          callback: () => {
            this.setState({ smallvisible: false });
            that.props.refreshFuc();
            // if (data.call) {
            //   dispatch({
            //     type: 'resumelist/addcall',
            //     payload: data,
            //       callback: () => {
            //         console.log(123123)
            //         that.props.refreshFuc();
            //         console.log(123123)
            //     },
            //   });
            // }
          },
        });
      } else if (switchtype == 2) {
        dispatch({
          type: 'resumelist/addcall',
          payload: data,
          callback: () => {
            this.setState({ smallvisible: false });
            this.props.refreshFuc();
          },
        });
      }
    } else {
      if (switchtype == 1) {
        dispatch({
          type: 'resumelist/upstatus',
          payload: data,
          callback: () => {
            this.setState({ smallvisible: false });
            that.props.refreshFuc();
            // if (data.call) {
            //   dispatch({
            //     type: 'resumelist/addcall',
            //     payload: data,
            //       callback: () => {
            //         console.log(123123)
            //         that.props.refreshFuc();
            //         console.log(123123)
            //     },
            //   });
            // }
          },
        });
      } else if (switchtype == 2) {
        dispatch({
          type: 'resumelist/upcall',
          payload: data,
          callback: () => {
            this.setState({ smallvisible: false });
            this.props.refreshFuc();
          },
        });
      }
    }
  };

  handleEdit = data => {
    var data = data;
    this.props.form.resetFields();
    let isCall = data.value >= 0 ? 1 : 2;
    const that = this;
    this.setState({ renderData: data, editDetail: true, editId: data.id }, () => {
      that.setState({ smallvisible: true, switchtype: isCall });
    });
  };

  handleDel = data => {
    const { projectId: proId, baseId: baseId, delFuc } = this.props;
    const isCall = data.value >= 0 ? 'status' : 'call';

    delFuc(isCall, proId, baseId, data.id);
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handelModalCancel = () => {
    const { form } = this.props;
    const that = this;
    form.resetFields();
    this.setState(
      {
        renderData: {},
      },
      () => {
        that.setState({
          editDetail: false,
          editId: null,
          smallvisible: false,
        });
      }
    );
  };
  renderMain = () => {
    const { statusData } = this.state;
    if (statusData && !statusData.length) {
      return <div>快来添加一个吧</div>;
    }
    return (
      <Timeline>
        {statusData.map((item, index) => {
          var Color = item.info[0].color;
          return (
            <Timeline.Item color={Color} key={index}>
              <div>
                {item.date}
                {item.info.map((ite, inde) => {
                  return (
                    <div key={inde}>
                      <p style={{ color: `${ite.color}` }}>
                        {ite.date.split(' ')[1]}&nbsp;&nbsp;
                        <span>{ite.label}</span>
                      </p>
                      <div style={{ textAlign: 'right' }}>
                        <a onClick={() => this.handleEdit(ite)}>编辑</a>
                        <a>/</a>
                        <a onClick={() => this.handleDel(ite)}>删除</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  };

  render() {
    const {
      visible,
      confirmLoading,
      smallvisible,
      switchtype,
      editDetail,
      statusData,
      renderData,
    } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    if (!statusData) {
      return null;
    }
    return (
      <div style={{ height: '60px' }}>
        <Fragment>
          <a onClick={this.showModal} style={{ display: 'block', width: '100%', height: '100%' }}>
            {this.viewline()}
          </a>
          <Modal
            title="流程详情页"
            visible={visible}
            footer={null}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            {this.renderMain()}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="primary" ghost onClick={() => this.handelModal(1)}>
                添加状态
              </Button>
              <Button type="primary" ghost onClick={() => this.handelModal(2)}>
                添加提醒
              </Button>
            </div>
            <Form layout="vertical">
              <Modal
                title={`${editDetail ? '编辑' : '添加'} ：${switchtype == 1 ? '状态' : '提醒'}`}
                visible={smallvisible}
                onOk={this.handelModalok}
                confirmLoading={confirmLoading}
                onCancel={this.handelModalCancel}
              >
                {switchtype == 1 ? (
                  <FormItem label="状态">
                    {getFieldDecorator('status_id', {
                      initialValue: renderData.value >= 0 ? Number(renderData.value) : null,
                      rules: [{ required: switchtype == 1, message: '请选择流程状态' }],
                    })(
                      <Select style={{ width: '100%' }}>
                        {processCon.map(item => {
                          return <option value={item.value}>{item.label}</option>;
                        })}
                      </Select>
                    )}
                  </FormItem>
                ) : null}
                {switchtype == 2 ? (
                  <FormItem label="提醒">
                    {getFieldDecorator('call', {
                      initialValue: renderData.label ? renderData.label.replace('提醒:', '') : null,
                      rules: [{ required: switchtype == 2, message: '请选择是否提醒' }],
                    })(<Input type="textarea" />)}
                  </FormItem>
                ) : null}
                <FormItem label="时间">
                  {getFieldDecorator('date', {
                    initialValue: renderData.date
                      ? moment(renderData.date, 'YYYY-MM-DD HH:mm:ss')
                      : null,
                    rules: [{ required: true, message: '请选择时间' }],
                  })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                </FormItem>
              </Modal>
            </Form>
          </Modal>
        </Fragment>
      </div>
    );
  }
}
