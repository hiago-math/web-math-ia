<template>
  <div class="progresso-chart" role="img" aria-label="Gráfico de progresso do modelo">
    <div class="stats">
      <div class="stat"><span class="label">Sessões</span><span class="value">{{ historico.length }}</span></div>
      <div class="stat"><span class="label">Última Acurácia</span><span class="value">{{ ultimaAcuracia }}</span></div>
      <div class="stat"><span class="label">Última Perda</span><span class="value">{{ ultimaPerda }}</span></div>
    </div>
    <Line v-if="historico.length" :data="chartData" :options="chartOptions" />
    <p v-else class="no-data">Nenhum treinamento realizado ainda.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({ historico: { type: Array, default: () => [] } })

const ultimaAcuracia = computed(() => {
  if (!props.historico.length) return '—'
  return (props.historico[props.historico.length - 1].acuracia * 100).toFixed(1) + '%'
})
const ultimaPerda = computed(() => {
  if (!props.historico.length) return '—'
  return props.historico[props.historico.length - 1].perda.toFixed(4)
})

const chartData = computed(() => ({
  labels: props.historico.map((_, i) => `Sessão ${i + 1}`),
  datasets: [
    { label: 'Acurácia', data: props.historico.map(p => p.acuracia), borderColor: '#4caf50', tension: 0.3 },
    { label: 'Perda', data: props.historico.map(p => p.perda), borderColor: '#f44336', tension: 0.3 },
  ],
}))
const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
</script>

<style scoped>
.stats { display: flex; gap: 2rem; margin-bottom: 1.5rem; }
.stat { text-align: center; }
.stat .label { display: block; font-size: 0.75rem; color: #666; }
.stat .value { font-size: 1.5rem; font-weight: bold; }
.no-data { color: #999; text-align: center; padding: 2rem; }
</style>
