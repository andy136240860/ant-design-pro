import { coldList, getColdList, deleteColdList, editColdList } from '../services/resumedetail';

export default {
  namespace: 'coldList',

  state: {},

  effects: {
    *coldLists({ payload, callback }, { call, put }) {
      const response = yield call(coldList, payload);
      if (response.status == 0 && callback && typeof callback === 'function') {
        callback();
      }
      yield put({
        type: 'coldList',
        payload: response,
      });
    },
    *getCodeLists({ payload }, { call, put }) {
      const responst = yield call(getColdList, payload);
      yield put({
        type: 'getCodeList',
        payload: responst,
      });
    },
    *deleteColdList({ payload, callback }, { call, put }) {
      const response = yield call(deleteColdList, payload);
      if (response.data && callback && typeof callback === 'function') {
        callback();
      }
    },
    *editColdList({ payload, callback }, { call, put }) {
      const response = yield call(editColdList, payload);
      if (response.data && callback && typeof callback === 'function') {
        callback();
      }
    },
  },

  reducers: {
    coldList(state, { payload }) {
      return {
        ...state,
        errs: payload,
      };
    },
    getCodeList(state, { payload }) {
      return {
        ...state,
        getColdList: payload.data,
      };
    },
  },
};
