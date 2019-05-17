import { list , changeresumefilestate } from '../services/resumefile';

export default {
  namespace: 'resumefile',

  state: {
    status: 0,
    msg: null,
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *unparsedlist({ payload }, { call, put }) {
      payload.state = 2;
      const response = yield call(list, payload);
    
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *notparsinglist({ payload }, { call, put }) {
      payload.state = 3;
      const response = yield call(list, payload);
    
      yield put({
        type: 'save',
        payload: response,
      });
    },

    // *deleteresumefile({ payload , callback }, { call, put }) {
    //   const response = yield call(changeresumefilestate, payload);
    //    // console.info(' ----------------- notparsinglist接口回调 ----------------- ', response);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },

    *changeresumefilestate({ payload , callback }, { call, put }) {
      const response = yield call(changeresumefilestate, payload);
     
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data ? action.payload.data : {list: [], pagination: {},},
        // data : {
        //   list : action.payload.data.list ? action.payload.data.list : [],
        //   pagination : action.payload.data.page ? action.payload.data.page : {},
        // },
        status: action.payload.status,
        msg: action.payload.msg,
      };
    },
  },
};
