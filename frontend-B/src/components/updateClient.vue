<script>
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, numeric } from "@vuelidate/validators";
import VueMultiselect from "vue-multiselect";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  props: ["id"],
  components: { VueMultiselect },
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      //for multi select
      eventsChosen: [],
      eventData: [],
      //for multi select event Data
      // eventData: [],
      // Client Data
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
      // list of events shown in table
      clientEvents: [],
      clientEvents_id: []
      // this needs to be updated as well
     
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  beforeMount() {
    axios
      .get(
        import.meta.env.VITE_ROOT_API +
          `/primarydata/id/${this.$route.params.id}`
      )
      .then((resp) => {
        let data = resp.data[0];
        this.client.firstName = data.firstName;
        this.client.middleName = data.middleName;
        this.client.lastName = data.lastName;
        this.client.email = data.email;
        this.client.phoneNumbers.primaryPhone = data.phoneNumbers.primaryPhone;
        this.client.phoneNumbers.secondaryPhone = data.phoneNumbers.secondaryPhone;
        this.client.address.line1 = data.address.line1;
        this.client.address.line2 = data.address.line2;
        this.client.address.city = data.address.city;
        this.client.address.county = data.address.county;
        this.client.address.zip = data.address.zip;
      });
    axios
      .get(
        import.meta.env.VITE_ROOT_API +
          `/eventdata/client/${this.$route.params.id}`
      )
      .then((resp) => {
        resp.data.forEach((event) => {
          this.clientEvents.push({
            eventName: event.eventName,
            eventDate: event.date,
            _id: event._id
          });
          this.clientEvents_id.push(event._id)


        });
      });
    axios.get(import.meta.env.VITE_ROOT_API + `/eventdata`).then((resp) => {
      let data = resp.data;
      for (let i = 0; i < data.length; i++) {
        this.eventData.push({
          eventName: data[i].eventName,
          _id: data[i]._id,
          attendees: data[i].attendees,
        });
      }
    });
  },
  methods: {
      formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    async handleClientUpdate() {
      //adding validation so that the user cannot leave required fields blank when they resubmit 
      //and update of their client information
      if ( this.client.firstName === "" ||  this.client.lastName === "" || this.client.email === "" 
      || this.client.phoneNumbers.primaryPhone === "" || this.client.phoneNumbers.primaryPhone.length > 10
       || this.client.phoneNumbers.primaryPhone.length < 10 || this.client.address.line1 === "" ||
       this.client.address.city === "" || this.client.address.county === "" ||   this.client.address.zip === "") {

        alert("Missing Field Element")

    }

    else {

      let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/${this.id}`;
      axios.put(apiURL, this.client).then(() => {
        this.$router.push('/findclient').catch((error) => {
          console.log(error);
        });
      })
    }
      
    }
    ,

    //Method called when button is clicked in the frontend, using AXIOS delete with the correct API URL for
    //the backend delete client route. But, first the client must accept the confirm box that appears when deleting a client.
    //There is also an alert box that appears once the action is complete to help frontend user know what's going on

    // Lam I included another api call, whne the comfirmation is hit, the axio will sent both http request to the backend in proper sequence
    // the removal of the attendee from the events and then removal of the cilent in general, in order to acomphlish this i created another api in the backend that handles the removal 
    // of attendees
    deleteClient(){
      let apiURL = import.meta.env.VITE_ROOT_API + `/primaryData/${this.id}`;
      
      let apiURL2 = import.meta.env.VITE_ROOT_API + `/primaryData/events/${this.id}`;
      if (window.confirm("Are you sure you want to delete this Client?")) {
        axios.put(apiURL2, this.client).then(() => {
  
          this.$router.back().catch((error) => {
          console.log(error);
       
        });
      });

        axios.delete(apiURL, this.client).then(() => {
          alert("Client has been deleted");
        this.$router.back().catch((error) => {
          console.log(error);
        });
      });


   

    }
    },
    refreshPage(){
      window.location.reload();
    },
    addToEvent() {

      

      this.eventsChosen.forEach((event) => {

        if (this.clientEvents_id.includes(event._id))  
        {
        
          alert("the cilent is already attending this event");
          
        }


        else {
        let apiURL =


          import.meta.env.VITE_ROOT_API + `/eventdata/addAttendee/` + event._id;
        axios.put(apiURL, { _id : this.$route.params.id }).then(() => {
        alert("Client is now registered for the event");
      



        });
    }
  
  
  });

      this.clientEvents = [];
          axios
            .get(
              import.meta.env.VITE_ROOT_API +
                `/eventdata/client/${this.$route.params.id}`
            )
            .then((resp) => {
              let data = resp.data;
              for (let i = 0; i < data.length; i++) {
                this.clientEvents.push({
                  eventName: data[i].eventName,
                  eventDate: data[i].eventDate,
                });
              }
              
            });
            this.refreshPage()



    },
    editattendance(event) {

    let apiURL =  import.meta.env.VITE_ROOT_API + '/primaryData/unattend_event/' + event._id  + '/' + this.$route.params.id
    axios.put(apiURL).then(() => {

    alert("The cilent has been removed from this event.")
    this.refreshPage()
});







    }
  },
  validations() {
    return {
      client: {
        firstName: { required, alpha },
        lastName: { required, alpha },
        email: { email, required },
        address: {
          city: { required },
          county: { required },
          zip: { required }
        },
        phoneNumbers: [
          {
            primaryPhone: { required, numeric },
          },
        ],
      },
    };
  },
};
</script>
<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Update Client</h1>
    <div class="px-10 py-20">
   
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleClientUpdate">
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
                placeholder
                v-model="client.lastName"
                required
              />
            </label>
          </div>
          <div></div>
          <!-- form field -->
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
                required
              />
            </label>
          </div>
          <div></div>
        </div>

        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="handleClientUpdate"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Update Client</button>
          </div>


          
          <!--New button for deleting the client in the Client Intake Form, follows the styling of the udate button-->
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="deleteClient"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Delete Client</button>
          </div>
          <div class="flex justify-between mt-10 mr-20">
            <button
              type="reset"
              class="border border-red-700 bg-white text-red-700 rounded"
              @click="$router.go(-1)"
            >Go back</button>
          </div>
        </div>

        <hr class="mt-10 mb-10" />









        <!-- Client Event Information -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Events for Client</h2>
          <div class="flex flex-col col-span-2">
            <table class="min-w-full shadow-md rounded">
              <thead class="bg-gray-50 text-xl">
                <tr>
                  <th class="p-4 text-left">Event Name</th>
                  <th class="p-4 text-left">Date</th>
                  
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr v-for="event in clientEvents" :key="event._id">
                  <td class="p-2 text-left">{{ event.eventName }}</td>
                  <td class="p-2 text-left">{{ formattedDate(event.eventDate) }}</td>
                  <!-- <td class="p-2 text-left">{{ event._id }}</td> -->
                  <button
                  @click="editattendance(event)" 
                  class="p-2 text-left bg-transparent hover:bg-red-600 text-red-700 font-semibold hover:text-white py-2 px-2 border border-red-500 hover:border-transparent rounded"> 
                  Unattend 
                </button>
                </tr>

              </tbody>
            </table>
          </div>

          <div class="flex flex-col">
            <label class="typo__label">Select Events to be added</label>
            <VueMultiselect
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="eventsChosen"
              :options="eventData"
              :multiple="true"
              label="eventName"
            ></VueMultiselect>
            <div class="flex justify-between">
         
              <button
                @click="addToEvent(); "
                type="submit"
                class="mt-5 bg-red-700 text-white rounded"
              >Add Client to Events</button>
            </div>
          </div>
        </div>

        
      </form>
    </div>
  </main>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
