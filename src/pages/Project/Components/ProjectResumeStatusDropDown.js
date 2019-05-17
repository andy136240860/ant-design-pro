import { Menu, Dropdown, Icon ,Badge } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import { div } from 'gl-matrix/src/gl-matrix/vec4';

@connect(({ resumelist }) => ({
    resumelist,
}))

export default class ProjectResumeStatusDropDown extends React.Component {
    static contextTypes = {
        projectResume: PropTypes.object,
        selectStatus: PropTypes.func,
        // projectid: PropTypes.string,
    };

  state = {
    visible: false,
  };

  handleMenuClick = (e) => {
    if (e.item.props.status >=0) {
        this.props.selectStatus(this.props.projectResume, e.item.props.status);
    }
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }


  menuTitle = (project_resume_status) => {
    switch(Number(project_resume_status)) {
      case 0:   return "加入项目"; 
      case 10:  return "已推荐";
      case 20:  return "已淘汰";
      case 30:  return "安排面试";
      case 40:  return "签订offer";
      case 50:  return "保证期"; 
      case 60:  return "完成";
      default:  return "加入项目";
    }
  }

  menuStatus = (project_resume_status) => {
    // 'success' | 'processing' | 'default' | 'error' | 'warning';
    switch(Number(project_resume_status)) {
      case 0:   return "default"; 
      case 10:  return "processing";
      case 20:  return "warning";
      case 30:  return "processing";
      case 40:  return "success";
      case 50:  return "processing"; 
      case 60:  return "success";
      default:  return "default";
    }
  }

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item status="0">加入项目</Menu.Item>
        <Menu.Item status="10">已推荐</Menu.Item>
        <Menu.Item status="20">已淘汰</Menu.Item>
        <Menu.Item status="30">安排面试</Menu.Item>
        <Menu.Item status="40">签订offer</Menu.Item>
        <Menu.Item status="50">保证期</Menu.Item>
        <Menu.Item status="60">完成</Menu.Item>
      </Menu>
    );

    var status = 0;
    if(!this.props.projectResume  || !this.props.projectResume.project_resume_status){
      return null
    }

    return (
      <div>
        {status != undefined && <Dropdown overlay={menu}
          onVisibleChange={this.handleVisibleChange}
          visible={this.state.visible}
        >
        <Badge status={this.menuStatus(this.props.projectResume.project_resume_status? this.props.projectResume.project_resume_status:0)} text={this.menuTitle(this.props.projectResume.project_resume_status? this.props.projectResume.project_resume_status:0)} />
          {/* <a className="ant-dropdown-link" >
            {this.menuTitle(this.props.projectResume.proStatus.project_resume_status)}<Icon type="down" />
          </a> */}
        </Dropdown>}
      </div>
      
    );
  }
}