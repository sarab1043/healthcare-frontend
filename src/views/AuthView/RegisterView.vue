<template>
    <AuthLayout>
        <form ref="myForm">
            <div class="mb-3">
                <label for="fullname" class="form-label text-xs">Full name</label>
                <input type="text" class="form-control shadow-none text-xs" id="fullname" name="fullname"
                    placeholder="Enter full name" v-model="fullname" @input="clearFullnameErrorMessage"
                    :class="{ 'is-invalid': !isFullnameValid }" />
                <p class="invalid-feedback" v-if="!isFullnameValid">
                    Please enter a Full name.
                </p>
            </div>

            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label text-xs">Email address</label>

                <input type="email" class="form-control shadow-none text-xs" id="exampleInputEmail1"
                    aria-describedby="emailHelp" name="email" placeholder="Enter email" v-model="email"
                    @input="clearEmailErrorMessage" :class="{ 'is-invalid': !isEmailValid }" />
                <p class="invalid-feedback" v-if="!isEmailValid">
                    Please enter a Valid Email.
                </p>
            </div>
            <div class="mb-3 position-relative">
                <label for="password" class="form-label text-xs">Password</label>
                <input :type="inputType" class="form-control shadow-none text-xs" id="exampleInputPassword1"
                    name="password" placeholder="Enter password" v-model="password"
                    :class="{ 'is-invalid': !isPasswordValid }" @input="clearPasswordErrorMessage" required />
                <i class="bi bi-eye-fill eye text-dark text-xs position-absolute eye_icon"
                    @click="togglePasswordVisibility" v-if="isPasswordValid"></i>
                <p class="invalid-feedback" v-if="!isPasswordValid">
                    Please enter a valid password (8-30 characters with uppercase,
                    lowercase, numbers, and symbols).
                </p>

            </div>

            <div class="mb-3">
                <label for="gender" class="form-label text-xs">Gender</label>
                <select class="form-select shadow-none text-xs border-0" v-model="selectedGender"
                    placeholder="Choose gender" @change="clearGenderErrorMessage">
                    <option v-for="(g, index) in genderOptions" :key="index" :value="g">
                        {{ g }}
                    </option>
                </select>
                <p class="invalid-feedback d-block" v-if="!isGenderValid">
                    Gender is required.
                </p>
            </div>

            <div class="mb-3">
                <label for="role" class="form-label text-xs">Role</label>
                <select class="form-select shadow-none text-xs border-0" v-model="selectedRole"
                    placeholder="Choose Role" @change="clearRoleErrorMessage">
                    <option v-for="(r, index) in roleOptions" :key="index" :value="r">
                        {{ r }}
                    </option>
                </select>
                <p class="invalid-feedback d-block" v-if="!isRoleValid">
                    Role is required.
                </p>
                <!-- <router-link to="/forgotPassword" class="text-xs float-end mt-2 mb-3">Forgot Password?</router-link> -->
            </div>

            <p class="text-dark text-xs mt-5">
                Already have an account? <router-link to="/login">Login</router-link>
            </p>
            <div class="d-grid mt-3">
                <button type="button" class="authbtn btn border-0 shadow-none text-xs text-light m-auto"
                    @click="next()">
                    Next
                </button>
            </div>
        </form>
    </AuthLayout>
</template>

<script>
import AuthLayout from '@/components/Layouts/AuthLayout'
import axios from 'axios';


export default {
    name: "RegisterView",
    components: {
        AuthLayout
    },
    data() {
        return {
            email: "",
            password: "",
            fullname: "",
            isEmailValid: true,
            isPasswordValid: true,
            isFullnameValid: true,
            inputType: "password",
            genderOptions: ['Male', 'Female'],
            roleOptions: ['Doctor', 'Patient'],
            isGenderValid: true,
            isRoleValid: true,
            selectedGender: '',
            selectedRole: ''
        };
    },
    methods: {
        clearFullnameErrorMessage() {
            this.isFullnameValid = true
        },
        clearEmailErrorMessage() {
            const validate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
            this.isEmailValid = validate;
        },
        clearPasswordErrorMessage() {
            const containsUppercase = /[A-Z]/g.test(this.password);
            const containsLowercase = /[a-z]/g.test(this.password);
            const containsNumber = /[0-9]/g.test(this.password);
            const containsSpecial = /(?=.*?[#?!@$%^&*-_.])/g.test(this.password);
            const hasValidLength =
                this.password.length >= 8 && this.password.length <= 30;

            this.isPasswordValid =
                containsUppercase &&
                containsLowercase &&
                containsNumber &&
                containsSpecial &&
                hasValidLength;
        },
        clearGenderErrorMessage() {
            this.isGenderValid = true
        },
        clearRoleErrorMessage() {
            this.isRoleValid = true
        },
        next() {
            let isValid = true;

            // Check if email is valid
            if (!this.email) {
                this.isEmailValid = false;
                isValid = false;
            } else {
                this.isEmailValid = true;
            }

            // Check if password is valid
            if (!this.password) {
                this.isPasswordValid = false;
                isValid = false;
            } else {
                this.isPasswordValid = true;
            }

            // Check if full name is valid
            if (!this.fullname) {
                this.isFullnameValid = false;
                isValid = false;
            } else {
                this.isFullnameValid = true;
            }

            if (!this.selectedGender) {
                this.isGenderValid = false;
                isValid = false;
            } else {
                this.isGenderValid = true;
            }
            if (!this.selectedRole) {
                this.isRoleValid = false;
                isValid = false;
            } else {
                this.isRoleValid = true;
            }
            if (isValid && this.selectedRole == 'Patient') {
                axios.post("http://127.0.0.1:8000/signup/", {
                    email: this.email,
                    password: this.password,
                    role: this.selectedRole,
                    gender: this.selectedGender,
                    full_name: this.fullname
                })
                    .then((response) => {
                        console.log("resp", response)
                        if (response.data.error) {
                            this.showError(response.data.error)
                        }
                        else {
                            this.showSuccess(response.data.success)
                            this.$router.push('/dashboard')
                        }

                    })
                    .catch((error) => {
                        console.log("error", error);
                        this.showError("An Error Occurred! Please try again.")
                    });
            }
            if (isValid && this.selectedRole == 'Doctor') {
                this.$store.commit('setRegistrationData', {
                    email: this.email,
                    password: this.password,
                    fullname: this.fullname,
                    gender: this.selectedGender,
                    role: this.selectedRole
                });
                this.$router.push('/address');
            }

            // if (isValid) {
            //     axios.post("http://127.0.0.1:8000/signup/", {
            //         email: this.email,
            //         password: this.password
            //     })
            //     .then((response) => {
            //         console.log("resp", response)
            //         if (response.data) {
            //             this.$store.commit('setRegistrationData', {
            //                 email: this.email,
            //                 password: this.password,
            //                 fullname: this.fullname,
            //                 gender: this.selectedGender,
            //                 role: this.role
            //             });
            //             this.$router.push('/address');
            //         } else if (response.data.error) {
            //             this.errorMessage = response.data.error
            //         }
            //     })
            //     .catch((error) => {
            //         console.log("error", error);
            //         this.errorMessage = "Something went wrong";
            //     });
            // }
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
        // next(){
        //     if (this.email && this.password && this.fullname) {
        //         axios.post("http://127.0.0.1:8000/doctor/signup/", {
        //         email: this.email,
        //         password: this.password
        //     })
        //     .then((response) => {
        //         console.log("resp", response)
        //         if (response.data.redirectUrl){
        //             this.$store.commit('setRegistrationData', {
        //                 email: this.email,
        //                 password: this.password
        //             });
        //             this.$router.push('/qualification');
        //         }else if  (response.data.error){
        //             this.errorMessage = response.data.error
        //         }})
        //     .catch((error) => {
        //         console.log("error", error);
        //         this.errorMessage = "Something went wrong";
        //     });
        //     } else if (!this.email) {
        //         this.isEmailValid = false;
        //     } else if (!this.password) {
        //         this.isPasswordValid = false;
        //     } else if (!this.fullname){
        //         this.isFullnameValid = false
        //     }
        //     else {
        //         this.isEmailValid = false;
        //         this.isPasswordValid = false;
        //         this.fullname = false
        //     }

        // },
        togglePasswordVisibility() {
            this.inputType = this.inputType === "password" ? "text" : "password";
        },
    },
    mounted() {
        // localStorage.clear();

        // const authToken = localStorage.getItem("authToken");
        // if (authToken) {
        //     this.$router.push("/profile");
        // }
    },
};
</script>
