import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { db } from '../firebase'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {
    project: '',
    status: '',
    sec: 0,
    min: 0,
    hour: 0,
    test: 'test'
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
    },
    SET_TIME: (state) => {
      // // Seconds
      state.sec++
      if (state.sec == 5) {
        state.sec = 0
        // Minutes
        state.min++
      }
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
    workingStatus: async ({commit}, {projectID, status}) => {
      await db.ref('projects').child(`${projectID}`).child('status').set(status)
      commit('SET_STATUS', {projectID, status})
    },
    startTime: ({state, commit}, value) => {
      
      if (value == 'start') {
        state.test = setInterval(() => {
          commit('SET_TIME')
        }, 1000)
      } else if (value == 'stop') {
        // commit('SET_TIME')
        clearInterval(state.test)
      }
    }
  },
  modules: {
  }
})
