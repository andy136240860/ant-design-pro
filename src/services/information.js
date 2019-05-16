import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryIndex() {
  return request('/api/v1/informations');
}

export async function queryDetail(params) {
  return request(`/api/v1/informations/${params.id}`);
}

export async function edit(params) {
  console.info(params);
  return request(`/api/v1/informations/${params.id}`,{
    method: 'PUT',
    data: params.data,
  });
}

export async function creat(params) {
  console.info(params);
  return request(`/api/v1/informations`,{
    method: 'POST',
    data: params.data,
  });
}

