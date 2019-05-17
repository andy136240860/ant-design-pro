import { Menu, Dropdown, Icon ,Badge } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';

@connect(({ resumelist }) => ({
    resumelist,
}))

export default class ProjectStatusDropDown extends React.Component {
    static contextTypes = {
        project: PropTypes.object,
        refreshFuc: PropTypes.func,
    };

  state = {
    visible: false,
  };

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    if (e.item.props.status >=0) {
      dispatch({
        type: 'project/edit',
        payload: {
          proid: this.props.project.id,
          state : e.item.props.status,
        },
      }).then(() => {
        this.props.refreshFuc();
      });
    }
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }


  menuTitle = (project_resume_status) => {
    switch(Number(project_resume_status)) {
      case 0:   return "进行中"; 
      case 10:  return "成功的";
      case 20:  return "暂停的";
      case 30:  return "失败的";
      case 40:  return "已取消";
    }
  }

  menuStatus = (project_resume_status) => {
    // 'success' | 'processing' | 'default' | 'error' | 'warning';
    switch(Number(project_resume_status)) {
      case 0:   return "processing"; 
      case 10:  return "success";
      case 20:  return "warning";
      case 30:  return "error";
      case 40:  return "default";
      default:  return "default";
    }
  }

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item status="0">进行中</Menu.Item>
        <Menu.Item status="10">成功的</Menu.Item>
        <Menu.Item status="20">暂停的</Menu.Item>
        <Menu.Item status="30">失败的</Menu.Item>
        <Menu.Item status="40">已取消</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu}
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
      >
        <Badge status={this.menuStatus(this.props.project.state)} text={this.menuTitle(this.props.project.state)} />
      </Dropdown>
    );
  }
}