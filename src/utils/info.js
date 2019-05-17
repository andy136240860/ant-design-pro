export function checkRequired(data) {
  console.log(data)
  var str = '简历信息不完整,缺少'
  var str1 = '';
  var str2 = '请完善后再上传.';
  for (var key in data) {
    if (key == 'base_person_name' && (data[key] == '' || data[key] == null || data[key] == undefined)) {
      str1 += '姓名,'
    } else if (key == 'base_person_country' && (data[key] == '' || data[key] == null || data[key] == undefined)) {
      str1 += '国籍,'
    } else if (key == 'base_person_phone' && (data[key] == '' || data[key] == null || data[key] == undefined)) {
      str1 += '手机,'
    } else if (key == 'email' && (data[key] == '' || data[key] == null || data[key] == undefined)) {
      str1 += '邮箱,'
    } else if (key == 'citynow' && (data[key] == '' || data[key] == null || data[key] == undefined)) {
      str1 += '所在城市,'
    } else if (key == 'worktime' && (data[key] == '' || data[key] == null || data[key] == undefined)) {
      str1 += '工作年限,'
    } else if (key == 'heighteducation' && (data[key] == '' || data[key] == null || data[key] == undefined)) {
      str1 += '最高学历、'
    } else if (key == 'experience') {
      if (data[key] != null && data[key].length > 0) {
        for (var i = 0; i < data[key].length; i++) {
          for (var attr in data[key][i]) {
            if (attr == 'company' && data[key][i][attr] == '') {
              str1 += `工作经历${i + 1}中的公司名字,`
              console.log(55)
            } else if (attr == 'describe' && data[key][i][attr] == '') {
              str1 += `工作经历${i + 1}中的公司职位描述,`
            } else if (attr == 'position' && data[key][i][attr] == '') {
              str1 += `工作经历${i + 1}中的职位,`
            }
          }
        }
      } else {
        str1 += '工作经历、'
      }

    } else if (key == 'education') {
      if (data[key] != null && data[key].length > 0) {
        for (var i = 0; i < data[key].length; i++) {
          for (var attr in data[key][i]) {
            if (attr == 'education' && data[key][i][attr] == '') {
              str1 += `教育经历${i + 1}中的学历,`
              console.log(55)
            } else if (attr == 'school' && data[key][i][attr] == '') {
              str1 += `教育经历${i + 1}中的学校,`
            } else if (attr == 'major' && data[key][i][attr] == '') {
              str1 += `教育经历${i + 1}中的专业,`
            }
          }
        }
      } else {
        str1 += '教育经历,'
      }

    }
  }
  if (str1 != '') {
    return { pass: false, string: str + str1 + str2 }
  } else {
    return { pass: true }
  }
}



export function reCityNow(data) {

  let obj = {}
  if (data.name) {
    obj.label = data.name;
    obj.value = `${data.namePath},${data.codePath}`;
  }
  return obj;


}
export function reCityHope(data) {
  var arr = []
  if (data.length) {
    for (var i = 0; i < data.length; i++) {
      var obj = {}
      if (data[i]['name']) {
        obj.label = data[i]['name'];
        obj.value = `${data[i]['namePath']},${data[i]['codePath']}`;
      }
      arr.push(obj);
    }
    return arr;
  } else {
    return arr;
  }

}


export const formItemLayout = {
  inputCol: {
    lg: { span: 6 },
    md: { span: 12 },
    sm: { span: 24 },
  },
  labelTwCol: {
    lg: { span: 6 },
    sm: { span: 24 },
  },
  labelTrCol: {
    lg: { span: 8 },
    sm: { span: 24 },
  },
  labelFCol: {
    lg: { span: 6 },
    sm: { span: 24 },
  },
};
export const drawerOptions = ['隐藏姓名', '隐藏手机号', '隐藏微信号'];
export function isStringToArray(data) {
  if (!data) {
    return '';
  }
  const num = data.indexOf(',');
  var arr = [];
  if (num) {
    arr = data.split(',');
  } else {
    arr = data[0];
  }
  return arr;
}
export function reListData(data) {
  let objArray = data.slice(0);
  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('company') || objArray[i]['company'] == null) {
      objArray[i].company = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('position') || objArray[i]['position'] == null) {
      objArray[i].position = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }
  return objArray;
}
export function initaialListData(data) {
  let objArray = data.slice(0);
  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('company') || objArray[i]['company'] == null) {
      objArray[i].company = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('position') || objArray[i]['position'] == null) {
      objArray[i].position = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }
  return objArray;
}
export function initaialEduData(data) {
  let objArray = data.slice(0);
  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('school') || objArray[i]['school'] == null) {
      objArray[i].school = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('education') || objArray[i]['education'] == null) {
      objArray[i].education = '';
    }
    if (!objArray[i].hasOwnProperty('major') || objArray[i]['major'] == null) {
      objArray[i].major = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }

  return objArray;
}

export function reEduData(data) {
  let objArray = data.slice(0);

  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('school') || objArray[i]['school'] == null) {
      objArray[i].school = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('education') || objArray[i]['education'] == null) {
      objArray[i].education = '';
    }
    if (!objArray[i].hasOwnProperty('major') || objArray[i]['major'] == null) {
      objArray[i].major = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }
  return objArray;
}
export function initaialProData(data) {
  let objArray = data.slice(0);
  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('name') || objArray[i]['name'] == null) {
      objArray[i].name = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }
  return objArray;
}
export function reProData(data) {
  let objArray = data.slice(0);
  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('name') || objArray[i]['name'] == null) {
      objArray[i].name = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }
  return objArray;
}
export function initaialTraData(data) {
  let objArray = data.slice(0);
  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('name') || objArray[i]['name'] == null) {
      objArray[i].name = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('certname') || objArray[i]['certname'] == null) {
      objArray[i].certname = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }
  return objArray;
}
export function reTraData(data) {
  let objArray = data.slice(0);
  for (var i = 0; i < objArray.length; i++) {
    if (!objArray[i].hasOwnProperty('name') || objArray[i]['name'] == null) {
      objArray[i].name = '';
    }
    if (!objArray[i].hasOwnProperty('describe') || objArray[i]['describe'] == null) {
      objArray[i].describe = '';
    }
    if (!objArray[i].hasOwnProperty('certname') || objArray[i]['certname'] == null) {
      objArray[i].certname = '';
    }
    if (!objArray[i].hasOwnProperty('starttime') || objArray[i]['starttime'] == null) {
      objArray[i].starttime = '';
    }
    if (!objArray[i].hasOwnProperty('endtime') || objArray[i]['endtime'] == null) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime == objArray[i].starttime ) {
      objArray[i].endtime = '';
    }
    if (objArray[i].endtime != '' && objArray[i].endtime != '' && +new Date(objArray[i].starttime) > +new Date(objArray[i].endtime) ) {
      var temp = objArray[i].endtime;
      objArray[i].endtime = objArray[i].starttime;
      objArray[i].starttime = temp;
    }
  }
  return objArray;
}
export function routerMap(paramsObject) {
  const params = paramsObject;
  let obj = {};
  if (params.id) {
    if (params.typeId == 1) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '编辑人才信息';
      obj.type = params.typeId;
      obj.isNew = false;
    } else if (params.typeId == 2) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '编辑人才信息';
      obj.type = params.typeId;
      obj.isNew = false;
    } else if (params.typeId == 3) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '编辑人才信息';
      obj.type = params.typeId;
      obj.isNew = false;
    } else if (params.typeId == 4) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '编辑人才信息';
      obj.type = params.typeId;
      obj.isNew = false;
    } else if (params.typeId == 5) {
      obj.backUrl = '/#/project/projectresumelist/';
      obj.subTitle = '编辑人才信息至';
      obj.type = params.typeId;
      obj.isNew = false;
    }
    // if(params.typeId != 5){
    // 	obj.backUrl ='/#/resumelibrary/resumetablelist';
    // 	obj.subTitle ='编辑人才信息';
    // 	obj.type = params.typeId;
    // }else if(params.typeId ==5){
    // 	obj.backUrl ='/#/project/projectresumelist/';
    // 	obj.subTitle ='编辑人才信息至';
    // 	obj.type = params.typeId;
    // }
  } else {
    // if(params.typeId !=5){
    // 	obj.backUrl ='/#/resumelibrary/resumetablelist';
    // 	obj.subTitle ='新建人才信息';
    // 	obj.type = params.typeId;
    // }else if(params.typeId ==5){
    // 	obj.backUrl ='/#/project/projectresumelist/';
    // 	obj.subTitle ='新建人才信息至';
    // 	obj.type = params.typeId;
    // }
    if (params.typeId == 1) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '新建人才信息';
      obj.type = params.typeId;
      obj.isNew = true;
    } else if (params.typeId == 2) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '新建人才信息';
      obj.type = params.typeId;
      obj.isNew = true;
    } else if (params.typeId == 3) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '新建人才信息';
      obj.type = params.typeId;
      obj.isNew = true;
    } else if (params.typeId == 4) {
      obj.backUrl = '/#/resumelibrary/resumetablelist';
      obj.subTitle = '新建人才信息';
      obj.type = params.typeId;
      obj.isNew = true;
    } else if (params.typeId == 5) {
      obj.backUrl = '/#/project/projectresumelist/';
      obj.subTitle = '新建人才信息至';
      obj.type = params.typeId;
      obj.isNew = true;
    }
  }
  return obj;
}
export const uploadProps = {
  showUploadList: false,
  multiple: false,
  action: `${window.apiHost}/api/fileupload`,
  accept: 'file',
  name: 'file',
};

export const fieldLabels = {
  base_person_name: '姓名',
  base_person_phone: '手机号',
  wechat: '微信号',
  email: '邮箱地址',
  sex: '性别',
  country: '国籍',
  heighteducation: '最高学历',
  education: '第一学历',
  rr: '是否为统招',
  industry: '所在行业',
  position: '职能',
  citynow: '现居住城市',
  cityhope: '期望城市',
  worktime: '工作年限',
  age: '年龄',
  salary: '年薪(万)',
  salarypm: '月薪(千)',
  jobstate: '求职状态',
  linkedin: 'Link主页',
  personal: '个人主页',
};
// 中专、高中、大专、本科、硕士、博士、博士后、其它
export const heighteducationOptions = [
  {
    value: '本科',
    title: '本科',
  },
  {
    value: '硕士',
    title: '硕士',
  },
  {
    value: '中专',
    title: '中专',
  },
  {
    value: '高中',
    title: '高中',
  },
  {
    value: '大专',
    title: '大专',
  },
  {
    value: '博士',
    title: '博士',
  },
  {
    value: '博士后',
    title: '博士后',
  },
  {
    value: '其他',
    title: '其他',
  },
];
export const rroptions = [
  {
    value: '统招',
    title: '统招',
  },
  {
    value: '非统招',
    title: '非统招',
  },
];
export const errorStateOptions = [
  {
    value: '0',
    title: '正常',
  },
  {
    value: '1',
    title: '解析错误',
  },
  {
    value: '2',
    title: '已解决',
  }, 
  {
    value: '3',
    title: '不解决',
  },
  {
    value: '4',
    title: '暂缓',
  },
];
export const countryOptions = [
  {
    value: '其他',
    title: '其他',
  },
  {
    value: '中国',
    title: '中国',
  },
  {
    value: '中国香港',
    title: '中国香港',
  },
  {
    value: '中国澳门',
    title: '中国澳门',
  },
  {
    value: '中国台湾',
    title: '中国台湾',
  },
  {
    value: '美国',
    title: '美国',
  },
  {
    value: '澳大利亚',
    title: '澳大利亚',
  },
  {
    value: '英国',
    title: '英国',
  },
  {
    value: '加拿大',
    title: '加拿大',
  },
  {
    value: '新加坡',
    title: '新加坡',
  },
];
export const workChangeData = [
  {
    value: '1',
    title: '在职,看看新机会',
  },
  {
    value: '2',
    title: '在职,急需新工作',
  },
  {
    value: '3',
    title: '在职,暂无跳槽打算',
  },
  {
    value: '4',
    title: '离职,正在找工作',
  },
];
export const sexData = [
  {
    value: '1',
    title: '男',
  },
  {
    value: '2',
    title: '女',
  },
];
function dateFtt(fmt, date) {
  //author: meizz
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}
export function crtTimeFtt(value, model) {
  var crtTime = new Date(value);
  var modelData = 'yyyy-MM-dd hh:mm:ss';
  if (model == 1) {
    modelData = 'yyyy-MM-dd hh:mm:ss';
  } else if (model == 2) {
    modelData = 'yyyy-MM-dd hh:mm';
  } else if (model == 3) {
    modelData = 'yyyy-MM-dd';
  }

  return dateFtt(modelData, crtTime); //直接调用公共JS里面的时间类处理的办法
}

export function GetQueryString(name) {

  var after = window.location.href.split('?')[1];
  if (after) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = after.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    } else {
      return null;
    }
  }
}

export const industryData = [
  {
    title: '互联网/移动互联网/电子商务',
    value: '040',
    enTitle: 'Internet/Mobile Internet/E-Business',
    key: '互联网/移动互联网/电子商务',
  },
  {
    title: '网络游戏',
    value: '420',
    enTitle: 'Online Game',
    key: '网络游戏',
  },
  {
    title: '计算机软件',
    value: '010',
    enTitle: 'Computer Software',
    key: '计算机软件',
  },
  {
    title: 'IT服务/系统集成',
    value: '030',
    enTitle: 'IT Services/Systems Integration',
    key: 'IT服务/系统集成',
  },
  {
    title: '电子技术/半导体/集成电路',
    value: '050',
    enTitle: 'Electronics/Microelectronics',
    key: '电子技术/半导体/集成电路',
  },
  {
    title: '通信(设备/运营/增值)',
    value: '060',
    enTitle: 'Communications (Equipment/Sales/Value-Added)',
    key: '通信(设备/运营/增值)',
  },
  {
    title: '计算机硬件/网络设备',
    value: '020',
    enTitle: 'Computer Hardware/Network Equipment',
    key: '计算机硬件/网络设备',
  },
  {
    title: '房地产开发/建筑/建材/工程',
    value: '080',
    enTitle: 'Real Estate Development/Architectural Services/Building Materials/Construction',
    key: '房地产开发/建筑/建材/工程',
  },
  {
    title: '规划/设计/装潢',
    value: '100',
    enTitle: 'Construction Planning/Interior Design/Decoration',
    key: '规划/设计/装潢',
  },
  {
    title: '房地产服务(物业管理/地产经纪)',
    value: '090',
    enTitle: 'Real Estate Services',
    key: '房地产服务(物业管理/地产经纪)',
  },
  {
    title: '银行',
    value: '130',
    enTitle: 'Banking',
    key: '银行',
  },
  {
    title: '保险',
    value: '140',
    enTitle: 'Insurance',
    key: '保险',
  },
  {
    title: '基金/证券/期货/投资',
    value: '150',
    enTitle: 'Securities/Futures/Investment Funds',
    key: '基金/证券/期货/投资',
  },
  {
    title: '会计/审计',
    value: '430',
    enTitle: 'Accounting/Auditing',
    key: '会计/审计',
  },
  {
    title: '信托/担保/拍卖/典当',
    value: '500',
    enTitle: 'Trust/Guarantee/Auction/Pawn Business',
    key: '信托/担保/拍卖/典当',
  },
  {
    title: '食品/饮料/烟酒/日化',
    value: '190',
    enTitle: 'Food/Drink/Wine/Commodity',
    key: '食品/饮料/烟酒/日化',
  },
  {
    title: '百货/批发/零售',
    value: '240',
    enTitle: 'General Merchandise/Wholesale/Retail',
    key: '百货/批发/零售',
  },
  {
    title: '服装服饰/纺织/皮革',
    value: '200',
    enTitle: 'Clothing/Textiles/Furniture',
    key: '服装服饰/纺织/皮革',
  },
  {
    title: '家具/家电',
    value: '210',
    enTitle: 'Furniture/Home Appliances',
    key: '家具/家电',
  },
  {
    title: '办公用品及设备',
    value: '220',
    enTitle: 'Office Equipment/Supplies',
    key: '办公用品及设备',
  },
  {
    title: '奢侈品/收藏品',
    value: '460',
    enTitle: 'Luxury/Collection',
    key: '奢侈品/收藏品',
  },
  {
    title: '工艺品/珠宝/玩具',
    value: '470',
    enTitle: 'Arts & Craft/Toys/Jewelry',
    key: '工艺品/珠宝/玩具',
  },
  {
    title: '汽车/摩托车',
    value: '350',
    enTitle: 'Automobiles/Motorcycles',
    key: '汽车/摩托车',
  },
  {
    title: '机械制造/机电/重工',
    value: '360',
    enTitle: 'Machine Manufacturing/Heavy Electrical',
    key: '机械制造/机电/重工',
  },
  {
    title: '印刷/包装/造纸',
    value: '180',
    enTitle: 'Printing/Packaging/Papermaking',
    key: '印刷/包装/造纸',
  },
  {
    title: '原材料及加工',
    value: '370',
    enTitle: 'Raw Materials Processing',
    key: '原材料及加工',
  },
  {
    title: '仪器/仪表/工业自动化/电气',
    value: '340',
    enTitle: 'Instrumentation/Industrial Automation/Electrical',
    key: '仪器/仪表/工业自动化/电气',
  },
  {
    title: '专业服务(咨询/财会/法律/翻译等)',
    value: '120',
    enTitle: 'Professional Services (Consult/Accounting/Legal/Translate)',
    key: '专业服务(咨询/财会/法律/翻译等)',
  },
  {
    title: '中介服务',
    value: '110',
    enTitle: 'Intermediate Services',
    key: '中介服务',
  },
  {
    title: '外包服务',
    value: '440',
    enTitle: 'Outsourcing Services',
    key: '外包服务',
  },
  {
    title: '检测/认证',
    value: '450',
    enTitle: 'Testing/Certification',
    key: '检测/认证',
  },
  {
    title: '旅游/酒店/餐饮服务/生活服务',
    value: '230',
    enTitle: 'Tourism/Hospitality/Restaurant & Food Services/Personal Care & Services',
    key: '旅游/酒店/餐饮服务/生活服务',
  },
  {
    title: '娱乐/休闲/体育',
    value: '260',
    enTitle: 'Entertainment/Leisure/Sports & Fitness',
    key: '娱乐/休闲/体育',
  },
  {
    title: '租赁服务',
    value: '510',
    enTitle: 'Leasing Service',
    key: '租赁服务',
  },
  {
    title: '广告/公关/市场推广/会展',
    value: '070',
    enTitle: 'Advertising/Public Relations/Marketing/Exhibitions',
    key: '广告/公关/市场推广/会展',
  },
  {
    title: '影视/媒体/艺术/文化/出版',
    value: '170',
    enTitle: 'Film & Television/Media/Arts/Communication',
    key: '影视/媒体/艺术/文化/出版',
  },
  {
    title: '教育/培训/学术/科研/院校',
    value: '380',
    enTitle: 'Education/Training/Science/Research/Universities and Colleges',
    key: '教育/培训/学术/科研/院校',
  },
  {
    title: '交通/物流/运输',
    value: '250',
    enTitle: 'Transportation/Shipping/Logistics',
    key: '交通/物流/运输',
  },
  {
    title: '贸易/进出口',
    value: '160',
    enTitle: 'Trade/Import-Export',
    key: '贸易/进出口',
  },
  {
    title: '航空/航天',
    value: '480',
    enTitle: 'Aerospace/Aviation/Airlines',
    key: '航空/航天',
  },
  {
    title: '制药/生物工程',
    value: '270',
    enTitle: 'Pharmaceuticals/Biotechnology',
    key: '制药/生物工程',
  },
  {
    title: '医疗/保健/美容/卫生服务',
    value: '280',
    enTitle: 'Medical/Health and Beauty Services',
    key: '医疗/保健/美容/卫生服务',
  },
  {
    title: '医疗设备/器械',
    value: '290',
    enTitle: 'Medical Equipment/Devices',
    key: '医疗设备/器械',
  },
  {
    title: '能源(电力/水利)',
    value: '330',
    enTitle: 'Energy (Electricity/Water Conservation)',
    key: '能源(电力/水利)',
  },
  {
    title: '石油/石化/化工',
    value: '310',
    enTitle: 'Rock oil/Chemical Industry',
    key: '石油/石化/化工',
  },
  {
    title: '采掘/冶炼/矿产',
    value: '320',
    enTitle: 'Mining/Metallurgy',
    key: '采掘/冶炼/矿产',
  },
  {
    title: '环保',
    value: '300',
    enTitle: 'Environmental Protection',
    key: '环保',
  },
  {
    title: '新能源',
    value: '490',
    enTitle: 'New Energy',
    key: '新能源',
  },
  {
    title: '政府/公共事业/非营利机构',
    value: '390',
    enTitle: 'Government/public service/Non-Profit',
    key: '政府/公共事业/非营利机构',
  },
  {
    title: '农/林/牧/渔',
    value: '410',
    enTitle: 'Farming/Forestry/Animal Husbandry and Fishery',
    key: '农/林/牧/渔',
  },
  {
    title: '其他',
    value: '400',
    enTitle: 'Other',
    key: '其他',
  },
];
