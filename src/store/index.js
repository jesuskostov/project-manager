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
      let time = project.time.split(':');
      state.hour = time[0]
      state.min = time[1]
      state.sec = time[2]
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
      if (status == 'finished') {
        await db.ref('projects').child(`${projectID}`).child('status').set(status)
      }
      commit('SET_STATUS', {projectID, status})
    },
    startTime: async ({state, commit}, {projectID, value}) => {
      if (value == 'start') {
        state.test = setInterval(() => {
          commit('SET_TIME')
        }, 1000)
      } else if (value == 'stop') {
        clearInterval(state.test)
        let time = state.hour + ":" + state.min + ":" + state.sec
        await db.ref('projects').child(`${projectID}`).child('time').set(time)
      } 
    }
  },
  modules: {
  }
})
