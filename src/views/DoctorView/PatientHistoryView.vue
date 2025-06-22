<template>
    <AdminLayout>
        <template v-slot:maincontent>
            <div class="row" style="padding: 105px 46px 0px 46px">
                Patient History View
            </div>
        </template>
    </AdminLayout>
</template>

<script>

import AdminLayout from "@/components/Layouts/AdminLayout.vue";
export default {
    name: "PatientView",
    components: {
        AdminLayout,
    },
    data() {
        return {
            
    }
}
};
</script>