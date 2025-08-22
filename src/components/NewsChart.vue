<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)


const chartData = {
  labels: [  '社區停水通知','中秋節活動閉園','補助申請截止提醒',
  '社區道路施工','垃圾清運時間異動'],
  datasets: [
    { label: '7日內瀏覽人次',  data: [520, 480, 460,380,370], backgroundColor: 'rgba(122,121,255,0.8)', borderRadius: 6, barThickness: 24 },
    { label: '30日內瀏覽人次', data: [760, 720, 700,660,650], backgroundColor: 'rgba(255,206,86,0.8)',  borderRadius: 6, barThickness: 24 }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false, // 一定要配合容器高度
  scales: {
    y: { beginAtZero: true }
  },
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { mode: 'index', intersect: false }
  }
}
</script>

<template>

  <div style="height:380px; ">
    <Bar :data="chartData" :options="options" />
  </div>
</template>
