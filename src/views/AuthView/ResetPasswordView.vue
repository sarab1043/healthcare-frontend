<template>
    <div v-if="!tokenvalid">
        <p class="text-danger text-center text-xs mt-3 mb-1" v-if="tokanvaliderrorMessage">{{ tokanvaliderrorMessage }}</p>
    <p class="text-center text-xs">Don't have an account?
    <router-link to="/register" class="text-xs">Register</router-link></p>
    <p class="text-center text-xs">OR</p>
    <div class="text-center">
        <router-link to="/forgotpassword" class="text-xs authbtn btn text-light m-auto" style="width:148px">Send email again</router-link>
    </div>
</div>
    

    <AuthLayout v-if="tokenvalid">
    <form >
        <div class="mb-3 position-relative">
            <label for="exampleInputPassword1" class="form-label text-xs">Password</label>
            <input :type="inputType1" class="form-control shadow-none text-xs" id="exampleInputPassword1" name="password" placeholder="Enter password" 
            v-model = "password" @input="clearPasswordErrorMessage" :class="{ 'is-invalid': !isPasswordValid }">
            <i class="bi bi-eye-fill eye position-absolute text-xs eye_icon" @click="togglePasswordVisibility" ></i>
            <p class="invalid-feedback" v-if="!isPasswordValid">Please enter a valid password (8-30 characters with uppercase, lowercase, numbers, and symbols).</p>
        </div>
        <div class="mb-3 position-relative">
            <label for="exampleInputPassword2" class="form-label text-xs">Confirm Password</label>
            <input :type="inputType2"  class="form-control shadow-none text-xs" id="exampleInputPassword2" name="confirmPassword" placeholder="Confirm Password" 
            v-model = "confirmpassword" @input="clearconfirmPasswordErrorMessage" :class="{ 'is-invalid': !isConfirmPasswordValid }"
                >
            <i class="bi bi-eye-fill eye position-absolute text-xs eye_icon" @click="toggleConfirmPasswordVisibility" ></i>
            <p class="invalid-feedback" v-if="!isConfirmPasswordValid">{{confirmPasswordError}}</p>
        </div>
        
        <div class="d-grid mt-5">
            <button type="button" class="authbtn btn border-0 shadow-none text-xs text-light m-auto" @click="nextStep">Reset</button>
            <p class="text-center mt-2 text-xs">Don't have an account?
            <router-link to="/register" class="text-xs">Register</router-link></p>
        </div>
    </form>
</AuthLayout>
</template>
<script>
import AuthLayout from '@/components/Layouts/AuthLayout'
import axios from 'axios';

export default {
  name: 'ResetPasswordView',
  components: {
        AuthLayout
},
  data() {
    return {
      password: '',
      confirm_password: '',
      isPasswordValid: true,
      isConfirmPasswordValid: true,
      confirmpassword: '',
      inputType1: 'password',
      inputType2:'password',
      confirmPasswordError: '',
      tokanvaliderrorMessage : '',
      tokenvalid:true
      };
  },
  methods: {
 
    clearPasswordErrorMessage(){
        const containsUppercase = /[A-Z]/g.test(this.password)
        const containsLowercase = /[a-z]/g.test(this.password)
        const containsNumber = /[0-9]/g.test(this.password)
        const containsSpecial = /(?=.*?[#?!@$%^&*-_.])/g.test(this.password)
        const hasValidLength = this.password.length >= 8 && this.password.length <= 30;

        this.isPasswordValid =
            containsUppercase &&
            containsLowercase &&
            containsNumber &&
            containsSpecial &&
            hasValidLength;
    },
    clearconfirmPasswordErrorMessage(){
        this.isConfirmPasswordValid = true
        
    },
    showError(error) {
            this.$toast.error(error, {
                position: 'top-right',
                duration: 2000
            });
        },
        showSuccess(success) {
            this.$toast.success(success, {
                position: 'top-right',
                duration: 2000
            });
        },
    nextStep() {
      if (this.isPasswordValid && this.isConfirmPasswordValid) {
        console.log(this.password)
        console.log(this.confirmpassword)
        if (this.password !== this.confirmpassword){
           this.isConfirmPasswordValid=false
            this.confirmPasswordError = "Password do not match"
        }
        else{
            const token = this.$route.params.token;
            axios.post(`http://127.0.0.1:8000/resetpassword/${token}/`,{
                email: localStorage.getItem('emailtoreset'),
                new_password : this.password
            })
            .then(response => {
                console.log(response)
                if (response.status == 200){
                    if (response.data.error) {
                       this.showError(response.data.error)
                    }
                    else{
                        this.showSuccess(response.data.success)
                        setTimeout(() => {
                            this.$router.push('/login'); // Redirect to login route
                        }, 3000);
                    }
                   
                }
            })
            .catch(error => {
                console.log(error)
                this.showError("An Error Occurred! Please try again.")
            });
        }
        }
        else if (!this.isPasswordValid){
            this.isPasswordValid = false
            this.confirmPasswordError = "required*"

        }else if(this.isConfirmPasswordValid){
            this.isConfirmPasswordValid= false
        }
    },
    toggleConfirmPasswordVisibility(){
      console.log(this.inputType2)
      this.inputType2 = this.inputType2 === "password" ? "text" : "password";
    },
    togglePasswordVisibility(){
      console.log(this.inputType1)
      this.inputType1 = this.inputType1 === "password" ? "text" : "password";
    }
  },
  computed: {
  },
  mounted() {
    console.log("reset password")
        if (!localStorage.getItem('emailtoreset')){
            this.$router.push("/forgotpassword");
        } 
        const uuid = this.$route.params.uuid
        const token = this.$route.params.token
        const email = localStorage.getItem('emailtoreset')
        console.log(email)
        axios
            .get(`http://127.0.0.1:8000/validate/${uuid}/${token}/`, {
                email: localStorage.getItem('emailtoreset'),
            })
            .then((response) => {
                if (response.status == 200) {
                    console.log(response);
                    if (response.data.error) {
                        this.tokenvalid=false
                        this.tokanvaliderrorMessage = response.data.error
                    }
                    else{
                        console.log("this.tokenvalid")
                        this.tokanvaliderrorMessage = ""
                        this.tokenvalid=true
                    }
                }
            })
            .catch(error => {
                console.log(error)
                this.tokenvalid=false
                this.successMessage = ''
                this.tokanvaliderrorMessage = "Something went wrong"
            });

        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            this.$router.push("/profile");
        }
    },
};

</script>
