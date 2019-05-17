import request from '../utils/request';
import { stringify } from 'qs';

//管理员权限可以看到的列表
export async function list(params) {
    return request(`/api/operateresume/getAttach?${stringify(params)}`);
}


export async function changeresumefilestate(params) {
    return request(`/api/operateresume/rstate?${stringify(params)}`);
}


