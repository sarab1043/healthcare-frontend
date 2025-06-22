<template>
    <AdminLayout>
        <template v-slot:maincontent>
            <p class="text-danger alert-danger alert mx-2" id="error" v-if="ErrorMessage">
                {{ ErrorMessage }}
            </p>
            <p class="text-success alert-success alert mx-2" id="success" v-if="SuccessMessage">
                {{ SuccessMessage }}
            </p>
            <div class="row admin-maincontent">
                <div class="col-md-12">
                    <div class="row align-items-end">
                        <div class="col-3">
                            <h6>Upcoming Appointments</h6>
                        </div>
                        <div class="col-9 text-end">
                            <div class="d-inline-block me-5">
                                <label for="search">Search by User Name or Email:</label>
                                <input v-model="searchQuery" @input="filterAppointments" type="text" id="search"
                                    class="form-control text-xs border-0 shadow-none py-1" />
                            </div>
                            <div class="d-inline-block">
                                <div>
                                    <label for="day">Select Day:</label>
                                    <select id="day" class="form-select-sm py-0 text-sm" v-model="selectedDay"
                                        @change="filterAppointments">
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <label for="date">Enter Date:</label>
                                    <!-- <input type="date" id="date" class="py-0 text-sm"> -->
                                    <input v-model="selectedDate" @change="filterAppointments" type="date" id="date"
                                        class="py-0 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table table-hover">
                        <thead class="">
                            <tr>
                                <th scope="col" class="text-white">S.No</th>
                                <th scope="col" class="text-white">Patient email</th>
                                <th scope="col" class="text-white">Patient name</th>
                                <th scope="col" class="text-white">Contact</th>
                                <th scope="col" class="text-white">Specialization</th>
                                <th scope="col" class="text-white">Scheduled Time</th>
                                <th scope="col" class="text-white">Scheduled Day</th>
                                <th scope="col" class="text-white">Status</th>
                                <th scope="col" class="text-white">Handle</th>
                            </tr>
                        </thead>
                        <tbody v-if="!appointmentsfound">
                            <div class="text-danger">No appointment found</div>
                        </tbody>
                        <tbody v-if="appointmentsfound">
                            <tr v-for="(a, index) in filteredAppointments" :key="a.id">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ a.patientEmail }}</td>
                                <td>{{ a.patientName }}</td>
                                <td>{{ a.patientphoneNumber }}</td>
                                <td>{{ a.specialization.name }}</td>
                                <td>{{ a.start_time }} - {{ a.end_time }}</td>
                                <td><span v-if="a.day"> {{ a.day }} </span> {{ a.date }}</td>
                                <td class="text-success" :class="{
                'text-danger':
                    a.status === 'Cancelled' || a.status === 'Pending',
            }">
                                    {{ a.status }}
                                </td>
                                <td>
                                    <button class="btn btn-danger btn-sm p-1 py-0 text-xs me-1"
                                        v-if="a.status != 'Cancelled'" @click="cancel(a.id)">
                                        Cancel
                                    </button>
                                    <button class="btn btn-success btn-sm p-1 py-0 text-xs me-1" v-if="
                                        a.status != 'Confirmed' &&
                                        a.status != 'Cancelled' &&
                                        a.status != 'Rescheduled'
                                        " @click="confirm(a.id)">
                                        Confirm
                                    </button>

                                    <!-- <button class="btn btn-success btn-sm p-1 py-0 text-xs" @click="reschedule(a.id)">Reschedule</button> -->
                                    <button type="button" class="btn btn-success btn-sm p-1 py-0 text-xs"
                                        data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Reschedule
                                    </button>
                                </td>
                                <!-- Reschedule model -->

                                <div class="modal fade" id="exampleModal" tabindex="-1"
                                    aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static"
                                    data-bs-keyboard="false">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <p class="text-danger mb-0" v-if="errorMessage">
                                                    {{ errorMessage }}
                                                </p>

                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body d-flex align-items-baseline">

                                                <div class="mb-2 me-3" style="width: 40%">
                                                    <label for="date" class="form-label text-xs fw-bold">Date<span
                                                            class="text-danger">*</span></label>
                                                    <date-picker v-model="newrescheduled_date"
                                                        :format="customDateFormat"
                                                        :min-date="currentDate"></date-picker>
                                                </div>
                                                <div class="mb-2 w-50">
                                                    <TimeSlotSelect :doctor="doctor" :selectedDate="newrescheduled_date"
                                                        @timeSlotSelected="onTimeSlotSelected" />
                                                    <TimeSlotSelect :doctor="doctor" :selectedDate="newrescheduled_date" @timeSlotSelected="onTimeSlotSelected" />

                                                    <!-- <label for="start_time" class="d-block">Select a start time:</label>
                                                    <input type="time" id="appt" name="start_time" class="py-0 text-sm"
                                                        v-model="newrescheduled_start_time" /> -->
                                                </div>
                                                <!-- <div class="mb-2 me-3">
                                                    <label for="end_time" class="d-block">Select a start time:</label>
                                                    <input type="time" id="appt" name="end_time" class="py-0 text-sm"
                                                        v-model="newrescheduled_end_time" />
                                                </div> -->
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary py-1 text-xs"
                                                    data-bs-dismiss="modal">
                                                    Close
                                                </button>

                                                <button type="button" class="btn btn-success py-1 text-xs"
                                                    @click="reschedule(a.id)">
                                                    Reschedule
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </AdminLayout>
</template>
<style>
.dp--tp-wrap {
    display: none !important;
}

.dp__input {
    font-size: 13px !important;
    padding: 3px 4px !important;
    border: 1px solid #ddd !important;
}
</style>
<script>
import TimeSlotSelect from '@/components/TimeSlotComponent.vue'
import AdminLayout from "@/components/Layouts/AdminLayout.vue";
import axios from "axios";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
    name: "UpcomingAppointmentsView",
    components: {
        AdminLayout,
        DatePicker,
        TimeSlotSelect
    },
    data() {
        return {
            appointments: [], 
            // appointments: "",
            selectedDate: "",
            selectedDay: "",
            appointmentsfound: true,
            errorMessage: "",
            rescheduled_start_time: "",
            newrescheduled_start_time: "",
            rescheduled_end_time: "",
            newrescheduled_end_time: "",
            rescheduled_date: "",
            newrescheduled_day: "",
            rescheduled_day: "",
            newrescheduled_date: "",
            formatted_date: "",
            customDateFormat: "yyyy-MM-dd",
            ErrorMessage: "",
            SuccessMessage: "",
            currentDate: new Date().toISOString().split("T")[0],
            searchQuery: "",
            doctor: []
        };
    },
    computed: {
        filteredAppointments() {
            let filtered = this.appointments;
            console.log("filtered",filtered)
            // this.checkAppointmentsFound(); 
            // console.log("filtered", filtered);
            if (this.selectedDay) {
                filtered = filtered.filter((appointment) =>
                    appointment.rescheduled_day
                        ? appointment.rescheduled_day === this.selectedDay
                        : appointment.day === this.selectedDay
                );
            }
            if (this.selectedDate) {
                filtered = filtered.filter((appointment) =>
                    appointment.rescheduled_date
                        ? appointment.rescheduled_date === this.selectedDate
                        : appointment.date === this.selectedDate
                );
            }

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (appointment) =>
                        appointment.patientEmail.toLowerCase().includes(query) ||
                        appointment.patientName.toLowerCase().includes(query)
                );
            }
            console.log("filtered")
            console.log(filtered.length);

            return filtered;
        },
    },
    mounted() {
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
                if (response.data.data.error) {
                    this.showError(response.data.error);
                } else {
                    if (response.data.data.user.role === "Doctor") {
                        this.doctor = response.data.data
                        this.fetchAppointments(authToken);
                    } else {
                        this.$router.push("/dashboard");
                    }
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    },
    methods: {
        checkAppointmentsFound() {
            this.appointmentsfound = this.filteredAppointments.length > 0;
        },
        cancel(id) {
            console.log(id);
            axios
                .put(
                    `http://127.0.0.1:8000/doctor/appointments/${id}/`,
                    {
                        status: "Cancelled",
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status == 200) {
                        this.showSuccess(response.data.success);
                        this.fetchAppointments(localStorage.getItem("authToken"));
                    }
                    if (response.data.error) {
                        this.showError(response.data.error);
                    }
                })
                .catch((error) => {
                    console.log("Error status:", error.response.status);
                });
        },
        confirm(id) {
            console.log(id);
            axios
                .put(
                    `http://127.0.0.1:8000/doctor/appointments/${id}/`,
                    {
                        status: "Confirmed",
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status == 200) {
                        this.showSuccess(response.data.success);
                        this.fetchAppointments(localStorage.getItem("authToken"));
                    }
                    if (response.data.error) {
                        this.showError(response.data.error);
                    }
                })
                .catch((error) => {
                    console.log("Error status:", error.response.status);
                });
        },
        showError(error) {
            this.$toast.error(error, {
                position: "top-right",
                duration: 2000,
            });
        },
        showSuccess(success) {
            this.$toast.success(success, {
                position: "top-right",
                duration: 2000,
            });
        },
        reschedule(id) {
            console.log("this.date", this.newrescheduled_date);
            console.log(id);
            const selectedDate = new Date(this.newrescheduled_date)
                .toISOString()
                .split("T")[0];
            const startTime = this.newrescheduled_start_time + ":00";
            console.log(startTime);
            const endTime = this.newrescheduled_end_time + ":00";
            console.log(endTime);

            axios
                .put(
                    `http://127.0.0.1:8000/doctor/appointments/${id}/`,
                    {
                        status: "Rescheduled",
                        start_time: this.newrescheduled_start_time + ":00",
                        end_time: this.newrescheduled_end_time + ":00",
                        date: selectedDate,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status == 200) {
                        this.closeModal();
                        this.showSuccess(response.data.success);
                        this.fetchAppointments(localStorage.getItem("authToken"));
                    }
                    if (response.data.error) {
                        console.log(response.data.error);
                        this.showError(response.data.error);
                    }
                })
                .catch((error) => {
                    this.errorMessage = error.response.error;
                    this.showError("An Error Occurred! Please try again.");
                });
        },
        fetchAppointments(authToken) {
            axios
                .get(`http://127.0.0.1:8000/doctor/appointments/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then((response) => {
                    this.appointments = response.data.data;
                    console.log("apts", this.appointments);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
        handleDateChange(date) {
            // If the selected date is a valid date string
            if (Date.parse(date)) {
                // Extracting only the date portion without the time
                this.newrescheduled_date = new Date(date).toISOString().split("T")[0];
            } else {
                // Reset selectedDate if the input is invalid
                this.newrescheduled_date = "";
            }
        },
        closeModal() {
            // Close the modal using Bootstrap modal API
            this.errorMessage = "";
            const modal = document.getElementById("exampleModal");
            modal.click();
        },
        isFutureTime(appointment) {
            const startTime = appointment.rescheduled_start_time
                ? new Date(appointment.rescheduled_start_time)
                : new Date(appointment.start_time);
            const endTime = appointment.rescheduled_end_time
                ? new Date(appointment.rescheduled_end_time)
                : new Date(appointment.end_time);
            const currentTime = new Date();
            return startTime > currentTime && endTime > currentTime;
        },
        onTimeSlotSelected({ startTime, endTime }) {
            console.log("start time end time", startTime)
            this.newrescheduled_start_time = startTime;
            this.newrescheduled_end_time = endTime;
        },
    },

    watch: {

        filteredAppointments: {
            handler() {
                this.checkAppointmentsFound();
            },
            immediate: true,
        },
    },
};
</script>
