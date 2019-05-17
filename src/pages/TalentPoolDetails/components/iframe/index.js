
import React, { PureComponent } from 'react';
import ReactDOM  from 'react-dom';
import PropTypes from 'prop-types';

//微软回调预览word,doc https://view.officeapps.live.com/op/view.aspx?src=
// word、ppt、xls文件实现在线预览的方式比较简单可以直接通过调用微软的在线预览功能实现 (预览前提：资源必须是公共可访问的)

// 补充：google的文档在线预览实现同微软（资源必须是公共可访问的）
// https://docs.google.com/viewer?url=

// XDOC可以实现预览以DataURI表示的DOC文档，此外XDOC还可以实现文本、带参数文本、html文本、json文本、公文等在线预览，具体实现方法请看官方文档
// http://www.xdocin.com/xdoc?_func=to&amp;_format=html&amp;_cache=1&amp;_xdoc=
export default class iFrame extends PureComponent {
    static contextTypes = {
      src: PropTypes.string,
    };
   
  
    componentWillMount(){

    }
    componentDidMount() {
      // window.addEventListener('message',function(e){
      //   if(e.source!=window.parent) return;
      //   event.source.postMessage("Rechieve!",event.origin);
      // },false);
    }
  
    componentWillUnmount() {
    
    }
  

  
    render() {
      // let basic = 'https://view.officeapps.live.com/op/view.aspx?src=';
      let basic = 'https://view.officeapps.live.com/op/embed.aspx?src='
      let src = this.props.src;
      let newSrc ='';
      if(!src){
        return <div>预览失败</div>
      }else if(/\.(xlsx|xls|XLSX|XLS|doc|docx)$/.test(src)) {
        newSrc=basic+src;
      }else{
        newSrc=src;
      }
      return (
        // <iframe 
        //         style={{width:'100%',  overflow:'visible'}}
        //         onLoad={() => {
        //           this.refs.iframe.contentWindow.postMessage("send", `${newSrc}`);
        //         }} 
        //         height={'100%'}
        //         ref="iframe" 
        //         src={`${newSrc}`}
        //         width="100%" 
        //         frameBorder="0"
        //   />
        <iframe 
         src={`${newSrc}`}
         width="100%" 
         height='100%' 
         frameborder="0
         ">
        </iframe>
      );
    }
  }
