<template>
    <section class="admin">
        <div class="wrapper d-flex">
            <SidebarComponent></SidebarComponent>
            <div class="content" id="content">
                <div class="w-100">
                    <div class="top-navbar">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <button type="button" id="sidebarCollapse" class="btn shadow-none border-0 text-sm ">
                                    <i class="bi bi-list" style="font-size:28px"></i>
                                </button>
                            </div>
                            <div class="col-6 text-end">
                                <div class="me-3">
                                    <div class="d-inline-block me-2"><img src="../../assets/images/user.png"
                                            class="img-fluid" width="35" height="35"></div>
                                    <div class="dropdown d-inline-block">
                                        <button
                                            class="btn btn-secondary dropdown-toggle bg-transparent text-dark border-0 p-0"
                                            type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                            style="font-size: 21px;">
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <router-link to="/profile" class="dropdown-item" style="cursor: pointer;">Edit
                                                    Profile</router-link>
                                            </li>
                                            <li class="dropdown-item" @click="logout()" style="cursor: pointer;">Logout</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <slot name="maincontent">
                    </slot>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
import SidebarComponent from '@/components/SidebarComponent.vue'
export default {
    name: "AdminLayout",
    components: {
        SidebarComponent
    },
    data() {
        return {
            isSidebarVisible: true
        };
    },
    mounted() {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });
    },
    methods: {
        logout() {
            axios.get('http://127.0.0.1:8000/logout/', {
                headers: {
                    Authorization: localStorage.getItem("authToken")
                }
            }).then(response => {
                console.log(response)
                if (response.status == 200) {
                    localStorage.removeItem("authToken");
                    this.$router.push('/')
                }
            })
            .catch(error => {
                // Handle logout error
                console.error('Logout error:', error);
            });
        }
    }
}
</script>