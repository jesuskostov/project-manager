<template>
  <div class="hello">
    <div class="section-body">
      <form @submit.prevent="addProject">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h4><span v-if="!name">Нов проект</span><span v-else>{{ name }}</span></h4>
              </div>
              <div class="card-body">
                <div class="form-group row mb-4">
                  <label class="col-form-label col-12 col-md-3 col-lg-12">Заглавие</label>
                  <div class="col-sm-12 col-md-12">
                    <input type="text" class="form-control" v-model="name" required>
                  </div>
                </div>
                <div class="form-group row mb-4">
                  <label class="col-form-label col-12 col-md-3 col-lg-12">Описание</label>
                  <div class="col-sm-12 col-md-12">
                    <!-- <textarea class="summernote-simple" v-model="description" required></textarea> -->
                    <VueEditor class="summernote-simple" v-model="description" required />
                  </div>
                </div>
                <!-- <div class="form-group row mb-4">
                  <label class="col-form-label col-12 col-md-3 col-lg-12">Стъпки</label>
                  <div class="col-sm-12 col-md-12">
                    <input type="text" class="form-control inputtags mb-2" v-model="taskName" v-on:keydown.enter.prevent="addTask" placeholder="Въведи нова стъпка и натисни Enter...">
                    <span v-for="(task, i) in tasks" :key="i" class="badge badge-primary mr-2 mb-2">{{task.name}}<span class="badge badge-danger" @click="deleteTask(task)">X</span></span>
                  </div>
                </div> -->
                <div class="form-group row mb-4">
                  <label class="col-form-label text-md-right col-12 col-md-3 col-lg-3"></label>
                  <div class="col-sm-12 col-md-7">
                    <button type="submit" class="btn btn-primary" :class="{'btn-progress': loading}">Създай</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { bus } from '../main'
import { VueEditor } from "vue2-editor";

export default {
  name: 'ProjectCreate',
  data() {
    return {
      loading: false,
      name: '',
      description: '',
      taskName: '',
    }
  },
  components: {
    VueEditor
  },
  methods: {
    // addTask() {
    //   this.tasks.push({'name': this.taskName, 'progress': false})
    //   this.taskName = ''
    // },
    // deleteTask(task) {
    //   const index = this.tasks.indexOf(task);
    //   if (index > -1) {
    //     this.tasks.splice(index, 1);
    //   }
    // },
    async addProject() {
      this.loading = true
      await axios.post('https://manager-47e61-default-rtdb.firebaseio.com/projects/.json', {
        name: this.name,
        description: this.description,
        progress: 0,
        status: 'pause',
        comments: []
      })
      bus.$emit('update')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.badge {
  padding: 6px 10px;
  .badge-danger {
    padding: 4px;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
