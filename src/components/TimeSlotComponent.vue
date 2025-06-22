<template>
  <div>
    <label for="time" class="form-label text-xs fw-bold d-block">Select time slot<span
        class="text-danger">*</span></label>
    <select v-model="selectedTimeSlot" class="form-select text-xs shadow-none text-dark border"
      @change="onTimeSlotSelected">
      <option v-for="(slot, index) in timeSlots" :key="index" :value="slot.startTime" :disabled="slot.disabled"
        class="text-dark">
        {{ slot.startTime }} - {{ slot.endTime }}
      </option>
    </select>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TimeSlotComponent',
  props: {
    doctor: {
      type: Array,
      required: true
    },
    selectedDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedTimeSlot: '',
      timeSlots: [],
      bookedSlots: []
    };
  },
  watch: {
    selectedDate(newDate) {
      console.log("Selected date changed to:", newDate);
      const formattedDate = new Date(newDate).toISOString().split('T')[0];
      this.bookedslots(this.doctor.user.id, formattedDate) // Rename variable to formattedDate
      this.fetchTimeSlots(formattedDate);
      // Call a method to fetch time slots based on the new selected date
      // Example: this.fetchTimeSlots(formattedDate);
    },
    doctor(newDoctor) {
      console.log("this.selecteddoctor", newDoctor)
    }
  },
  methods: {
    fetchTimeSlotsInterval(timeSlotsData) {
      console.log("fetching",timeSlotsData)
      // Implementation remains the same
      const timeSlots = [];
      timeSlotsData.forEach(slotData => {
        let currentTime = new Date(`2000-01-01T${slotData.start_time}`);
        const endTime = new Date(`2000-01-01T${slotData.end_time}`);
        const slotduration = this.doctor.appointment_slot_duration
        // Loop until current time + interval is less than or equal to end time
        while (currentTime < endTime) {
          const endTimeSlot = new Date(currentTime.getTime() + slotduration * 60000);
          if (endTimeSlot > endTime) {
            break; // Break the loop if the next slot exceeds end time
          }
          const slot = {
            startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: endTimeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          timeSlots.push(slot);
          currentTime = endTimeSlot; // Move to the next slot start time
        }
      });

      return timeSlots;
    },
    fetchTimeSlots(date) {
      const currentDate = new Date();
      const selectedDate = new Date(date);

      const isToday = selectedDate.toDateString() === currentDate.toDateString();
      // Implementation remains the same
      const foundDate = this.doctor.working_days.find(avail => avail.date === date);
      if (foundDate) {
        // Fetch time slots for the selected date
        console.log('Fetching time slots for', date);
        // Perform your API call or logic to fetch time slots here
        console.log('Time slots:', foundDate.timeslot);
        // Return or use the fetched time slots as needed
        this.timeSlots = this.fetchTimeSlotsInterval(foundDate.timeslot, false);

        // Fetch booked slots
        this.bookedslots(this.doctor.user.id, date);

        if (isToday) {
          const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // Convert current time to minutes
          this.timeSlots.forEach(slot => {
            const slotTime = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]); // Convert slot time to minutes
            if (slotTime < currentTime) {
              slot.disabled = true;
            }
          });
        }
      } else {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekIndex = new Date(date).getDay(); // Get the index of the day of the week
        const dayOfWeek = daysOfWeek[dayOfWeekIndex];
        console.log("dayofweek", dayOfWeek)
        return null; // or handle as per your requirement
      }
    },

    bookedslots(docid, date) {
      console.log("Fetching booked slots for doctor", docid, "on date", date);
      axios
        .get(`http://127.0.0.1:8000/doctor/availability/${docid}/${date}/`, {})
        .then((response) => {
          console.log("Fetched booked slots:", response.data.data);
          this.bookedSlots = response.data.data;

          // Mark already booked slots as disabled
          this.timeSlots.forEach(slot => {
            console.log("slot.startTime", slot.startTime)
            const isBooked = this.bookedSlots.some(bookedSlot => bookedSlot.start_time === `${slot.startTime}:00`);
            console.log("is booked", isBooked)
            if (isBooked) {
              slot.disabled = true;
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching booked slots:", error);
        });
    },

    onTimeSlotSelected() {
      const startTime = this.selectedTimeSlot;
      const endTime = new Date(new Date(`2000-01-01T${startTime}`).getTime() + 45 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      this.$emit('timeSlotSelected', { startTime: startTime, endTime: endTime });
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
