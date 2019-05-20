import request from '../utils/request';

export async function login(params) {
  console.info(params);
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}