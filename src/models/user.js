import { query as queryUsers, queryCurrent, checkuser,updateUser ,enableUser} from '../services/user';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {},
    status: 0,
    message: null,
    errors: null,
    register: {},
  },

  effects: {
    *checkuser({ payload }, { call, put }) {
      const response = yield call(checkuser,payload);
      yield put({
        type: 'saveCheckuser',
        payload: response,
      });
    },

    *updateUser({ payload , callback }, { call, put }) {
      const response = yield call(updateUser,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    *enableUser({ payload , callback }, { call, put }) {
    const response = yield call(enableUser,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },


    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCheckuser(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
