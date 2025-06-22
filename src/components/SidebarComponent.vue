<template>
    <nav id="sidebar" class="py-2">
        <div class="sidebar-header text-center">
            <router-link to="/" class="navbar-brand py-0 bg-transparent border-0 "><img src="../assets/logo.png"
                    height="90" /></router-link>
        </div>
        <ul class="list-group mt-5">
            <li class="list-group-item bg-transparent border-0" aria-current="true">
                <router-link to="/upcoming-appointments" class="text-decoration-none text-light border-0"> Appointments</router-link>
            </li>
            <li class="list-group-item bg-transparent border-0"><router-link to="/availability"
            class="text-decoration-none text-light border-0">Availability</router-link></li>
            <li class="list-group-item bg-transparent border-0"><router-link to="/patient-history"
            class="text-decoration-none text-light border-0">Patient History</router-link></li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: "SidebarComponent",
}
</script>