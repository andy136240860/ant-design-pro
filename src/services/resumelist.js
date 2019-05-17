import request from '@/utils/request';
import { stringify } from 'qs';
// new 2018.11.23新接口
// 项目中简历状态流程
export async function getcall(params) {
  return request(`/api/operateresume/call`);
}

export async function addstatus(params) {
  return request('/api/operateresume/addstatus', {
    method: 'POST',
    body: params,
  });
}
export async function delstatus(params) {
  return request(`/api/operateresume/delstatus/${params.id}?${stringify(params)}`, {
    method: 'DELETE',
    body: params,
  });
}
export async function upstatus(params) {
  return request(`/api/operateresume/upstatus/${params.id}`, { method: 'PUT', body: params });
}

// 项目提醒
export async function addcall(params) {
  return request('/api/operateresume/addcall', {
    method: 'POST',
    body: params,
  });
}
export async function delcall(params) {
  return request(`/api/operateresume/delcall/${params.id}?${stringify(params)}`, {
    method: 'DELETE',
    body: params,
  });
}
export async function upcall(params) {
  return request(`/api/operateresume/upcall/${params.id}`, { method: 'PUT', body: params });
}
// 项目重要程度
export async function upimportant(params) {
  return request(`/api/project/upimportant/${params.id}`, { method: 'PUT', body: params });
}

// old 2018.11.23之前新接口
export async function changeStatus(params) {
  return request('/api/change/status', {
    method: 'POST',
    body: params,
  });
}
export async function checkDevResume(params) {
  return request('/api/resume/checkresume', {
    method: 'POST',
    body: params,
  });
}
//管理员权限可以看到的列表
export async function checkresume(params) {
  return request('/api/resume/checkresume', {
    method: 'POST',
    body: params,
  });
}

export async function proresume(params) {
  return request('/api/operateresume/proresume', {
    method: 'POST',
    body: params,
  });
}

export async function deleteresume(params) {
  return request(`/api/resume/${params.id}`);
}

export async function deleteProjectResume(params) {
  return request('/api/project/delresume', {
    method: 'POST',
    body: params,
  });
}

export async function editProjectResumeState(params) {
  return request('/api/operateresume', {
    method: 'POST',
    body: params,
  });
}

export async function importResumeToProject(params) {
  return request(`/api/project/protobase/?${stringify(params)}`);
}
