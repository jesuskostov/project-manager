<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-12 mt-5">
          <div class="card border-top-none">
            <h1>Здравей, в момента не работиш върху нищо</h1>
          </div>
        </div>
      </div>
      <div class="row">
        <div v-if="!opened" class="col-md-3">
          <!-- Profile -->
          <div class="card profile-widget">
            <div class="profile-widget-header">
              <img
                alt="image"
                :src="user.image"
                class="rounded-circle profile-widget-picture ml-3"
              />
              <div class="profile-widget-items">
                <div class="profile-widget-item">
                  <div class="profile-widget-item-label">Tasks</div>
                  <div class="profile-widget-item-value">{{taskLength}}</div>
                </div>
                <!-- <div class="profile-widget-item">
                    <div class="profile-widget-item-label">Following</div>
                    <div class="profile-widget-item-value">2,1K</div>
                  </div> -->
              </div>
            </div>
            <div class="profile-widget-description pt-2 pb-0">
              <div class="profile-widget-name text-left">
                Hi, {{ user.name }} {{ user.last_name }}
              </div>
            </div>
          </div>
          <!-- Profile END -->
          <!-- Options -->
          <div class="card">
            <div class="card-header">
              <h4>Menu</h4>
            </div>
            <div class="card-body">
              <ul class="nav nav-pills flex-column">
                <li
                  @click="
                    (ProjectCreate = false), (home = true), (opened = false)
                  "
                  class="text-left nav-item"
                >
                  <a href="#" class="nav-link" :class="{ active: home }"
                    >Home</a
                  >
                </li>
                <li
                  @click="
                    (ProjectCreate = true), (home = false), (opened = false)
                  "
                  class="text-left nav-item"
                >
                  <a :class="{ active: ProjectCreate }" class="nav-link"
                    >Create new task</a
                  >
                </li>
                <!-- <li class="text-left nav-item">
                  <a href="#" class="nav-link">Настройки на профила</a>
                </li> -->
              </ul>
            </div>
          </div>
          <!-- Options END -->
        </div>
        <div class="col-md-9" style="padding-top: 33px">
          <div v-if="home" class="projects">
            <img
              v-if="!projects"
              style="width: 50%; position: relative; top: -33px;"
              src="../assets/welcome.png"
              alt="welcome"
            />
            <div class="row">
              <div v-for="(project, i) in projects" :key="i" class="col-md-6">
                <div class="card card-primary project-box">
                  <div class="card-header text-left pl-3 pr-4">
                    <h4>{{ project.name }}</h4>
                    <div class="card-header-action">
                      <button
                        @click="
                          (projectID = i), (opened = true), (home = false)
                        "
                        class="btn btn-primary"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                  <div class="card-body text-left px-3">
                    <p class="small" v-html="project.description" />
                    <!-- Progress -->
                    <Progress :progress="project.progress" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProjectCreate v-if="ProjectCreate" />
        </div>
      </div>
      <Project
        v-if="opened"
        :id="projectID"
        :workingID="workOnID"
        :workStatus="workStatus"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { fb } from "../firebase";
import { bus } from "../main";
import ProjectCreate from "../components/Create.vue";
import Project from "../components/Project.vue";
import Progress from "../components/Progress.vue";

export default {
  components: {
    ProjectCreate,
    Project,
    Progress,
  },
  data() {
    return {
      workOnID: null,
      workStatus: null,
      workOnName: "",
      projectID: "",
      userID: "",
      user: "",
      home: true,
      ProjectCreate: false,
      settings: false,
      projects: [],
      opened: false,
      taskLength: 0
    };
  },
  computed: {
    status() {
      return this.$store.state.status;
    },
  },
  watch: {
    async status() {
      let status = this.status.status;
      let projectID = this.status.projectID;

      if (status == "start") {
        let res = await axios.get(
          `https://manager-47e61-default-rtdb.firebaseio.com/projects/${projectID}.json`
        );
        this.workOnName = res.data.name;
        this.workOnID = this.status.projectID;
        this.workStatus = status;
      } else if (status == "pause") {
        this.workOnName = "";
        this.workOnID = null;
        this.workStatus = status;
      } else if (status == "finished") {
        this.workStatus = status;
      }
    },
  },
  methods: {
    async userInfo() {
      let res = await axios.get(
        `https://manager-47e61-default-rtdb.firebaseio.com/users/${this.userID}.json`
      );
      this.user = res.data;
    },
    async fetchProjects() {
      let res = await axios.get(
        `https://manager-47e61-default-rtdb.firebaseio.com/projects.json`
      );
      this.projects = res.data;
      this.ProjectCreate = false;
      this.home = true;
    },
    async showProjects() {
      let res = await axios.get(
        `https://manager-47e61-default-rtdb.firebaseio.com/projects.json`
      );
      this.projects = res.data;
    },
  },
  async created() {
    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userID = user.uid;
        this.userInfo();
      } else {
        this.$router.push("/");
      }
    });
    bus.$on("update", () => {
      this.fetchProjects();
    });
    bus.$on("reload", () => {
      this.showProjects();
    });
    await this.fetchProjects();
    this.taskLength = Object.keys(this.projects).length
  },
};
</script>

<style lang="scss" scoped>
.project-box {
  height: 170px;
  overflow: hidden;
}

.time-label {
  position: absolute;
  top: 75%;
  padding: 0.25rem 0.85rem;
}
.nav-item {
  cursor: pointer;
}
.card {
  &.border-top-none {
    border-top: 0;
    height: 70px;
    background-color: #6777ef;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    h1 {
      color: #fff;
      font-size: 18px;
      margin: 0;
    }
    &.working {
      background-color: #ffa426;
    }
  }
}
</style>
