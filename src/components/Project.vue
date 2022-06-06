<template>
  <div class="row">
    <div class="col-md-8 card" :class="{ finished: statusValue == 'finished' }">
      <div class="card-header">
        <h4>{{ project.name }}</h4>
      </div>
      <div class="card-body text-left">
        <p v-html="project.description" />
        <div
          v-for="(task, i) in project.tasks"
          :key="i"
          class="alert alert-primary"
        >
          <span @click="complete(task.name, i)" class="checkbox">
            <div v-if="task.progress" class="check">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 76.887 55.552"
                style="enable-background:new 0 0 76.887 55.552;"
                xml:space="preserve"
              >
                <polygon
                  style="fill:#fff;"
                  points="34.373,49.541 76.887,5.889 70.739,0 28.426,43.458 6.078,20.632 0,26.585 22.488,49.557 
                                  22.488,49.557 28.517,55.552 28.426,55.467 28.517,55.552 34.373,49.541 	"
                />
              </svg>
            </div>
          </span>
          <p>{{ task.name }}</p>
        </div>
      </div>
      <div></div>
    </div>
    <div class="col-md-4 text-left">
      <h5>Progress - {{ slider }}%</h5>
      <input class="w-100" type="range" min="0" max="100" v-model="slider" />
      <button v-if="slider !== project.progress" @click="save" class="btn btn-primary">Save</button>
      <button v-else class="btn btn-primary" style="opacity: 0.4">Save</button>
      <div class="card my-4">
        <div class="card-header">
          <h4>Comments</h4>
        </div>
        <div class="card-body">
          <!-- Comments START -->
          <div v-for="(comment, i) in project.comments" :key="i" class="pl-2 mb-3" style="border-left: 2px solid #dcdcdc">
            <div class="d-flex">
              <img class="user-img mr-2" :src="comment.avatar" alt="">
              <div>
                <p class="mb-0">{{ comment.name }}</p>
                <p class="small mb-0">{{comment.text}}</p>
              </div>
            </div>
          </div>
          <!-- Comments END -->
          <div class="d-flex align-items-center mb-2 mt-5">
            <img class="user-img mr-2" :src="user.image" alt="">
            <p class="mb-0">{{ user.name }}</p>
          </div>
          <textarea v-model="commentText" class="w-100" rows="2"></textarea>
          <button @click="setComment" class="btn btn-primary">Comment</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { bus } from "../main";
import axios from 'axios'
import { fb } from '../firebase'

export default {
  name: "project",
  props: ["id", "workingID", "workStatus"],
  data() {
    return {
      statusValue: "",
      slider: 0,
      user: null,
      commentText: ''
    };
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    tasks() {
      return this.$store.state.project.tasks.map((task) => {
        return task.progress;
      });
    },
  },
  watch: {
    project() {
      this.statusValue = this.project.status;
    },
  },
  methods: {
    save() {
      let projectID = this.id;
      let progress = this.slider;
      this.$store.dispatch("setProgress", { projectID, progress });
    },
    status() {
      let projectID = this.id;
      let status = this.statusValue;
      this.$store.dispatch("workingStatus", { projectID, status });

      if (status == "start") {
        let value = "start";
        this.$store.dispatch("startTime", { projectID, value });
      }
      if (status == "pause") {
        let value = "stop";
        this.$store.dispatch("startTime", { projectID, value });
      }
    },
    complete(name, i) {
      let projectID = this.id;
      let taskID = i;
      let taskName = name;
      this.$store.dispatch("completeTask", { projectID, taskID, taskName });
    },
    setComment() {
      let taskID = this.id
      let user = this.user
      let comment = this.commentText
      this.$store.dispatch('newComment', {taskID, user, comment})
      this.commentText = ''
    }
  },
  async created() {
    let projectID = this.id;
    this.$store.dispatch("getProject", projectID);
    this.slider = this.project.progress
    
    fb.auth().onAuthStateChanged( async user => {
      if (user) {
        let userID = user.uid
        let res = await axios.get(`https://manager-47e61-default-rtdb.firebaseio.com/users/${userID}.json`)
        this.user = res.data
      } else {
        this.$router.push('/')
      }
    })
  },
};
</script>

<style lang="scss" scoped>

button {
  font-size: 12px;
}

.user-img {
  width: 24px;
  height: 24px;
  overflow: hidden;
  border-radius: 999px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #04aa6d;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #04aa6d;
  cursor: pointer;
}

.finished {
  border: 1px solid #47c363;
  h4 {
    color: #47c363;
  }
}

.alert {
  transition: 1s;
}
.blur {
  filter: blur(2px);
  pointer-events: none;
  transition: 1s;
}
.card-header {
  .status {
    width: 200px;
    margin-left: auto;

    .form-control {
      border-radius: 3px;
    }
  }
}

.alert {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  p {
    color: #fff;
  }
}
.checkbox {
  position: relative;
  display: inline-block;
  width: 22px;
  height: 22px;
  margin-right: 12px;
  border-radius: 99999999px;
  background-color: #fff;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #fff;
}

.check {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #47c363;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 12px;
  }
}
</style>
