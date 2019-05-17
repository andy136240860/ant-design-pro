import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Dropdown,
  Icon,
  Badge
} from 'antd';

export default class selectItem extends PureComponent {
  static contextTypes = {
    data: PropTypes.object,
    refreshState: PropTypes.func,
    refreshFunc: PropTypes.func,
    keyname: PropTypes.string,
  };

  state = {
    visible: false,
  };

  handleMenuClick = (e) => {
    const { dispatch } =this.props;
    const name =e.domEvent.currentTarget.getAttribute('data-name');
    console.log(e.domEvent.currentTarget)
    if (e.item.props.status >=0) {
      if(this.props.refreshFunc){
          dispatch({
          type: 'resumelist/changeStatus',
          payload: {
            proid: this.props.project.id,
            state : e.item.props.status,
          },
        }).then(() => {
          console.log(this.props.project.id)
          console.log(e.item.props.status)
          this.props.refreshFunc( this.props.project.id, e.item.props.status);
        });
        this.props.refreshFunc();
      return
      }
      this.props.refreshState(e.item.props.status,name);
    }
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }


  menuTitle = (data) => {
    switch(Number(data)) {
      case 0:   return "正常"; 
      case 1:   return "错误";
      case 2:   return "已解决";
      case 3:   return "不解决";
      case 4:   return "暂缓";
    }
  }

  menuStatus = (data) => {
    // 'success' | 'processing' | 'default' | 'error' | 'warning';
    switch(Number(data)) {
      case 0:  return "default"; 
      case 1:  return "error";
      case 2:  return "success";
      case 3:  return "default";
      case 4:  return "processing";
      default:  return "default";
    }
  }
  componentWillMount() {

  }
  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item status="0" data-name={`${this.props.keyname}`}>正常</Menu.Item>
        <Menu.Item status="1" data-name={`${this.props.keyname}`}>错误</Menu.Item>
        <Menu.Item status="2" data-name={`${this.props.keyname}`}>已解</Menu.Item>
        <Menu.Item status="3" data-name={`${this.props.keyname}`}>不解</Menu.Item>
        <Menu.Item status="4" data-name={`${this.props.keyname}`}>暂缓</Menu.Item>
      </Menu>
    );
    return ( 
      <Dropdown overlay={menu}
      onVisibleChange={this.handleVisibleChange}
      visible={this.state.visible}
    >
      <Badge status={this.menuStatus(this.props.data)} text={this.menuTitle(this.props.data)} />
    </Dropdown>
    );
  }
}
