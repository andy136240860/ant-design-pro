import { routerRedux } from 'dva/router';
import { login } from '@/services/login';
import { setAuthority, getAuthority, clearAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';
import { logout } from '../services/api';
export default {
  namespace: 'login',

  state: {
    currentUser: {},
    status: 0,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.status,
          data: response.data,
        },
      });
      // Login successfully
      if (response.status === 0) {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
   
    },
    *logout(payload, { call, put }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        // const pathname = yield select(state => state.routing.location.pathname);
        const response = yield call(logout, payload);

        // add the parameters in the url
        // urlParams.searchParams.set('redirect', pathname);
        clearAuthority();
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 0,
            type: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.data) {
        switch (payload.data.user_power) {
          case 0:
            setAuthority('admin', payload.data);
            break;
          case 1:
            setAuthority('user', payload.data);
            break;
          case 2:
            setAuthority('dev', payload.data);
            break;
          default:
            setAuthority('guest', payload.data);
        }
      }
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
