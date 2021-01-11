import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    project: '',
    status: ''
  },
  mutations: {
    SET_PROJECT: (state, project) => {
      state.project = project
    },
    COMPLETE_TASK: (state, {taskID}) => {
      state.project.tasks[taskID].progress = true
    },
    SET_STATUS: (state, data) => {
      state.status = data
    }
  },
  actions: {
    getProject: async ({commit}, projectID) => {

      let res = await axios.get(`https://manager-47e61-default-rtdb.firebaseio.com/projects/${projectID}.json`)
      commit('SET_PROJECT', res.data)

    },
    completeTask: async ({commit}, {projectID, taskID, taskName}) => {
      await axios.put(`https://manager-47e61-default-rtdb.firebaseio.com/projects/${projectID}/tasks/${taskID}.json`, {name: taskName, progress: true})
      commit('COMPLETE_TASK', {taskID})
    },
    workingStatus: ({commit}, {projectID, status}) => {
      commit('SET_STATUS', {projectID, status})
    }
  },
  modules: {
  }
})
