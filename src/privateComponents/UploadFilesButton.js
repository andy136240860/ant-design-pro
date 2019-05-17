import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Upload,
} from 'antd';
import PropTypes from 'prop-types';


export default class UploadFilesButton extends React.Component {
    static contextTypes = {
        refreshFuc: PropTypes.func,
    };

    state = {
      fileList: [
      // {
      //   uid: -1,
      //   name: 'xxx.png',
      //   status: 'done',
      //   url: 'http://www.baidu.com/xxx.png',
      // }
     ],
    }
  
    handleChange = (info) => {
      let fileList = info.fileList;
     // console.log(fileList)
     // console.log(fileList.name)
      // // if(fileList.name.split('.')[1] == 'htm'){
          
      // //   fileList.name=`${fileList.name}l`
      // //   fileList.url =`${fileList.url}l` ;

      // // }
     // console.log(fileList)
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2);
      // 2. read from response and show file link
      fileList = fileList.map((file) => {
 
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
          
       
     
        }
        return file;
      });
  
      // 3. filter successfully uploaded files according to response from server
      fileList = fileList.filter((file) => {
    
        if (file.response) {
          return file.response.status === 'success';
        }
        return true;
      });
  
      this.setState({ fileList });
      if (this.props.refreshFuc) {
        this.props.refreshFuc();
      }

    }
  
    render() {
      const props = {
        action: `http://hunter.zhantoubang.com/api/many`,
        onChange: this.handleChange,
        multiple: true,
        withCredentials: true,
      };
      return (
        <Upload {...props} fileList={this.state.fileList}>
            <Button icon="upload" type="primary">
              上传多份简历
            </Button>
        </Upload>
      );
    }
  }