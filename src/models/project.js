import { newProject, editProject, list , deleteProject } from '../services/project';

export default {
  namespace: 'project',

  state: {
    currentEditProject: {},
    data: {
      list: [],
      page: {},
    },
  },

  effects: {
    *list( {callback, payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *new({callback,  payload }, { call, put }) {
      const response = yield call(newProject, payload);
      yield put({
        type: 'saveCurrentEditProject',
        payload: response,
      });
      if (callback) callback();
    },
    *edit({callback,  payload }, { call, put }) {
      const response = yield call(editProject, payload);
      yield put({
        type: 'saveCurrentEditProject',
        payload: response,
      });
      if (callback) callback();
    },
    *delete({ payload , callback }, { call, put }) {
      const response = yield call(deleteProject, payload);
      yield put({
        type: 'saveCurrentEditProject',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      action.payload.data.list.forEach(element => {
        element.projectid = element.id;
      });
      return {
        ...state,
        data: action.payload.data,
      };
    },
    saveCurrentEditProject(state, action) {
      return {
        ...state,
        currentEditProject: action.payload.data,
      };
    },
  },
};
