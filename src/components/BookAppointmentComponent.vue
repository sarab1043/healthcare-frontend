<template>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <h6 class="offcanvas-title fw-bold" id="offcanvasExampleLabel">Book Appointment</h6>


      <button type="button" class="btn-close shadow-none border-0 text-xs" data-bs-dismiss="offcanvas"
        aria-label="Close"></button>
    </div>
    <p class="text-xs ms-3 text-danger">Appointment duration: 45 minutes</p>


    <div class="alert alert-danger" v-if="error">{{error}} </div>
    <div class="alert alert-success" v-if="success">{{success}} </div>
    <div class="offcanvas-body">
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="fullname" class="form-label text-xs fw-bold">Full name <span class="text-danger">*</span></label>
          <input type="text" class="form-control shadow-none text-xs" id="fullname" name="fullname"
            placeholder="Enter full name" required v-model="fullName" />
        </div>
        <div class="mb-3">
          <label for="patientEmail" class="form-label text-xs fw-bold">Email <span class="text-danger">*</span></label>
          <input type="email" class="form-control shadow-none text-xs" id="patientEmail" name="patientEmail"
            placeholder="Enter email" required v-model="email" />
        </div>
        <div class="mb-3">
          <label for="patientphoneNumber" class="form-label text-xs fw-bold d-block">Contact number <span
              class="text-danger">*</span></label>
          <input type="text" class="form-control shadow-none text-xs" id="patientphoneNumber" name="patientphoneNumber"
            placeholder="Enter contact number" required ref="phoneNumber" v-model="patientphoneNumber" />
        </div>
        <div class="mb-3">
          <label for="specialization" class="form-label text-xs fw-bold d-block">Choose Specialization<span
              class="text-danger">*</span></label>
          <select class="form-select text-xs shadow-none" v-model="selectespecialization"
            aria-label="Default select example" v-for="s in doctor.specializations" :key="s.id" required>
            <option :value="s.name">{{ s.name }}</option>
          </select>
        </div>
        <div class="mb-3 bookapt_date">
          <label for="date" class="form-label text-xs fw-bold">Date <span class="text-danger">*</span></label>
          <date-picker :format="customDateFormat" :minDate="new Date().toISOString().split('T')[0]"
            v-model="selectedDate" :disabled-dates="disabledDates" @change="onDateSelected(selectedDate)"></date-picker>
        </div>
        <TimeSlotSelect :doctor="doctor" :selectedDate="selectedDate" @timeSlotSelected="onTimeSlotSelected" />
        <div class="mt-3">
          <button type="submit" class="primarybtn btn text-xs text-light">Request Appointment</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css'; // Import CSS file
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import TimeSlotSelect from '../components/TimeSlotComponent'; // Import the TimeSlotSelect component
export default {
  name: 'BookAppointmentComponent',
  components: {
    DatePicker,
    TimeSlotSelect
  },
  props: {
    selectedDoctor: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      fullName: '',
      email: '',
      patientphoneNumber: '',
      doctor: [],
      date: '',
      selectespecialization: '',
      selectedDate: '',
      customDateFormat: "yyyy-MM-dd",
      disabledDates: [],
      timeSlots: [],
      error: '',
      success: '',
      selectedStartTime: '',
      selectedEndTime: ''
    };
  },
  watch: {
    selectedDoctor(newVal) {
      this.getdoctor(newVal);
    },
  },
  mounted() {
    try {
      const input = this.$refs.phoneNumber;
      intlTelInput(input, {});
    } catch (error) {
      console.error('Unknown promise rejection error:', error);
    }
  },
  methods: {
    getdoctor(selectedDoctor) {
      console.log("get doc called")
      axios
        .get(`http://127.0.0.1:8000/doctor/${selectedDoctor}/`, {})
        .then((response) => {
          this.doctor = response.data.data;
          console.log("response.data.data", this.doctor)
          if (response.data.error) {
            this.showError(response.data.error)
            console.log("success")
          }

          // Set this.availabilities to the availabilities from the response
          this.availabilities = response.data.data.working_days;
          console.log("this.availabilities", this.availabilities)
          this.disabledDates = response.data.data.working_days
            .filter(slot => !slot.available)
            .map(slot => new Date(slot.date));
        })
        
        .catch((error) => {
          console.log("error", error);
        });
    },
    onTimeSlotSelected({ startTime, endTime }) {
      this.selectedStartTime = startTime;
      this.selectedEndTime = endTime;
    },
    submitForm() {
      const appointmentData = {
        country: this.doctor.user.location.country,
        city: this.doctor.user.location.city,
        specialization: this.selectespecialization,
        doctor: this.selectedDoctor,
        start_time: `${this.selectedStartTime}:00`,
        end_time: `${this.selectedEndTime}:00`,
        date: new Date(this.selectedDate).toISOString().split('T')[0],
        patientphoneNumber: this.patientphoneNumber,
        patientEmail: this.email,
        patientName: this.fullName
      };

      axios.post('http://127.0.0.1:8000/patient/appointments/', appointmentData)
        .then(response => {
          console.log("response", response)
          if (response.data.error){
            this.success = ''
            this.error = response.data.error
          }
          else{
            this.error = ''
            this.success = response.data.success
          }
        })
        .catch(error => {
          this.showError('Failed to book appointment. Please try again later.');
          console.error('Error:', error);
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
    }
  }
}
</script>
<style>
.iti.iti--allow-dropdown.iti--show-flags.iti--inline-dropdown {
  width: 100% !important;
}

.bookapt_date .dp__input_icon {
  left: 172px !important;
}
</style>
