<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartData = {
  labels: ['夏日親子手作樂','長者健康講座','社區小旅行：探索歷史街區','山林健行一日遊',
  '書法體驗課程','社區電影夜','禪修與身心放鬆','藝術療癒工作坊',
  '環保教育嘉年華','節氣養生分享會','趣味園藝DIY','里民交流野餐日'],
  datasets: [
    { label: '報名人數', data: [5, 34, 47, 17, 62, 6, 2, 40, 13, 87, 11, 12], backgroundColor: 'rgba(255,159,64,0.6)' }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y'
}
</script>

<template>
  <div style="height: 380px">
   
    <Bar :data="chartData" :options="options" />

  </div>
</template>
