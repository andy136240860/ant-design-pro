import {
  save,
  getDetail,
  postEvaluate,
  getEvaluate,
  getProtobase,
  upDate,
  amend,
  downloadReport,
  parse,
  getLink,
  copyup,
} from '../services/resumedetail';
export default {
  namespace: 'resumedetail',
  state: {
    data: {},
  },
  effects: {
    *copy({ payload, callback }, { call, put }) {
      const response = yield call(copyup, payload);
      yield put({
        type: 'copyupData',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getLink({ payload, callback }, { call, put }) {
      const response = yield call(getLink, payload);
      yield put({
        type: 'getOtherLink',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      yield put({
        type: 'getResume',
        payload: response,
      });
      if (callback) callback(response);
    },
    *parseResume({ payload, callback }, { call, put }) {
      const response = yield call(parse, payload);
      yield put({
        type: 'parseResumeDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *save({ payload, callback }, { call, put }) {
      const response = yield call(save, payload);
      yield put({
        type: 'resume',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateResume({ payload, callback }, { call, put }) {
      const response = yield call(upDate, payload);
      yield put({
        type: 'updateResumeData',
        payload: response,
      });
      if (callback) callback(response);
    },
    *postEvaluate({ payload, callback }, { call, put }) {
      const response = yield call(postEvaluate, payload);
      yield put({
        type: 'postEvaluateDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getEvaluate({ payload, callback }, { call, put }) {
      const response = yield call(getEvaluate, payload);
      yield put({
        type: 'getEvaluateDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getProtobase({ payload, callback }, { call, put }) {
      const response = yield call(getProtobase, payload);
      yield put({
        type: 'getProtobaseDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getAmend({ payload, callback }, { call, put }) {
      const response = yield call(amend, payload);
      yield put({
        type: 'amendDetail',
        payload: response,
      });
      if (callback) callback(response);
    },

    *postReport({ payload, callback }, { call, put }) {
      const response = yield call(downloadReport, payload);
      yield put({
        type: 'postReportDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers: {
    copyupData(state, action) {
      return {
        ...state,
        ...action.payload,
   
      };
    },
    parseResumeDetail(state, action) {
      return {
        ...state,
        ...action.payload,
   
      };
    },
    resume(state, action) {
      return {
        ...state,
        ...action.payload,
   
      };
    },
    updateResumeData(state, action) {
      return {
        ...state,
        ...action.payload,
   
      };
    },
    postEvaluateDetail(state, action) {
      return {
        ...state,
        data: action.payload ? action.payload : null,
   
      };
    },
    getOtherLink(state, action) {
      return {
        ...state,
   
        data: action.payload ? action.payload : null,
      };
    },
    getResume(state, action) {
      return {
        ...state,
   
        data: action.payload ? action.payload : null,
      };
    },
    getEvaluateDetail(state, action) {
      return {
        ...state,
   
        data: action.payload ? action.payload : null,
      };
    },
    getProtobaseDetail(state, action) {
      return {
        ...state,
   
        data: action.payload ? action.payload : null,
      };
    },
    amendDetail(state, action) {
      return {
        ...state,
   
        data: action.payload ? action.payload : null,
      };
    },
    postReportDetail(state, action) {
      return {
        ...state,
        data: action.payload ? action.payload : null,
   
      };
    },
  },
};
