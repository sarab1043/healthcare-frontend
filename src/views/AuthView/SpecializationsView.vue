<template>
    <AuthLayout>
        <p class="text-danger text-center" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="text-success text-center" v-if="successMessage">{{ successMessage }}</p>
        <form ref="myForm">
            <div class="">
                <label for="specializations" class="form-label text-xs">Specializations</label>
                <select class="form-select shadow-none" id="multiple-select-field" data-placeholder="Choose specializations" multiple>
                    <option v-for="specialization in specializations" :key="specialization.id" :value="specialization.name">
                        {{ specialization.name }}
                    </option>                             
                </select>
            </div>
            <p class="invalid-feedback d-block" v-if="!isSpecializationsValid">
                Specializations required
            </p>
            <div class="d-grid mt-3">
                <button type="button" class="authbtn btn border-0 shadow-none text-xs text-light m-auto"
                    @click="next()">
                    Save
                </button>
            </div>
        </form>
    </AuthLayout>
</template>
<script>
import $ from 'jquery';
import 'select2';
import AuthLayout from "@/components/Layouts/AuthLayout";
import axios from 'axios';

export default {
    name: "SpecializationsView",
    components: {
        AuthLayout,
    },
    data() {
        return {
            errorMessage: '',
            successMessage: '',
            isSpecializationsValid: true,
            specializations: [],
            selectedspecializations: [],
            email: '',
            password: '',
            fullname: '',
            gender: '',
            qualification: '',
            country: '',
            city: '',
        };
    },
    methods: {
        clearSpecializationsErrorMessage() {
            console.log("clear error")
            this.isSpecializationsValid = true;
        },
        getSpecializations() {
            axios
                .get("http://127.0.0.1:8000/specializations/")
                .then((response) => {
                    if (response.status == 200) {
                        if (response.data.error) {
                            this.errorMessage = response.data.error;
                        } else {
                            this.specializations = response.data.data
                            console.log(response)
                        }
                    }
                })
                .catch((error) => {
                    console.log("error", error);
                    this.errorMessage = "Something went wrong";
                });
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
        next() {
            if (this.selectedspecializations.length > 0) {
                console.log("register now");
                console.log("this.selectedspecializations", this.selectedspecializations)
                axios.post("http://127.0.0.1:8000/signup/", {
                    email: this.email,
                    password: this.password,
                    fullname: this.fullname,
                    city: this.city,
                    country: this.country,
                    qualification: this.qualification,
                    specializations: this.selectedspecializations,
                    gender: this.gender,
                    role: this.role
                })
                .then((response) => {
                    console.log("resp", response)
                    if (response.data.error){
                        this.showError(response.data.error)
                    }
                    else{
                        this.showSuccess(response.data.success)
                        localStorage.setItem("authToken", response.data.data.token);
                        this.$router.push('/')
                    }
                })
                .catch((error) => {
                    console.log("error", error);
                    this.showError("An Error Occurred! Please try again.")
                });
                // Proceed with registration or other actions
            } else {
                this.isSpecializationsValid = false;
                console.log("selected", this.isSpecializationsValid);
            }
        }
    },
    mounted() {
        this.getSpecializations()
        $('#multiple-select-field').select2({
            theme: "bootstrap-5",
            containerCssClass: "select2--small",
            selectionCssClass: "select2--small",
            dropdownCssClass: "select2--small",
        })
        .on('change', () => {
            this.selectedspecializations = $('#multiple-select-field').val() || [];
            // this.selectedspecializations = selectedValues.map(val => parseInt(val));
            this.clearSpecializationsErrorMessage();
        });


        const registrationData = this.$store.state.registrationData;
        console.log("registrationData",registrationData)
        if (
            !registrationData ||
            !registrationData.email ||
            !registrationData.password ||
            !registrationData.role
        ) {
            this.$router.push("/register");
        }
        else if  (!registrationData || !registrationData.country || !registrationData.city ) {
            this.$router.push("/address");

        }
        else if  (!registrationData.qualification) {
            this.$router.push("/qualification");

        }
        else{
            this.email = registrationData.email,
            this.password = registrationData.password,
            this.fullname = registrationData.fullname,
            this.gender = registrationData.gender,
            this.country = registrationData.country,
            this.city = registrationData.city,
            this.qualification = registrationData.qualification
            this.role = registrationData.role
            console.log("city on spec", this.city)

        }
    },
};
</script>
