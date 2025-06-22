<template>
    <AuthLayout>
        <form ref="myForm">
            <div class="mb-3">
                <label for="country" class="form-label text-xs">Country</label>
                <input type="text" class="form-control shadow-none text-xs" id="country" name="country"
                    placeholder="Enter country" v-model="country" @input="clearCountryErrorMessage" :class="{ 'is-invalid': !isCountryValid }"  />
                <p class="invalid-feedback" v-if="!isCountryValid">
                    Country required.
                </p>
            </div>
            <div class="mb-3">
                <label for="city" class="form-label text-xs">City</label>
                <input type="text" class="form-control shadow-none text-xs" id="city" name="city"
                    placeholder="Enter city" v-model="city" @input="clearCityErrorMessage" :class="{ 'is-invalid': !isCityValid }"  />
                <p class="invalid-feedback" v-if="!isCityValid">
                    City required.
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
    name: "AddressView",
    components: {
        AuthLayout,
    },
    data() {
        return {
            isCountryValid: true,
            isCityValid: true,
            country: '',
            city: ''
        };
    },
    methods: {
        clearCountryErrorMessage() {
            this.isCountryValid = true;
        },
        clearCityErrorMessage() {
            this.isCityValid = true;
        },
        next(){
            if (this.country && this.city){
                const registrationData = this.$store.state.registrationData || {};
                // Merge the existing registration data with new data
                const updatedData = {
                    ...registrationData,
                    country: this.country,
                    city: this.city
                };
                this.$store.commit('setRegistrationData', updatedData);
                this.$router.push("/qualification");
            }
            else{
                this.isCountryValid = false;
                this.isCityValid = false;
            }
        }
    },
    mounted() {
        const registrationData = this.$store.state.registrationData;
        console.log("registrationData", registrationData)
        if (
            !registrationData ||
            !registrationData.email ||
            !registrationData.password ||
            !registrationData.role
        ) {
            // Redirect the user to the register route if registrationData is not available or incomplete
            this.$router.push("/register");
        }
    },
};
</script>
