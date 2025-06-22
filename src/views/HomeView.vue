<template>
  <HeaderComponent></HeaderComponent>
  <section class="banner d-flex align-items-center">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h6 class="text-light banner-text">Discover seamless appointment booking at your fingertips. With our
            intuitive platform, scheduling your next healthcare visit is quick, easy, and hassle-free. Say hello to
            convenience and goodbye to waiting – <span class="text-orange">Book online now!</span></h6>
        </div>
      </div>
    </div>
  </section>
  <section class="book-appointment-section py-4">
    <div class="container">
      <div class="filter-navbar">
        <div class="row justify-content-end py-3">
          <div class="col-8 text-end filter-section">
            <div class="d-inline-block me-2">
              <label for="country" class="text-xs">Select Country:</label><br>
              <select id="country" v-model="selectedCountry" @change="populateCities"
                class="text-xs shadow-none border-0 filter-select py-1">
                <option value="" disabled>Select Country</option>
                <option v-for="country in countries" :value="country.name" :key="country.isoCode">{{ country.name }}
                </option>
              </select>
            </div>
            <div class="d-inline-block me-2">
              <label for="city" class="text-xs">Select City:</label><br>
              <select id="city" v-model="selectedCity" @change="filterDoctors"
                class="text-xs shadow-none border-0 filter-select py-1">
                <option value="" disabled>Select City</option>
                <option v-for="city in cities" :value="city.name" :key="city.name">{{ city.name }}</option>
              </select>
            </div>
            <div class="d-inline-block">
              <label for="specialization" class="text-xs">Select Specialization:</label><br>
              <select id="specialization" v-model="selectedSpecialization" @change="filterDoctors"
                class="text-xs shadow-none border-0 filter-select py-1">
                <option value="" disabled>Select Specialization</option>
                <option v-for="s in specializations" :value="s.name" :key="s.id">{{ s.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="accordion shadow-none border-0 text-sm" id="accordionPanelsStayOpenExample">
          <div class="accordion-item bg-transparent border-0 mb-4" v-for="s in filteredSpecializations()" :key="s.id">
            <h2 class="accordion-header">
              <button class="accordion-button shadow-none border-0 fw-bold bg-transparent p-0" type="button"
                data-bs-toggle="collapse" :data-bs-target="'#panel-' + s.id" aria-expanded="true"
                :aria-controls="'panel-' + s.id">
                {{ s.name }}
              </button>
            </h2>
            <div :id="'panel-' + s.id" class="accordion-collapse collapse show">
              <div class="accordion-body p-0 mt-2">
                <div class="row">
                  <div class="col-md-2" v-for="doctor in filteredDoctors(s.id) " :key="doctor.id">
                    <div class="doctor border p-2 mb-2 position-relative">
                      <img :src="doctor.user.profilepic" class="img-fluid" height="80" width="80" alt="userpic"
                        v-if="doctor.user.profilepic">
                      <img src="../assets/images/user.png" class="img-fluid rounded-5" height="80" width="80"
                        v-else-if="!doctor.user.gender">
                      <img src="../assets/images/female.jpg" height="78" width="82"
                        v-else-if="doctor.user.gender.toLowerCase() == 'female'" style="border-radius: 50%;">
                      <img src="../assets/images/male.jpg" height="78" width="82"
                        v-else-if="doctor.user.gender.toLowerCase() == 'male'" style="border-radius: 50%;">
                      <p class="mb-0 text-sm">{{ doctor.user.fullname }}</p>
                      <p class="mb-0 text-sm">{{ doctor.user.email }}</p>
                      <p class="mb-0 text-sm">{{ doctor.qualification }}</p>
                      <p v-if="doctor.location">{{ doctor.location.country }}<span v-if="doctor.location.city"> , {{
                doctor.location.city }}</span></p>
                      <button class="primarybtn btn text-xs text-light ms-0 position-absolute"
                        data-bs-toggle="offcanvas" href="#offcanvasExample" role="button"
                        aria-controls="offcanvasExample" style="bottom:2px" @click="handleBookAppointment(doctor.user.id)">Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Doctors List End -->
      </div>
      <BookAppointmentComponent :selectedDoctor="selectedDoctor" @book-appointment="handleBookAppointment"></BookAppointmentComponent>
      
    </div>
  </section>
</template>

<script>
import { Country, City } from 'country-state-city';
import HeaderComponent from '@/components/HeaderComponent.vue';
import BookAppointmentComponent from '@/components/BookAppointmentComponent.vue'
import axios from 'axios';
// import $ from 'jquery'; 

export default {
  name: 'HomeView',
  components: { HeaderComponent, BookAppointmentComponent },
  data() {
    return {
      doctors: [],
      countries: [],
      cities: [],
      specializations: [],
      selectedCountry: null,
      selectedCity: null,
      selectedSpecialization: null,
      selectedDoctor: ''
    };
  },
  mounted() {
    this.countries = Country.getAllCountries();
    this.loadDoctors();

    this.loadSpecializations();
  },
  methods: {
    loadDoctors() {
      axios.get("http://127.0.0.1:8000/doctors/")
        .then(response => {
          if (response.status === 200) {
            this.doctors = response.data.data;
          }
        })
        .catch(error => {
          console.error("Error fetching doctors:", error);
        });
    },
    loadSpecializations() {
      axios.get("http://127.0.0.1:8000/specializations/")
        .then(response => {
          if (response.status === 200) {
            console.log("response", response.data.data)
            this.specializations = response.data.data;
            this.filteredSpecializations()
            console.log("this.specialization on api resp", this.specializations)

          }
        })
        .catch(error => {
          console.error("Error fetching specializations:", error);
        });
    },
    filterDoctors() {
      console.log("filter doctors called ")
      let url = "http://127.0.0.1:8000/doctors/search/?";
      if (this.selectedSpecialization) {
        url += `specialization=${this.selectedSpecialization}&`;
      }
      if (this.selectedCity) {
        url += `city=${this.selectedCity}&`;
      }
      if (this.selectedCountry) {
        console.log(this.selectedCountry)
        url += `country=${this.selectedCountry}&`;
      }
      axios.get(url)
        .then(response => {
          if (response.status === 200) {
            this.doctors = response.data.data;
            console.log("filter doctor res", this.doctors)
          }
        })
        .catch(error => {
          console.error("Error fetching filtered doctors:", error);
        });
    },
    populateCities() {
      const selectedCountryObject = this.countries.find(country => country.name === this.selectedCountry);
      if (selectedCountryObject) {
        const countryCode = selectedCountryObject.isoCode;
        this.cities = City.getCitiesOfCountry(countryCode);
      } else {
        this.cities = [];
      }

      this.selectedCity = null;
      this.filterDoctors();
    },
    filteredDoctors(specializationId) {
      return this.doctors.filter(doctor => {
        return doctor.specializations.some(s => s.id === specializationId);
      });
    },
    filteredSpecializations() {
      if (this.selectedSpecialization) {
        console.log(this.selectedSpecialization)
        console.log("if condition")
        console.log("this.specializations.filter(s => s.id === this.selectedSpecialization", this.specializations.filter(s => s.name == this.selectedSpecialization))
        return this.specializations.filter(s => s.name === this.selectedSpecialization);
      } else {
        // If no specialization is selected, return all specializations
        console.log("this.spec", this.specializations)
        return this.specializations;
      }
    },
    handleBookAppointment(doctor) {
      // Handle the selected doctor's information here
      this.selectedDoctor = doctor;
      console.log("this.selectedDoctor", this.selectedDoctor)
    }
  }
};
</script>
