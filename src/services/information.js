import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryIndex() {
  return request('/api/v1/informations');
}

export async function queryDetail(params) {
  return request(`/api/v1/informations/${params.id}`);
}
