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
    Switch,
} from 'antd';

@connect(({ user, loading }) => ({
    user,
    loading: loading.models.rule,
  }))

export default class EnabledUserSwitch extends React.Component {
    static contextTypes = {
        userinfo: PropTypes.object,
        refreshFuc: PropTypes.func,
    };

    onChange = (checked) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/enableUser',
            payload: {
                id:this.props.userinfo.id,  
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
      

    render() {
        var checked = this.props.userinfo.switch == 1 ?  true : false;
        return (
        <div>
            <Switch defaultChecked onChange={this.onChange} checked = {checked}/>
        </div>
        );
    }
}
  