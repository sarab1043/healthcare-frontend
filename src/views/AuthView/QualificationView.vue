<template>
    <AuthLayout>
        <form ref="myForm">
            <div class="mb-3">
                <label for="qualification" class="form-label text-xs">Qualification</label>
                <input type="text" class="form-control shadow-none text-xs" id="qualification" name="qualification"
                    placeholder="Enter qualifications" v-model="qualification" @input="clearQualificationErrorMessage" :class="{ 'is-invalid': !isQualificationValid }"  />
                <p class="invalid-feedback" v-if="!isQualificationValid">
                    *required.
                </p>
            </div>
            <div class="d-grid mt-3">
            <button type="button" class="authbtn btn border-0 shadow-none text-xs text-light m-auto" @click="next()">
                Next
            </button>
        </div>
        </form>
    </AuthLayout>
</template>

<script>
import AuthLayout from "@/components/Layouts/AuthLayout";

export default {
    name: "QualificationView",
    components: {
        AuthLayout,
    },
    data() {
        return {
            isQualificationValid: true
        };
    },
    methods: {
        clearQualificationErrorMessage() {
            this.isQualificationValid = true;
        },
        next(){
            if (this.qualification){
                const registrationData = this.$store.state.registrationData || {};
                // Merge the existing registration data with new data
                const updatedData = {
                    ...registrationData,
                    qualification: this.qualification,
                };
                this.$store.commit('setRegistrationData', updatedData);
                this.$router.push("/specializations");
            }
            else{
                this.isQualificationValid = false;
            }
        }
    },
    mounted() {
        const registrationData = this.$store.state.registrationData;
        if (
            !registrationData ||
            !registrationData.email ||
            !registrationData.password ||
            !registrationData.role
        ) {
            // Redirect the user to the register route if registrationData is not available or incomplete
            this.$router.push("/register");
        }
        else if (!registrationData || !registrationData.country || !registrationData.city ) {
            this.$router.push("/address");
        }
        else{
            console.log(registrationData.city)
        }
    },
};
</script>
