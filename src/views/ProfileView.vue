<template>
    <AdminLayout>
        <template v-slot:maincontent>
            <div class="row admin-maincontent">
                <div class="col-md-3">
                    <div class="border p-3">
                        <!-- <div class="position-relative">
                            <img :src="doctor.user.profilepic" height="132" width="132" v-if="doctor && doctor.user.profilepic" style="border-radius: 50%;"/>
                            <i class="bi bi-pencil-fill position-absolute edit-profilepic" style="font-size: 20px"></i>
                        </div>
                        <input class="d-none" type="file" name="" id="" /> -->
                        <form>
                            <div class="mb-3">
                                <label for="email" class="text-xs">Email</label>
                                <input type="email" class="form-control shadow-none text-xs" id="email"
                                    v-model="doctor.user.email" v-if="doctor">
                            </div>
                            <div class="mb-3">
                                <label for="fullname" class="text-xs">Full name</label>
                                <input type="text" class="form-control shadow-none text-xs" id="fullname"
                                    v-model="doctor.user.fullname" v-if="doctor">
                            </div>
                            <div class="mb-3">
                                <label for="contact" class="text-xs">Contact number</label>
                                <input type="text" class="form-control shadow-none text-xs" id="contact"
                                    v-model="doctor.user.contactnumber" v-if="doctor">
                            </div>
                            <div class="mb-3">
                                <label for="country" class="text-xs">Country</label>
                                <input type="text" class="form-control shadow-none text-xs" id="country"
                                    v-model="doctor.location.country" v-if="doctor && doctor.location">
                            </div>
                            <div class="mb-3">
                                <label for="city" class="text-xs">City</label>
                                <input type="text" class="form-control shadow-none text-xs" id="city"
                                    v-model="doctor.location.city" v-if="doctor && doctor.location">
                            </div>
                            <div class="mb-3">
                                <label for="qualification" class="text-xs">Qualification</label>
                                <input type="text" class="form-control shadow-none text-xs" id="qualification"
                                    v-model="doctor.qualification" v-if="doctor">
                            </div>
                            <div class="mb-3">
                                <label for="gender" class="text-xs">Gender</label>
                                <select class="form-select text-xs shadow-none form-control" id="gender"
                                    v-model="doctor.user.gender" v-if="doctor">
                                    <option value="none">None</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </select>
                            </div>
                            <div class="text-center">
                                <button class="btn primarybtn text-xs text-light" type="submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </template>
    </AdminLayout>
</template>

<script>
import AdminLayout from "@/components/Layouts/AdminLayout.vue";
import axios from "axios";
// import $ from "jquery";

export default {
    name: "ProfileView",
    components: {
        AdminLayout,
    },
    data() {
        return {
            doctor: "",
        };
    },
    mounted() {
        // $("i").click(function () {
        //     $("input[type='file']").trigger("click");
        // });
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            this.$router.push("/login");
        }
        axios
            .get(`http://127.0.0.1:8000/profile/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then((response) => {
                if (response.data.error) {
                    this.showError(response.data.error)
                } else {
                    console.log(response);
                }

            })
            .catch((error) => {
                console.log("error", error);
            });
    },
};
</script>
