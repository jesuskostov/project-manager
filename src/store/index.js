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
    setProgress: async ({commit}, {projectID, progress}) => {
      await axios.patch(`https://manager-47e61-default-rtdb.firebaseio.com/projects/${projectID}/.json`, {progress: progress})
      let res = await axios.get(`https://manager-47e61-default-rtdb.firebaseio.com/projects/${projectID}.json`)
      commit('SET_PROJECT', res.data)
    },
    newComment:  async ({commit}, {taskID, user, comment}) => {
      await axios.post(`https://manager-47e61-default-rtdb.firebaseio.com/projects/${taskID}/comments/.json`, {
        name: user.name,
        avatar: user.image,
        text: comment
      })
      let res = await axios.get(`https://manager-47e61-default-rtdb.firebaseio.com/projects/${taskID}.json`)
      commit('SET_PROJECT', res.data)
      // commit('SET_PROGRESS', {projectID, progress})
    }
  },
  modules: {
  }
})
