<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import DataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(ArcElement, Tooltip, Legend) // 只註冊核心

// ---- 資料 ----
const chartData = {
  labels: ['詐騙、不實資訊','暴力內容','仇恨言論','露骨、騷擾','自我傷害、自殺'],
  datasets: [{
    data: [5, 1, 3, 1, 1],
    backgroundColor: [
      'rgba(93,110,255,0.9)',
      'rgba(255,205,86,0.9)',
      'rgba(76,175,80,0.9)',
      'rgba(255,159,64,0.9)',
      'rgba(201,99,99,0.9)'
    ],
    borderColor: '#fff',
    borderWidth: 2,
    radius: '80%'          // 
  }]
}

const colors = chartData.datasets[0].backgroundColor
const total  = chartData.datasets[0].data.reduce((a,b)=>a+b,0)

// ---- 導線插件 ----
const calloutLinesPlugin = {
  id: 'calloutLines',
  afterDatasetsDraw(chart, _args, _plOpts) {
    const meta = chart.getDatasetMeta(0)
    const arcs = meta?.data || []
    if (!arcs.length) return

    // 從 options 讀參數（有預設值）
    const opts = chart.options.plugins?.calloutLines || {}
    const RADIAL = opts.radial ?? 12   // 徑向長度：扇形外緣 → 第一段
    const HORIZ  = opts.horiz  ?? 15   // 水平長度：第一段 → 第二段
    const GAP    = opts.gap    ?? 8    // 導線尾端與文字間的安全距

    const { left, right } = chart.chartArea
    const colors = chart.data.datasets[0].backgroundColor || []
    const ctx = chart.ctx
    ctx.save()
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    arcs.forEach((arc, i) => {
        if (!arc) return
        const { x, y, startAngle, endAngle, outerRadius } =
            arc.getProps(['x','y','startAngle','endAngle','outerRadius'], true)

        const a  = (startAngle + endAngle) / 2
        const x0 = x + Math.cos(a) * outerRadius
        const y0 = y + Math.sin(a) * outerRadius
        const x1 = x + Math.cos(a) * (outerRadius + RADIAL)
        const y1 = y + Math.sin(a) * (outerRadius + RADIAL)

        const isRight = Math.cos(a) >= 0
        const x2raw = isRight ? x1 + HORIZ : x1 - HORIZ
        // 邊界保護 + 與文字的間隙 GAP
        const x2clamped = isRight ? Math.min(x2raw, right - 10) : Math.max(x2raw, left + 10)
        const x2 = isRight ? x2clamped - GAP : x2clamped + GAP

        ctx.strokeStyle = colors[i] || 'rgba(0,0,0,0.35)'
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y1)
        ctx.stroke()
        })

        ctx.restore()
    }
    }

// ---- 中央總數字）----
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

// 
const localPlugins = [DataLabels, calloutLinesPlugin, centerTextPlugin]

// ---- options ----
const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',                 // 內半徑，要 < radius
  layout: { padding: { top: 16, bottom: 20, left: 20, right: 64 } },
  plugins: {
    legend: { display: true, position: 'right', align: 'center',
      labels: { usePointStyle: true, boxWidth: 12, padding: 13 } },
    tooltip: { enabled: true },
    datalabels: {
      display: true, clip: false, clamp: true,
      anchor: 'end', align: 'end', offset: 16,
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
        return `${name}\n${v}（${pct}%）`
      },
      font: { size: 12, weight: '500' }
    },
    centerText: { color: '#111' }
  }
}
</script>

<template>
  <div style="height: 360px; width: 680px;">
    <Doughnut :data="chartData" :options="options" :plugins="localPlugins" />
  </div>
</template>
