<template>
    <AuthLayout>
        <form ref="myForm" @submit.prevent="login">
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
                    :class="{ 'is-invalid': !isPasswordValid }" @input="clearPasswordErrorMessage" />
                <p class="invalid-feedback" v-if="!isPasswordValid">
                    Please enter a valid password (8-30 characters with uppercase,
                    lowercase, numbers, and symbols).
                </p>
                <i class="bi bi-eye-fill eye text-dark text-xs position-absolute eye_icon"
                    @click="togglePasswordVisibility" v-if="isPasswordValid"></i>
                <router-link to="/forgotPassword" class="text-xs float-end mt-2 mb-3">Forgot Password?</router-link>
            </div>
            <p class="text-dark text-xs mt-5">
                Don't have an account? <router-link to="/register">Register</router-link>
            </p>
            <div class="d-grid mt-3">
                <button type="submit" class="authbtn btn border-0 shadow-none text-xs text-light m-auto">
                    Log In
                </button>
            </div>
        </form>
    </AuthLayout>
</template>

<script>
import AuthLayout from '@/components/Layouts/AuthLayout'
import axios from "axios";

export default {
    name: "LoginView",
    components: {
        AuthLayout
    },
    data() {
        return {
            email: "",
            password: "",
            isEmailValid: true,
            isPasswordValid: true,
            inputType: "password",
        };
    },
    methods: {
        clearEmailErrorMessage() {
            const validate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
            this.isEmailValid = validate;
            this.errorMessage = "";
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
        login() {
            if (this.email && this.password) {
                axios
                    .post("http://127.0.0.1:8000/login/", {
                        email: this.email,
                        password: this.password,
                    })
                    .then((response) => {
                        if (response.status === 200) { // Fix: Use '===' for comparison
                            console.log(response.data);
                            if (response.data.error) {
                                this.showError(response.data.error)
                            } else {
                                console.log("response.data.role=", response.data.data.role); // Fix: Correct assignment operator
                                const token = response.data.data.token;
                                localStorage.setItem("authToken", token);
                                if (response.data.data.role === "Doctor") { // Fix: Use '===' for comparison
                                    this.$router.push("/upcoming-appointments");
                                } else {
                                    this.$router.push('/dashboard')
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.log("error", error);
                        this.showError("An Error Occurred! Please try again.")
                    });
            } else if (!this.email && this.password) {
                this.isEmailValid = false;
            } else if (!this.password && this.email) {
                this.isPasswordValid = false;
            } else {
                this.isEmailValid = false;
                this.isPasswordValid = false;
            }
        },

        togglePasswordVisibility() {
            this.inputType = this.inputType === "password" ? "text" : "password";
        },
    },
    // mounted() {
    //     const authToken = localStorage.getItem("authToken");
    //     if (authToken) {
    //         const authToken = localStorage.getItem("authToken");
    //         axios
    //             .get(`http://127.0.0.1:8000/profile/`, {
    //                 headers: {
    //                     Authorization: `Bearer ${authToken}`,
    //                 },
    //             })
    //             .then((response) => {
    //                if (response.data.role='Doctor'){
    //                 this.$router.push('/upcoming-appointments')
    //                }
    //                if (response.data.role='Patient'){
    //                 this.$router.push('/dashboard')
    //                }
    //             })
    //             .catch((error) => {
    //                 console.log("error", error);
    //             });
    //     }
    // },
};
</script>
