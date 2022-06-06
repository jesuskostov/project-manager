<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import { fb } from './firebase'

export default {
  data() {
    return {
      userID: null,
      user: null
    }
  },
  created() {
    fb.auth().onAuthStateChanged( async user => {
      if (user) {
        this.userID = user.uid
        let res = await axios.get(`https://manager-47e61-default-rtdb.firebaseio.com/users/${this.userID}.json`)
        this.user = res.data
      } else {
        this.$router.push('/')
      }
    })
  }
}
</script>

<style lang="scss">
@import 'assets/css/style.css';
@import 'assets/css/components.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.btn-primary {
  background-color: #6777ef !important;
}
</style>
