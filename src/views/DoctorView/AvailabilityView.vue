<template>
    <AdminLayout>
        <template v-slot:maincontent>
            <div class="row" style="padding: 105px 46px 0px 46px">
                <ul class="nav nav-tabs border-0" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active text-dark me-2" id="list-tab" data-bs-toggle="tab"
                            data-bs-target="#list-tab-pane" type="button" role="tab" aria-controls="list-tab-pane"
                            aria-selected="true">
                            <i class="bi bi-card-list"></i> List view
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-dark" id="calendar-tab" data-bs-toggle="tab"
                            data-bs-target="#calendar-tab-pane" type="button" role="tab"
                            aria-controls="calendar-tab-pane" aria-selected="false">
                            <i class="bi bi-calendar-check-fill"></i> Calendar View
                        </button>
                    </li>
                </ul>
                <div class="tab-content py-3" id="myTabContent">
                    <!-- LIST VIEW -->
                    <div class="tab-pane fade show active" id="list-tab-pane" role="tabpanel" aria-labelledby="list-tab"
                        tabindex="0">
                        <div class="row">
                            <div class="col-xl-5 col-lg-7 col-md-8">
                                <h5 class="fw-bold">Weekly Hours</h5>
                                <table class="table mt-5 table-borderless">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="fw-bold">Availability</th>
                                            <th scope="col" class="fw-bold">Day</th>
                                            <th scope="col" class="fw-bold">Time Slots</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(day, index) in days" :key="index">
                                            <td>
                                                <input type="checkbox" v-model="day.available"
                                                    @change="addNewTimeSlot(day)" />
                                            </td>
                                            <td>{{ day.name }}</td>
                                            <td>
                                                <div v-if="day.timeslot.length === 0 || !day.available">
                                                    <small class="text-danger">Unavailable</small>
                                                </div>
                                                <div class="" v-else-if="day.timeslot" v-for="i in day.timeslot"
                                                    :key="i.id">
                                                    <VueTimepicker v-model="i.start_time" class="me-2 text-xs"
                                                        @change="checkForOverlap(day, i)">
                                                    </VueTimepicker>

                                                    <VueTimepicker v-model="i.end_time" class="me-2 text-xs"
                                                        @change="checkForOverlap(day, i)">
                                                    </VueTimepicker>
                                                    <button class="btn shadow-none border-0">
                                                        <i class="bi bi-x" @click="clearTimeSlot(day, i.id)"></i>
                                                    </button>
                                                    <small class="text-danger overlap-error d-block" v-if="i.error">{{ i.error }}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="btn shadow-none border-0" @click="addTimeSlot(index)">
                                                    <i class="bi bi-plus-lg fw-bold text-dark"></i>
                                                </button>
                                                <button class="btn shadow-none border-0">
                                                    <i class="bi bi-check-lg text-success"
                                                        @click="updateWeeklyHours(day)"></i>
                                                </button>

                                                <!-- <input type="checkbox" v-model="day.available"> -->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-xl-6 col-lg-5 col-md-4">
                                <h5 class="fw-bold">Date Specific</h5>
                                <small>Override your availability for specific dates when your hours
                                    differ from your regular weekly schedule.</small>
                                <div class="mt-4">
                                    <button type="button" class="btn text-xs btn-secondary" data-bs-toggle="modal"
                                        data-bs-target="#exampleModal">
                                        + Add Date Specifc Hours
                                    </button>
                                    <div class="mt-3">
                                        <!-- {{ date }} -->
                                        <ul class="list-group list-group-horizontal border-0 m-0 p-0"
                                            v-for="date in date" :key="date.id">
                                            <li class="list-group-item bg-transparent border-0 w-100 d-flex align-items-start"
                                                v-if="date.date">{{ date.date }}</li>
                                            <li class="list-group-item bg-transparent border-0 w-100 d-flex align-items-start"
                                                v-if="date.timeslot.length > 0 && date.available">
                                                <div v-for="time in date.timeslot" :key="time.id">
                                                    <input type="time" class="border-0 text-xs me-2"
                                                        v-model="time.start_time" readonly>
                                                    <input type="time" class="border-0 text-xs me-2"
                                                        v-model="time.end_time" readonly>
                                                </div>
                                            </li>
                                            <li class="list-group-item bg-transparent border-0 w-100 d-flex align-items-start"
                                                v-else-if="date.timeslot.length < 0 && date.available">
                                                <input type="time" class="border-0 text-xs me-2"
                                                    v-model="date.default_working_start_time" readonly>
                                                <input type="time" class="border-0 text-xs me-2"
                                                    v-model="date.default_working_end_time" readonly>
                                            </li>
                                            <li class="list-group-item bg-transparent border-0 w-100 d-flex align-items-start"
                                                v-else>
                                                <span>--</span>
                                            </li>
                                            <li class="list-group-item bg-transparent border-0 w-100 d-flex align-items-start text-success"
                                                v-if="date.available">Available</li>
                                            <li class="list-group-item bg-transparent border-0 w-100 d-flex align-items-start text-danger"
                                                v-else>Unavailable</li>
                                            <li
                                                class="list-group-item bg-transparent border-0 w-100 d-flex align-items-start">
                                                <button class="btn shadow-none border-0 py-0"
                                                    @click="deleteTimeSlot(date.id)">
                                                    <i class="bi bi-x-lg fw-bold text-dark"></i>
                                                </button>
                                            </li>
                                        </ul>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- CALENDAR VIEW -->
                    <div class="tab-pane fade" id="calendar-tab-pane" role="tabpanel" aria-labelledby="calendar-tab"
                        tabindex="0">
                        <CalendarView 
                            class="theme-default holiday-us-traditional holiday-us-official" :availabilityData="availability">
                            <template >
                                <CalendarViewHeader  />
                            </template>
                        </CalendarView>
                    </div>
                </div>
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content m-auto" style="width: 353px">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">
                                    Select the date
                                </h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body w-100">
                                <date-picker :format="customDateFormat" :inline="true"
                                    :minDate="new Date().toISOString().split('T')[0]" v-model="selectedDate"
                                    @change="onDateSelected(selectedDate)" class="justify-content-center"></date-picker>

                                <div class="m-auto border mt-3">
                                    <label class="d-block text-xs mb-0">Select what hours you are available</label>

                                    <div v-for="date in dateTimeSlots" :key="date.id"
                                        class="d-flex align-items-start">
                                        <div v-if="date.timeslot.length>0">
                                            <div v-for="t in date.timeslot" :key="t.id">
                                                <div class="d-flex align-items-center" >
                                                    <VueTimepicker class="me-2 text-xs" v-model="t.start_time" @change="checkForOverlap(date, t)">
                                                    </VueTimepicker>
                                                    <VueTimepicker class="me-2 text-xs" v-model="t.end_time" @change="checkForOverlap(date, t)">
                                                    </VueTimepicker>
                                                    
                                                    <button class="btn shadow-none border-0 px-2"
                                                        @click="removeDateTimeSlot(t)">
                                                        <i class="bi bi-x"></i>
                                                    </button>

                                                </div>
                                                <small class="text-danger overlap-error d-block" v-if="t.error">{{t.error}}</small>
                                                
                                            </div>

                                        </div>
                                        <div v-else>
                                            <span class="text-danger">Unavailable</span>
                                        </div>

                                        <button class="btn shadow-none border-0 px-2 pe-0 ms-auto"
                                            @click="addDateTimeSlot(index)">
                                            <i class="bi bi-plus-lg fw-bold text-dark"></i>
                                        </button>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <small class="text-danger overlap-error d-block" v-if="i.error">{{ i.error }}</small> -->
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary text-xs shadow-none border-0"
                                    data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="button" class="btn btn-success text-xs shadow-none border-0"
                                    @click="addDateSpecificSlot()">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AdminLayout>
</template>
<style scoped>
.nav-tabs .nav-link.active {
    background-color: #ff5204f0 !important;
    color: #fff !important;
}

.nav-tabs .nav-link.active i {
    color: #fff !important;
}

.table thead {
    background-color: transparent !important;
}

.vue__time-picker {
    width: auto;
}
</style>
<script>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
import "vue-simple-calendar/dist/style.css";
import "vue-simple-calendar/dist/css/default.css";
import "vue-simple-calendar/dist/css/holidays-us.css";


import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import VueTimepicker from "vue3-timepicker/src/VueTimepicker.vue";
import AdminLayout from "@/components/Layouts/AdminLayout.vue";
import axios from "axios";
export default {
    name: "AvailabilityView",
    components: {
        AdminLayout,
        VueTimepicker,
        DatePicker,
        CalendarView,
        CalendarViewHeader,
    },
    data() {
        return {
            days: [
                { name: "Monday", timeslot: [], available: "" },
                { name: "Tuesday", timeslot: [], available: "" },
                { name: "Wednesday", timeslot: [], available: "" },
                { name: "Thursday", timeslot: [], available: "" },
                { name: "Friday", timeslot: [], available: "" },
                { name: "Saturday", timeslot: [], available: "" },
                { name: "Sunday", timeslot: [], available: "" },
            ],
            date: [],
            availability: [],
            customDateFormat: "yyyy-MM-dd",
            selectedDate: '',
            dateTimeSlots: [{ timeslot: [{start_time: "09:00:00", end_time: "17:00:00"}] }],
            available:true
        };
    },

    mounted() {
        const authToken = localStorage.getItem("authToken");
        this.fetchAvailability(authToken);
    },
    watch: {
        selectedDate() {
            const selectedDate = new Date(this.selectedDate).toISOString().split('T')[0];
            console.log('Selected date changed:', selectedDate);

            this.fetchDateSlots(selectedDate)
            // Fetch data based on the new selected date
        },
    },

    methods: {
        fetchAvailability(authToken) {
            axios
                .get(`http://127.0.0.1:8000/doctor/working-days/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then((response) => {
                    this.availability = response.data.data;
                    console.log("avail", this.availability)
                    this.formatWeeklyAvailabilityData();
                    this.formatDateSpecificAvailabilityData()
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
        formatWeeklyAvailabilityData() {
            this.availability.forEach((avail) => {
                let n = 0;
                const dayIndex = this.days.findIndex(
                    (day) => day.name === avail.day_of_week
                );

                if (dayIndex !== -1) {
                    if (avail.date === null) {
                        this.days[dayIndex].timeslot = [];
                        if (avail.timeslot.length === 0) {
                            // If there are no timeslots, display default working start and end time
                            this.days[dayIndex].timeslot.push({
                                id: n++,
                                start_time: avail.default_working_start_time,
                                end_time: avail.default_working_end_time,
                            });
                        } else {
                            // If there are timeslots, push each timeslot to the array
                            avail.timeslot.forEach((slot) => {
                                this.days[dayIndex].timeslot.push({
                                    id: n++,
                                    start_time: slot.start_time,
                                    end_time: slot.end_time,
                                });
                            });
                        }
                        this.days[dayIndex].available = avail.available;
                    }
                }
            });
        },
        formatDateSpecificAvailabilityData() {
            this.date = this.availability.filter(avail => avail.date !== null);
            console.log("this.date", this.date)
        },
        newStartTime(lastSlot) {
            const [lastEndHours, lastEndMinutes] = lastSlot.end_time.split(":");
            const lastEndTime = new Date();
            lastEndTime.setHours(parseInt(lastEndHours, 10), parseInt(lastEndMinutes, 10));
            lastEndTime.setHours(lastEndTime.getHours() + 1);

            const newStartHours = String(lastEndTime.getHours()).padStart(2, "0");
            const newStartMinutes = String(lastEndTime.getMinutes()).padStart(2, "0");
            const newStartTime = `${newStartHours}:${newStartMinutes}:00`;

            return newStartTime
        },
        newEndTime(lastSlot) {
            const [lastEndHours, lastEndMinutes] = lastSlot.end_time.split(":");
            const lastEndTime = new Date();
            lastEndTime.setHours(parseInt(lastEndHours, 10), parseInt(lastEndMinutes, 10));
            lastEndTime.setHours(lastEndTime.getHours() + 1);

            const newEndHours = String(lastEndTime.getHours() + 1).padStart(2, "0");
            const newEndMinutes = String(lastEndTime.getMinutes()).padStart(2, "0");
            const newEndTime = `${newEndHours}:${newEndMinutes}:00`

            return newEndTime
        },
        addTimeSlot(dayIndex) {
            const lastSlot = this.days[dayIndex].timeslot[this.days[dayIndex].timeslot.length - 1];

            const newStartTime = this.newStartTime(lastSlot);
            const newEndTime = this.newEndTime(lastSlot);

            this.days[dayIndex].available = true;
            let lastIndex = this.days[dayIndex].timeslot.length - 1

            console.log("lastIndex++", lastIndex++)
            this.days[dayIndex].timeslot.push({
                id: lastIndex++,
                start_time: newStartTime,
                end_time: newEndTime,
            });
        },
        addNewTimeSlot(day) {
            console.log("add new")
            let index = 0;

            if (day.available && day.timeslot.length === 0) {
                console.log("true condition");
                // If available and no existing time slots, add a new time slot
                day.timeslot.push({
                    id: index++,
                    start_time: "09:00:00",
                    end_time: "17:00:00",
                });
                // this.fetchAvailability(localStorage.getItem('authToken'));
            } else {
                day.available = false;
                day.timeslot = [];
            }
        },
        clearTimeSlot(day, slotId) {
            const index = day.timeslot.findIndex(slot => slot.id === slotId);
            if (index !== -1) {
                day.timeslot.splice(index, 1);
            }
        },
        checkForOverlap(day, slot) {
            slot.error = "";
            const index = day.timeslot.findIndex((s) => s.id === slot.id);
            if (index !== -1) {
                if (index > 0 && day.timeslot[index - 1].end_time >= slot.start_time) {
                    // Set error message for the current slot
                    slot.error = "Time slots cannot overlap.";
                    return;
                }
                if (
                    index < day.timeslot.length - 1 &&
                    slot.end_time > day.timeslot[index + 1].start_time
                ) {
                    slot.error = "Time slots cannot overlap.";
                    return;
                }
            }
            if (slot.start_time >= slot.end_time) {
                slot.error = "End time must be later than start time.";
                return;
            } else {
                slot.error = "";
            }
        },
        formatTime(time) {
            if (!time.includes(":")) {
                return time + ":00";
            } else if (
                !time.includes(":00", time.length - 3) &&
                !time.includes(":00:00", time.length - 6)
            ) {
                return time + ":00";
            }
            return time;
        },
        updateWeeklyHours(day) {
            console.log(day);
            if (day.timeslot.error) {
                console.log("no error");
            }
            let overlaping = false;
            day.timeslot.forEach((slot) => {
                if (slot.error) {
                    console.log("there is the error");
                    overlaping = true;
                }
            });
            console.log("overlaping", overlaping);

            if (!overlaping) {
                day.timeslot.forEach((slot) => {
                    slot.start_time = this.formatTime(slot.start_time);
                    slot.end_time = this.formatTime(slot.end_time);
                });
                let requestBody = {
                    day: day.name,
                    available: day.available,
                };
                console.log(requestBody);
                // Check if there is only one timeslot for the day
                if (day.timeslot.length === 1) {
                    // If there is only one timeslot, update the default start and end times
                    requestBody.default_working_start_time = this.formatTime(
                        day.timeslot[0].start_time
                    );
                    requestBody.default_working_end_time = this.formatTime(
                        day.timeslot[0].end_time
                    );
                } else {
                    // If there are multiple timeslots, update the timeslots array
                    requestBody.timeslots = day.timeslot;
                }
                axios
                    .post(
                        `http://127.0.0.1:8000/doctor/availability/weekly-hours/`,
                        requestBody,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                            },
                        }
                    )
                    .then((response) => {
                        console.log(response);
                        if (response.data.status == 200) {
                            this.showSuccess(response.data.success)
                        }
                        if (response.data.error) {
                            this.showError(response.data.error)
                        }
                    })
                    .catch((error) => {
                        console.log("error", error);
                    });
            }
        },
        addDateTimeSlot() {
            if (this.selectedDate) {
                let lastIndex = this.dateTimeSlots[0].timeslot.length - 1
                const lastSlot = this.dateTimeSlots[0].timeslot[lastIndex]

                const newStartTime = this.newStartTime(lastSlot)
                const newEndTime = this.newEndTime(lastSlot)

                this.dateTimeSlots[0].timeslot.push({ id: lastIndex += 1, start_time: newStartTime, end_time: newEndTime });

                console.log("this.dateTimeSlots[0]", this.dateTimeSlots[0])
            }
            else {
                this.showError("Select Date First")
            }
        },
        removeDateTimeSlot(slotToRemove) {
            console.log("slotToRemove", slotToRemove)
            const indexToRemove = this.dateTimeSlots[0].timeslot.findIndex(slot => slot.id == slotToRemove.id);
            console.log("indexToRemove", indexToRemove)
            if (indexToRemove !== -1) {
                // Remove the slot from the dateTimeSlots array
                this.dateTimeSlots[0].timeslot.splice(indexToRemove, 1);
            }
        },
        fetchDateSlots(selectedDate) {
            console.log("slot fetched acc to date",selectedDate);
            const filteredData = this.date.filter(item => item.date === selectedDate);
            let index = 0
            let updatedSlots = [];

            if (filteredData.length > 0 && filteredData[0].timeslot.length <= 0) {
                console.log('if condition');
                // this.dateTimeSlots[0].timeslot.push({
                //     id: index++,
                //     start_time: filteredData[0].default_working_start_time,
                //     end_time: filteredData[0].default_working_end_time
                // });
                updatedSlots = {
                    id: index++,
                    start_time: filteredData[0].default_working_start_time,
                    end_time: filteredData[0].default_working_end_time
                };

            } else if (filteredData.length > 0 && filteredData[0].timeslot.length > 0) {
                console.log("else if condition")
                updatedSlots = filteredData[0].timeslot.map(slot => ({
                    id: slot.id,
                    start_time: slot.start_time,
                    end_time: slot.end_time
                }));
            }
            else {
                console.log("else part")
                updatedSlots = [{
                    id: index++,
                    start_time: '09:00',
                    end_time: '17:00'
                }]
            }
            console.log(this.dateTimeSlots)
            this.dateTimeSlots = [{ timeslot: updatedSlots }];
            console.log("dateTimeSlots", this.dateTimeSlots);
        },
        deleteTimeSlot(id) {
            axios.delete(`http://127.0.0.1:8000/doctor/availability/date-specific/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
                .then((response) => {
                    console.log(response)
                    if (response.data.error) {
                        this.showError(response.data.error)
                    }
                    if (response.data.success) {
                        this.showSuccess(response.data.success)

                    }
                    this.fetchAvailability(localStorage.getItem('authToken'))
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
        addDateSpecificSlot() {
            console.log("selected date", this.selectedDate)
            console.log(" this.dateTimeSlots[0].timeslot",  this.dateTimeSlots[0].timeslot.length)

            let overlaping = false;
            this.dateTimeSlots[0].timeslot.forEach((slot) => {
                if (slot.error) {
                    console.log("there is the error");
                    overlaping = true;
                }
            });
            console.log("overlaping", overlaping); 

            if (!overlaping){
                if (this.dateTimeSlots[0].timeslot.length <= 0){
                this.available = false
            }
            if (this.selectedDate) {
                axios
                    .post(
                        `http://127.0.0.1:8000/doctor/availability/date-specific/`,
                        {
                            date: new Date(this.selectedDate).toISOString().split('T')[0],
                            timeslots: this.dateTimeSlots[0].timeslot,
                            available: this.available
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                            },
                        }
                    )
                    .then((response) => {
                        console.log(response);
                        if (response.data.status == 200) {
                            this.fetchAvailability(localStorage.getItem("authToken"))
                            this.showSuccess(response.data.success)
                            const modal = document.getElementById('exampleModal');
                            modal.click();
                        }
                        if (response.data.error) {
                            this.showError(response.data.error)
                        }
                    })
                    .catch((error) => {
                        console.log("error", error);
                    });
            }
            else {
                this.showError("Select the date first")

            }
            }
           
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
        }
    },
};
</script>
