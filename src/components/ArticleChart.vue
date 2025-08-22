<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import DataLabels from 'chartjs-plugin-datalabels'


ChartJS.register(ArcElement, Tooltip, Legend, DataLabels)

// ---- 圖表資料 ----
const chartData = {
  labels: ['詐騙、不實資訊','暴力內容','仇恨言論','露骨、騷擾','自我傷害、自殺'],
  datasets: [{
    data: [4, 2, 1, 2, 2],
    backgroundColor: [
      'rgba(93,110,255,0.9)',
      'rgba(255,205,86,0.9)',
      'rgba(76,175,80,0.9)',
      'rgba(255,159,64,0.9)',
      'rgba(201,99,99,0.9)'
    ],
    borderColor: '#fff',
    borderWidth: 2,
    // 外側留出空間（避免貼邊被裁切）
    radius: '78%'       
  }]
}

const colors = chartData.datasets[0].backgroundColor
const total  = chartData.datasets[0].data.reduce((a,b)=>a+b,0)

// 導線插件
const calloutLinesPlugin = {
  id: 'calloutLines',
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0)
    const arcs = meta?.data || []
    if (!arcs.length) return
    const { left, right } = chart.chartArea
    const ctx = chart.ctx
    ctx.save(); ctx.lineWidth = 1
    arcs.forEach((arc, i) => {
      if (!arc) return
      const { x, y, startAngle, endAngle, outerRadius } =
        arc.getProps(['x','y','startAngle','endAngle','outerRadius'], true)
      const a  = (startAngle + endAngle) / 2
      const x0 = x + Math.cos(a) * outerRadius
      const y0 = y + Math.sin(a) * outerRadius
      const x1 = x + Math.cos(a) * (outerRadius + 10)
      const y1 = y + Math.sin(a) * (outerRadius + 10)
      const isRight = Math.cos(a) >= 0
      const x2 = isRight ? Math.min(x1 + 26, right - 10) : Math.max(x1 - 26, left + 10)
      ctx.strokeStyle = colors[i] || 'rgba(0,0,0,.4)'
      ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.lineTo(x2,y1); ctx.stroke()
    })
    ctx.restore()
  }
}

// 3) 中央總數字：放最後註冊，畫在最上層
const centerTextPlugin = {
  id: 'centerText',
  afterDatasetsDraw(chart, _args, opts) {
    const ds = chart.data.datasets?.[0]
    const meta = chart.getDatasetMeta(0)
    if (!ds || !meta?.data?.length) return
    const sum = (ds.data).reduce((a,b)=>a+b,0)
    const { x, y } = meta.data[0].getProps(['x','y'], true)
    const ctx = chart.ctx
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = (opts?.font) || '700 28px system-ui, "Noto Sans TC", sans-serif'
    ctx.fillStyle = (opts?.color) || '#111'
    ctx.fillText(String(sum), x, y)
    ctx.restore()
  }
}

// 注意註冊順序：導線 → 中央文字（中央文字最後）
ChartJS.register(calloutLinesPlugin, centerTextPlugin)

// 4) options：加 padding、clamp、clip:false、Legend 放右邊
const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '80%', // 內圈大小，可依視覺調整
  layout: {
    // 預留外側空間給標籤（右邊 legend 也吃寬度）
    padding: { top: 16, bottom: 20, left: 64, right: 64 }
  },
  plugins: {
    legend: {
      display: true,
      position: 'right',
      align: 'center',
      labels: { usePointStyle: true, boxWidth: 10, padding: 12 }
    },
    tooltip: { enabled: true },
    datalabels: {
      display: true,
      clip: false,   // ← 不裁切
      clamp: true,   // ← 超出會「夾回」圖區邊緣
      anchor: 'end',
      align: 'end',
      offset: 16,
      color: (ctx) => colors[ctx.dataIndex],
      textAlign: (ctx) => {
        const arc = ctx.chart.getDatasetMeta(0).data[ctx.dataIndex]
        if (!arc) return 'left'
        const a = (arc.startAngle + arc.endAngle) / 2
        return Math.cos(a) >= 0 ? 'left' : 'right'
      },
      formatter: (v, ctx) => {
        const name = ctx.chart.data.labels[ctx.dataIndex]
        const pct  = Math.round((v / total) * 100)
        return `${name}\n${v} (${pct}%)`
      },
      font: { size: 12, weight: '500' }
    },
    centerText: { color: '#111' } // 可選：提供樣式給中心字
  }
}
</script>

<template>
  <!-- 記得給寬高；Legend 在右邊時，寬度也要夠 -->
  <div style="height: 360px; width: 720px;">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>
