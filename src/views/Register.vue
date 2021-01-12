<template>
  <div>
    <section class="section">
      <div class="container mt-5">
        <div class="row">
          <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
            <div class="card card-primary">
              <div class="card-header"><h4>Register</h4></div>
              <div class="card-body">
                <form @submit.prevent="register">
                  <div class="empty-state" data-height="400">
                    <div class="author-box card-primary">
                      <div class="card-body flex-row d-flex align-items-center">
                        <div class="avatar-box mr-4">
                          <img v-if="image_load" class="loading-avatar" src="../assets/loading.gif" alt="loader">
                          <img v-if="!image" alt="image" src="../assets/img/avatar/avatar-1.png" class="avatar placeholder">
                          <img v-if="image" alt="image" :src="image" class="avatar">
                        </div>
                        <div class="d-flex flex-column align-items-start">
                          <h2 class="my-0">Upload your avatar</h2>
                          <input type="file" style="display: none" ref="fileInput" @change="uploadPhoto" />
                          <div class="flex-row">
                            <button @click.prevent="onPickFile" class="btn btn-primary mt-2">Upload</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-6">
                      <label for="first_name">First Name</label>
                      <input type="text" class="form-control" v-model="register_info.name" autofocus required>
                    </div>
                    <div class="form-group col-6">
                      <label for="last_name">Last Name</label>
                      <input type="text" class="form-control" v-model="register_info.last_name" required>
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-6">
                      <label for="email">Email</label>
                      <input type="email" class="form-control" v-model="register_info.email" required>
                    </div>
                    <div class="form-group col-6">
                      <label for="password">Password</label>
                      <input type="password" class="form-control pwstrength" v-model="register_info.password" required>
                    </div>
                  </div>
                  <div class="form-group text-center">
                    <button v-if="!loading" type="submit" class="btn btn-primary btn-lg btn-block">
                      Register
                    </button>
                    <button v-if="loading" class="btn btn-primary btn-lg btn-block btn-progress">
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div class="simple-footer">
              Copyright &copy; ProjectManager - Jesus Kostov 2020
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { fb } from '../firebase'
import Axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      image_load: false,
      image: '',
      register_info: {
        userID: '',
        name: '',
        last_name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async register() {
      this.loading = true
      const registration = await fb.auth().createUserWithEmailAndPassword(this.register_info.email, this.register_info.password)
      let userID = registration.user.uid
      this.userID = userID
      
      await Axios.put(`https://manager-47e61-default-rtdb.firebaseio.com/users/${userID}.json`, {
        name: this.register_info.name,
        last_name: this.register_info.last_name,
        image: this.image
      })
      this.loading = false
      this.$router.push('/')
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    uploadPhoto(e) {
      this.image_load = true
      let image = e.target.files[0];
      let storageRef = fb.storage().ref("avatar/" + image.name);
      let uploadImage = storageRef.put(image);
      uploadImage.on(
        "state_changed",
        () => {},
        () => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          uploadImage.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.image = downloadURL;
            this.image_load = false
          });
        }
      );
    },
  },
  created() {
    fb.auth().onAuthStateChanged( user => {
      if (user) {
        this.$router.push('/')
      }
    })
  }
}
</script>

<style lang="scss">
.loading-avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140%;
  z-index: 123123;
  transform: translate(-50%, -50%);
}

.avatar-box {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 99999999px;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading {
  width: 40px;
  height: 40px;
}

.form-group {
  text-align: left;
}


</style>