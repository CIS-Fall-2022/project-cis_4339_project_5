<template>
  <h1 style="font-size:150%; text-align:center; font-family:arial;color:rgb(140,10,10)">2 Months Event Attendance</h1>
  <canvas ref="myChart" ></canvas>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);
export default {
  props: {
    label: {
      type: Array,
    },
    chartData: {
      type: Array,
    },
  },
  async mounted() {
    console.log(this.chartData);
    await new Chart(this.$refs.myChart, {
      type: "bar",
      data: {
        labels: this.label,
        datasets: [
          {
            label: "Attendees",
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
          legend:{
            display:true,
            position:'bottom',
            labels: {
              color:"rgb(100,100,155)"
            }
          }
        },
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