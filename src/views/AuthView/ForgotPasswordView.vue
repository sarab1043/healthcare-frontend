<template>
    <AuthLayout>
        <div class="text-center">
            <p class="text-sm">Please enter your email. A link will be sent to your email to reset your password.</p>
        </div>

        <form ref="myForm" @submit.prevent="sendemail">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label text-xs">Email address</label>
                <input type="email" class="form-control shadow-none text-xs" id="exampleInputEmail1"
                    aria-describedby="emailHelp" name="email" placeholder="Enter email" v-model="email"
                    @input="clearEmailErrorMessage" :class="{ 'is-invalid': !isEmailValid }">
                <p class="invalid-feedback" v-if="!isEmailValid">{{ emailMessage }}</p>
            </div>
            <div class="d-grid mt-5">
                <button type="submit" class="authbtn btn border-0 shadow-none text-xs text-light m-auto">
                    Send email
                </button>
                <p class="text-center mt-2 text-xs">Don't have an account?
                    <router-link to="/register" class="text-xs">Sign
                        Up</router-link>
                </p>
            </div>
        </form>
    </AuthLayout>
</template>
<script>
import AuthLayout from '@/components/Layouts/AuthLayout'
import axios from 'axios';
export default ({
    name: 'ForgotPasswordView',
    components: {
        AuthLayout
    },
    data() {
        return {
            emailMessage: '',
            isEmailValid: true,
            email: '',
        }
    },
    methods: {
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
        clearEmailErrorMessage() {
            this.isEmailValid = false
            this.emailMessage = "Please enter valid email address*"
            const validate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
            this.isEmailValid = validate
        },
        sendemail() {
            if (!this.email) {
                this.isEmailValid = false
                this.emailMessage = "required*"
            }
            else {
                if (this.isEmailValid) {
                    axios
                        .post(`http://127.0.0.1:8000/forgotpassword/`, {
                            email: this.email,
                        })
                        .then((response) => {
                            if (response.status == 200) {
                                console.log(response);
                                if (response.data.error) {
                                   this.showError(response.data.erro)
                                } else {
                                    localStorage.setItem("emailtoreset", this.email)
                                    this.showSuccess(response.data.success)
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            this.successMessage = ''
                            this.errorMessage = "Somthing went wrong"
                        });
                }
                else {
                    this.isEmailValid = false
                }
            }
        }
    },

})
</script>