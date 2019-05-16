import { queryIndex, queryDetail ,edit, creat} from '@/services/information';

export default {
  namespace: 'information',

  state: {
    informationlist: {},
    currentInformation: {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(queryIndex, payload);
      yield put({
        type: 'queryIndex',
        payload: Array.isArray(response.data.list) ? response.data : {},
      });
    },
    *show({ payload, callback }, { call, put }) {
      console.info(payload);
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'queryDetail',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call, put }) {
      console.info(payload);
      const response = yield call(edit, payload);
      yield put({
        type: 'queryDetail',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *creat({ payload, callback }, { call, put }) {
      console.info(payload);
      const response = yield call(creat, payload);
      yield put({
        type: 'queryDetail',
        payload: response.data,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    queryIndex(state, action) {
      return {
        ...state,
        informationlist: action.payload,
      };
    },
    queryDetail(state, action) {
      return {
        ...state,
        currentInformation: action.payload,
      };
    },
  },
};
