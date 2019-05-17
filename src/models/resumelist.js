import {
  checkresume,
  proresume,
  deleteresume,
  editProjectResumeState,
  deleteProjectResume,
  importResumeToProject,
  checkDevResume,
  changeStatus,
  addstatus,
  delstatus,
  upstatus,
  addcall,
  delcall,
  upcall,
  upimportant,
  getcall,
} from '../services/resumelist';

export default {
  namespace: 'resumelist',
  state: {
    status: 0,
    msg: null,
    data: {
      list: [],
      pagination: {},
    },
    AddProjectResumeList: {
      list: [],
      pagination: {},
    },
    projectResumeData: {
      list: [],
      pagination: {},
    },
    getcallData: {
      
    },
    currentResume: {},
    statusData: {},
    callData: {},
  },

  effects: {
    *getcall({ payload, callback }, { call, put }) {
      const response = yield call(getcall, payload);
      yield put({
        type: 'getcallData',
        payload: response,
      });
      if (callback) callback(response);
    },
    *upimportant({ payload, callback }, { call, put }) {
      const response = yield call(upimportant, payload);
      yield put({
        type: 'editupimportant',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addcall({ payload, callback }, { call, put }) {
      const response = yield call(addcall, payload);
      yield put({
        type: 'editcall',
        payload: response,
      });
      if (callback) callback(response);
    },
    *delcall({ payload, callback }, { call, put }) {
      console.log(payload);
      const response = yield call(delcall, payload);
      yield put({
        type: 'editcall',
        payload: response,
      });
      if (callback) callback(response);
    },
    *upcall({ payload, callback }, { call, put }) {
      const response = yield call(upcall, payload);
      yield put({
        type: 'editcall',
        payload: response,
      });
      if (callback) callback(response);
    },

    *addstatus({ payload, callback }, { call, put }) {
      const response = yield call(addstatus, payload);
      yield put({
        type: 'editstatus',
        payload: response,
      });
      if (callback) callback(response);
    },
    *dellstatus({ payload, callback }, { call, put }) {
      console.log(payload);
      const response = yield call(delstatus, payload);
      yield put({
        type: 'editstatus',
        payload: response,
      });
      if (callback) callback(response);
    },
    *upstatus({ payload, callback }, { call, put }) {
      const response = yield call(upstatus, payload);
      yield put({
        type: 'editstatus',
        payload: response,
      });
      if (callback) callback(response);
    },

    *changeStatus({ payload, callback }, { call, put }) {
      const response = yield call(changeStatus, payload);
      yield put({
        type: 'adminStatus',
        payload: response,
      });
      if (callback) callback(response);
    },
    *checkresume({ payload }, { call, put }) {
      console.log('payload', payload);

      const response = yield call(checkresume, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *checkDev({ payload }, { call, put }) {
      const response = yield call(checkDevResume, payload);
      yield put({
        type: 'devSave',
        payload: response,
      });
    },
    *AddProjectResumeList({ payload }, { call, put }) {
      const response = yield call(checkresume, payload);
      yield put({
        type: 'saveAddProjectResumeList',
        payload: response,
      });
    },

    *importResumeToProject({ payload, callback }, { call, put }) {
      const response = yield call(importResumeToProject, payload);
      yield put({
        type: 'saveCurrentResume',
        payload: response,
      });
      if (callback) callback(response);
    },

    *proresume({ payload }, { call, put }) {
      const response = yield call(proresume, payload);
      yield put({
        type: 'saveProjectResume',
        payload: response,
      });
    },

    *deleteresume({ payload, callback }, { call, put }) {
      const response = yield call(deleteresume, payload);
      yield put({
        type: 'saveCurrentResume',
        payload: response,
      });
      if (callback) callback(response);
    },

    *editProjectResumeState({ payload, callback }, { call, put }) {
      const response = yield call(editProjectResumeState, payload);
      yield put({
        type: 'saveCurrentResume',
        payload: response,
      });
      if (callback) callback(response);
    },

    *deleteProjectResume({ payload, callback }, { call, put }) {
      const response = yield call(deleteProjectResume, payload);
      yield put({
        type: 'saveCurrentResume',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    getcallData(state, action) {
      return { ...state, getcallData: action.payload.data ? action.payload.data : {} };
    },
    editupimportant(state, action) {
      return { ...state, data: action.payload.data ? action.payload.data : {} };
    },
    editcajj(state, action) {
      return { ...state, callData: action.payload.data ? action.payload.data : {} };
    },
    editstatus(state, action) {
      return { ...state, statusData: action.payload.data ? action.payload.data : {} };
    },
    adminStatus(state, action) {
      return {
        ...state,
        currentResume: action.payload.data ? action.payload.data : {},
        status: action.payload.status,
        msg: action.payload.msg,
      };
    },
    save(state, action) {
      return {
        ...state,
        // loading: true,
        data: action.payload.data ? action.payload.data : { list: [], page: {} },
        status: action.payload.status,
        msg: action.payload.msg,
      };
    },

    saveProjectResume(state, action) {
      return {
        ...state,
        projectResumeData: action.payload.data ? action.payload.data : { list: [], page: {} },
        status: action.payload.status,
        msg: action.payload.msg,
      };
    },
    devSave(state, action) {
      return {
        ...state,
        data: action.payload.data ? action.payload.data : { list: [], page: {} },
        status: action.payload.status,
        msg: action.payload.msg,
      };
    },
    saveAddProjectResumeList(state, action) {
      return {
        ...state,
        AddProjectResumeList: action.payload.data ? action.payload.data : { list: [], page: {} },
        status: action.payload.status,
        msg: action.payload.msg,
      };
    },

    saveCurrentResume(state, action) {
      return {
        ...state,
        currentResume: action.payload.data ? action.payload.data : {},
        status: action.payload.status,
        msg: action.payload.msg,
      };
    },
  },
};
