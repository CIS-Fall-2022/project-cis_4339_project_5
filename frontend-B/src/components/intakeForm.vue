<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Client Intake Form</h1>
    <div class="px-10 py-20">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Personal Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">First Name</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Monkey"
                v-model="client.firstName"
                required

              />
              
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Middle Name</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder = "D"
                v-model="client.middleName"
              />
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Last Name</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder = "Luffy"
                v-model="client.lastName"
                required
              />
            </label>
          </div>

          <div></div>
          <!-- form field -->
          <!--Each input box in the form corresponds to a field that will hold data values
          in the document in the backend. Those fields that are reqired type in the backend are denoted 
          with an * so the user is able to tell whic ones they need to fill out -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Email</span>
              <span style="color:#ff0000">*</span>
              <input
                type="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                placeholder="example@gmail.com"
                v-model="client.email"
                required
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Phone Number</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                placeholder="XXXXXXXXXX"
                v-model="client.phoneNumbers.primaryPhone"
                required
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Alternative Phone Number</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                placeholder="XXXXXXXXXX"
                v-model="client.phoneNumbers.secondaryPhone"
              />
            </label>
          </div>
        </div>

        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line1"
                required
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line2"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.city"
                required
              />
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.county"
                required
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.zip"
                placeholder="XXXXX"
                pattern="(^\d{5}$)"
                required
              />
            </label>
          </div>
          <div></div>
          <!-- submit button -->
          <div class="flex justify-between mt-10 mr-20">
            <button class="bg-red-700 text-white rounded" type="submit">Add Client</button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
<script>
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, numeric } from "@vuelidate/validators";
import axios from "axios";

// Lam 

export default {

  setup() {
  // Activating vuelidate within the setup
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
      client: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumbers: 
          {
            primaryPhone: "",
            secondaryPhone: "",
          },
        
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "",
          zip: "",
        },
      },
    };
  },
  methods: {
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      console.log(this.client)
      if (isFormCorrect) {
        let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata`;
        axios
          .post(apiURL, this.client)
          .then(() => {
            alert("Client has been succesfully added.");
            this.$router.push("/findclient");
            this.client = {
    
              firstName: "",
              middleName: "",
              lastName: "",
              email: "",
              phoneNumbers: 
                {
                  primaryPhone: "",
                  seondaryPhone: "",
                },
              
              address: {
                line1: "",
                line2: "",
                city: "",
                county: "",
                zip: "",
              },
            };
          })
          .catch((error) => {
            console.log(error);
            // Error Handling
            // If a client tries to register with a phone number that is already in the database, they will see an error message
            if (error.message === 'Request failed with status code 500') {
            alert('A client is already registered with this phone number.' + '\n Please enter a different phone number.');
            }
          });
      }
    },
  },
  // sets validations for the various data properties
  validations() {
    return {
      client: {
        firstName: { required },
        lastName: { required },
        email: { email, required },
        address: {
          line1: { required },
          city: { required },
          county: { required },
          zip: { required }
        },
        phoneNumbers: 
          {
            primaryPhone: { required, numeric },
          },
      },
    };
  },
};
</script>