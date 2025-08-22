    <script setup>
    import { Doughnut } from 'vue-chartjs'
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

    ChartJS.register(ArcElement, Tooltip, Legend)

    // 固定資料，先確定能渲染
    const chartData = {
    labels: ['詐騙、不實資訊', '暴力內容', '仇恨言論', '露骨、騷擾', '自我傷害、自殺'],
    datasets: [
        {
        data: [5,1,3,1,1],
        backgroundColor: [
            'rgba(93,110,255,0.9)',  // 藍
            'rgba(255,205,86,0.9)',  // 黃
            'rgba(76,175,80,0.9)',   // 綠
            'rgba(255,159,64,0.9)',  // 橘
            'rgba(201, 99, 99,0.9)'  // 紅
        ],
        borderColor: '#fff',
        borderWidth: 2
        }
    ]
    }

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
    }
    }
    </script>

    <template>
    <div style="height: 380px;">
        <Doughnut :data="chartData" :options="options" />
    </div>
    </template>
