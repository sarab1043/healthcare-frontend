<template>
  <nav class="navbar navbar-expand-lg py-1 w-100 position-fixed top-0" style="z-index: 999;">
    <div class="container-fluid">
      <a class="navbar-brand py-0" href="#"><img src="../assets/logo.png" height="90" /></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="!userAuthenticated">
            <router-link to="/login"
              class="btn rounded-1 authbtn d-flex align-items-center justify-content-center text-xs text-light">Login</router-link>
          </li>
          <li class="nav-item" v-if="!userAuthenticated">
            <router-link to="/register"
              class="btn rounded-1 authbtn d-flex align-items-center justify-content-center text-xs text-light">Register</router-link>
          </li>
          <li class="nav-item" v-if="userAuthenticated">
            <router-link to="/upcoming-appointments" class="btn rounded-1 authbtn d-flex align-items-center justify-content-center text-xs text-light" v-if="this.role == 'Doctor'">
              <i class="bi bi-person-circle text-light me-2"></i>Profile
            </router-link>
            <router-link to="/dashboard" class="btn rounded-1 authbtn d-flex align-items-center justify-content-center text-xs text-light" v-else>
              <i class="bi bi-person-circle text-light me-2"></i>Profile
            </router-link>
          </li>
          <li class="nav-item" v-if="userAuthenticated">
            <button class="btn rounded-1 authbtn d-flex align-items-center justify-content-center text-xs text-light"
              @click="logout">Logout</button>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#"><button
                class="btn rounded-1 d-flex authbtn align-items-center justify-content-center text-xs text-light d-none">
                Logout
              </button></a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import axios from 'axios';
import $ from 'jquery'; 

export default {
  name: "HeaderComponent",
  components: {
  },
  data() {
    return {
      userAuthenticated: false,
      isScrolled: false,
      role: ''
    };
  },
  methods: {
    logout() {
      axios.get('http://127.0.0.1:8000/logout/', {
        headers: {
          Authorization: localStorage.getItem("authToken")
        }
      }).then(response => {
        console.log(response)
        if (response.status == 200){
            localStorage.removeItem("authToken");
            this.userAuthenticated = false;
        }
      })
        .catch(error => {
          console.error('Logout error:', error);
        });
    },
    handleScroll() {
      console.log("this function called")
      const scrollPosition = window.scrollY;
      if (scrollPosition >= 500) {
        $(".navbar").css("background" , "#ccdbfa");
        $(".navbar").css("box-shadow", "0px 10px 29px -5px rgba(0,0,0,0.1)");
      } else {
        $(".navbar").css("background" , "");
        $(".navbar").css("box-shadow", "");

      }
    }
  },
  mounted() {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      axios.get(`http://127.0.0.1:8000/profile/`, {
          headers: {
              Authorization: `Bearer ${authToken}`,
          },
      })
      .then((response) => {
          console.log("Profile data:", response);
          this.userAuthenticated = true
          console.log("role", response.data.data.user.role)
          this.role = response.data.data.user.role
      })
      .catch((error) => {
          if (error.response.status == 401){
            this.userAuthenticated = false
            localStorage.removeItem('authToken')
          }
      });
    }else{
      this.userAuthenticated = false
    }
    window.addEventListener('scroll', this.handleScroll);
  },
};
</script>
<style scoped>
.nav-transparent {
  background-color: transparent !important; /* Define your transparent background color */
}

.nav-colored {
  background-color: #000 !important; /* Define your colored background color */
}
</style>
