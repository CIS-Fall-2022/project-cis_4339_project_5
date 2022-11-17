<template>
  <!--Included a styled header above the bar chart as a title to describe to the user what the data is referring to-->
  <h1 style="font-size:150%; text-align:center; font-family:arial;color:rgb(140,10,10)">2 Months Event Attendance</h1>
  <canvas ref="myChart" ></canvas>
</template>

<script>
//we used chartjs library to create the bar chart for our dashboard, we made this decision because there
//is lots of room for flexibility and it allowed us to get a simple chart running in vue
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);
export default {
  props: {
    //chart js requires the data to be in json format
    label: {
      type: Array,
    },
    chartData: {
      type: Array,
    },
  },
  async mounted() {
    console.log(this.chartData);
    //creating a new chart instance that is of type bar, we chose a bar chart because it clearly displays
    //the number of attendees for each individual event and allows you to quickly compare attendance across events
    await new Chart(this.$refs.myChart, {
      type: "bar",
      //that data of the chart is not local, but instead uses an API to retrieve data from the database,
      //which is why we have to use the 'this' keyword to identfiy the label and data
      data: {
        labels: this.label,
        datasets: [
          {
            label: "Attendees",
            //included a list of rgb colors to have each bar be represented in a different shade of blue
            backgroundColor: [
               "rgba(100,100,200, 0.6 )",
               "rgba(0,180,240, 0.6 )",
               "rgba(0,20,255, 0.6 )",
               "rgba(150,200,180, 0.6 )",
               "rgba(50,50,160, 0.6 )",
              ],
            data: this.chartData,
          },
        ],
      },
      options: {
        plugins:{
          //included the options for the legend so that we can adjust postion and color in order
          //to better fit the dashboard 
          legend:{
            display:true,
            position:'bottom',
            labels: {
              color:"rgb(100,100,155)"
            }
          }
        },
        //we made some adjustments to the y axis scale to better represent that attendee data
        scales: {
            y: {
              beginAtZero: true,
              //makes the chart y axis dynamic based on how many attendees plus some buffer space
              max: this.chartData.length +4,

            
            }
        }
      }
    });
  },
};
</script>