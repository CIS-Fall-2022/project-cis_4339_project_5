<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>

<!-- Graph Design div below-->


<div class="column">
     
      
          <div>
            <AttendeeBar
              v-if="!loading && !error"
              :label="x_axis"
              :chartData="y_axis"
            ></AttendeeBar>

            <!-- Start of loading animation -->
            <div class="mt-40" v-if="loading">
              <p
                class="
                  text-6xl
                  font-bold
                  text-center text-gray-500
                  animate-pulse
                "
              >
                Loading...
              </p>
            </div>
            <!-- End of loading animation -->

            <!-- Start of error alert -->
            <div class="mt-12 bg-red-50" v-if="error">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                {{ error.title }}
              </h3>
              <p class="p-4 text-lg font-bold text-red-900">
                {{ error.message }}
              </p>
            </div>
            <!-- End of error alert -->
            <br />
            <br />
          </div>
        </div>
    








    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">Recent Events</h2>
        
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="capitalize p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Number of Attendees</th>
         
            </tr>
          </thead>
          <!--This sections sets up the table for the event attendee, it only shows the name
          of the event and the number of attendees. This is accomplished using a v-for loop
          that loops through the queryData array that is populated with data in the script section-->
          <tbody class="divide-y divide-gray-300">
            <tr  v-for="Attendees , event in queryData" >
              
              <td class="capitalize p-2 text-left">{{ event }}</td>
              <td class="p-2 text-left">{{ Attendees }}</td>
      
            </tr>





          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>

import axios from "axios";
import AttendeeBar from "@/components/BarChartComponent.vue";

export default {
  components: {
    AttendeeBar
  },

  data() {
    return {
      // this is what querydata looks like 
      // requires two loops to get the data to appear correctly
      queryData: [],
      x_axis: [],
      y_axis: [],
      loading: false,
      error: null,


    };
  },

// mymethod that is being called in real time to constantly bring updates to the chart 

methods: {
//created a new method that ensures that the first letter of the word is capitalized, which can be used in different text throughout the page
  capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
},


async fetchData() {
   
  try {
      this.error = null;
        this.loading = true;




    // this api returns a json object for chart.js to use to create the graph
        const url = import.meta.env.VITE_ROOT_API + "/primaryData/search_attendee_chart/"

        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.x_axis = response.data.map((item) => item.eventName.split(' ').map(this.capitalize).join(' '));
        this.y_axis = response.data.map((item) => item.attendees);


      




      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
      }
      this.loading = false;
    },
  },

  mounted() {
//here is where we retrieve the data used for the table, via an axios api call we store the request
//data in the queryData array.
    let apiURL = import.meta.env.VITE_ROOT_API + `/primaryData/search_attendee_2_months/`;
        this.queryData = [];
        axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
    });


   
    this.fetchData();
    window.scrollTo(0, 0);
  },

};
</script>



