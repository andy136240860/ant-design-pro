import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/user/info');
}

export async function resetPwd(params) {
  return request('/api/user/reset', {
    method: 'POST',
    body: params,
  });
}

//管理员权限可以看到的列表
export async function checkuser(params) {
  return request('/api/checkuser', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function updateUser(params) {
  return request('/api/alertaccount', {
    method: 'POST',
    body: params,
  });
}


export async function enableUser(params) {
  return request('/api/updateuser ', {
    method: 'POST',
    body: params,
  });
}

