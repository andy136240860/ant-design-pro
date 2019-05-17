import request from '../utils/request';
import { stringify } from 'qs';

export async function list(params) {
  return request('/api/project/getpro', {
    method: 'POST',
    body: params,
  });
}

export async function newProject(params) {
  return request('/api/project', {
    method: 'POST',
    body: params,
  });
}

export async function editProject(params) {
  return request('/api/project/updatepro', {
    method: 'POST',
    body: params,
  });
}

export async function deleteProject(params) {
  return request(`/api/project/${params.id}?state=4`, {
    method: 'DELETE',
  });
}

