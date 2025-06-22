import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AuthView/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/AuthView/RegisterView.vue')
  },
  {
    path: '/forgotpassword',
    name: 'forgotpassword',
    component: () => import('../views/AuthView/ForgotPasswordView.vue')
  },
  {
    path: '/resetPassword/:uuid/:token',
    name: 'resetPassword',
    component: () => import('../views/AuthView/ResetPasswordView.vue')
  },
  {
    path: '/qualification',
    name: 'qualification',
    component: () => import('../views/AuthView/QualificationView.vue')
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('../views/AuthView/AddressView.vue')
  },
  {
    path: '/specializations',
    name: 'specializations',
    component: () => import('../views/AuthView/SpecializationsView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/upcoming-appointments',
    name: 'upcoming-appointments',
    component: () => import('../views/DoctorView/UpcomingAppointmentsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/availability',
    name: 'availability',
    component: () => import('../views/DoctorView/AvailabilityView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/patient-history',
    name: 'patient-history',
    component: () => import('../views/DoctorView/PatientHistoryView'),
    meta: { requiresAuth: true }
  },

  {
    path: '/dashboard',
    name: 'patient-dashboard',
    component: () => import('../views/PatientView/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach( (to, from, next) => {

  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    console.log('Auth token:', authToken); // Log the authentication token
    if (!authToken) {
      console.log('Redirecting to login page...');
      next('/login')
    } else {
      axios
      .get(`http://127.0.0.1:8000/profile/`, {
          headers: {
              Authorization: `Bearer ${authToken}`,
          },
      })
      .then((response) => {
          console.log("Profile data:", response.data.data);
          next(); // Continue to the route
      })
      .catch((error) => {
          console.log("Error status:", error.response.status);
          if (error.response.status == 401){
            localStorage.removeItem('authToken')
            next('/login')
          }
      });
    }
  } else {
    // Continue to the route
    next();
    console.log("No authentication required for this route.");
  }
});



export default router
