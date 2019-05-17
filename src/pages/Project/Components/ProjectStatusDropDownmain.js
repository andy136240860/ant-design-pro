import { Menu, Dropdown, Icon, Badge } from 'antd';
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

  handleMenuClick = e => {
    const { dispatch } = this.props;
    if (e.item.props.status >= 0) {
      dispatch({
        type: 'resumelist/upimportant',
        payload: {
          id: this.props.project.id,
          is_important: e.item.props.status,
        },
      }).then(() => {
        this.props.refreshFuc();
      });
    }
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  menuTitle = project_resume_status => {
    switch (Number(project_resume_status)) {
      case 0:
        return '正常';
      case 1:
        return '低';
      case 2:
        return '中';
      case 3:
        return '高';
    }
  };

  menuStatus = project_resume_status => {
    // 'success' | 'processing' | 'default' | 'error' | 'warning';
    switch (Number(project_resume_status)) {
      case 0:
        return 'default';
      case 1:
        return 'warning';
      case 2:
        return 'processing';
      case 3:
        return 'error';
      default:
        return 'default';
    }
  };

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item status="0" >正常</Menu.Item>
        <Menu.Item status="1">低</Menu.Item>
        <Menu.Item status="2">中</Menu.Item>
        <Menu.Item status="3">高</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown
        overlay={menu}
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
      >
        <Badge
          status={this.menuStatus(this.props.project.is_important)}
          text={this.menuTitle(this.props.project.is_important)}
        />
      </Dropdown>
    );
  }
}
