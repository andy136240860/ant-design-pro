import { stringify } from 'qs';
import request from '../utils/request';

//  上传文本解析
export async function copyup(params) {
  return request('/api/resume/texttoword', {
    method: 'POST',
    data: params,
  });
}

// 点击查看联系方式简历 /resume/showresume
export async function getLink(params) {
  return request(`/api/resume/showresume?${stringify(params)}`);
}
// 获取信息
export async function getDetail(params) {
  return request(`/api/resume/${params}/edit`);
}

//  新建简历
export async function save(params) {
  return request('/api/resume', {
    method: 'POST',
    data: params,
  });
}

// 解析 测试
// export async function parse(params) {
//   return request(['http://39.107.251.62:8101/resume/parse'], {
//     method: 'POST',
//     body:params,
//   });
// }
// 解析 正式
export async function parse(params) {
  var arr = ['http://121.42.144.76:8101/resume/parse'];
  return request(arr, {
    method: 'POST',
    data: params,
  });
}
// 更新简历
export async function upDate(params) {
  return request('/api/resume/alertresume', {
    method: 'POST',
    data: params,
  });
}

// 上传评价
export async function postEvaluate(params) {
  return request(`/api/resume/evaluate`, {
    method: 'POST',
    data: params,
  });
}
// 获取评价
export async function getEvaluate(params) {
  return request(`/api/resume/getevaluates?${stringify(params)}`);
}
// 添加简历到项目
export async function getProtobase(params) {
  return request(`/api/project/protobase?${stringify(params)}`);
}
// 修改简历状态
export async function amend(params) {
  return request(`/api/operateresume/rstate?${stringify(params)}`);
}

// 下载简历，生成报告
export async function downloadReport(params) {
  return request('/api/operateresume/dlresume', {
    method: 'POST',
    data: params,
  });
}
//获取code list
export async function getColdList(params) {
  return request(`/api/coldlist?${stringify(params)}`);
}
//添加code list
export async function coldList(params) {
  return request('/api/coldlist', {
    method: 'POST',
    data: params,
  });
}
//删除code list
export async function deleteColdList(params) {
  return request(`/api/coldlist/${params}`, {
    method: 'DELETE',
  });
}
//编辑code list
export async function editColdList(params) {
  return request(`/api/coldlist/${params.proid}?${stringify(params)}`, {
    method: 'PATCH',
  });
}
