<template>
  <section aria-label="Atributos do Modelo">

    <div class="rpg-title">📜 Atributos da Entidade</div>
    <div class="rpg-subtitle">Histórico de treinamento e evolução arcana</div>

    <!-- Seletor de tarefa -->
    <div class="tarefa-select rpg-panel" style="margin-bottom:1.25rem;">
      <label class="rpg-label" for="tarefa">Missão</label>
      <select id="tarefa" v-model="tarefaId" @change="carregar" class="rpg-select" aria-label="Selecionar tarefa">
        <option v-for="t in tarefasStore.tarefas" :key="t.id" :value="t.id">{{ t.nome }}</option>
      </select>
    </div>

    <div v-if="store.loading" class="rpg-spinner">Consultando os registros arcanos...</div>

    <div v-else-if="store.error" class="rpg-alert rpg-alert--error" role="alert">
      ⚠ {{ store.error }}
      <button class="rpg-btn rpg-btn--danger" style="margin-left:1rem" @click="carregar">Tentar novamente</button>
    </div>

    <div v-else>
      <!-- Stats em destaque estilo Dark Souls -->
      <div class="stats-grid">
        <div class="rpg-panel stat-block">
          <div class="stat-block-label">Sessões de Treino</div>
          <div class="stat-block-value">{{ store.historico.length }}</div>
        </div>
        <div class="rpg-panel stat-block">
          <div class="stat-block-label">Última Acurácia</div>
          <div class="stat-block-value stat-block-value--good">{{ ultimaAcuracia }}</div>
        </div>
        <div class="rpg-panel stat-block">
          <div class="stat-block-label">Última Perda</div>
          <div class="stat-block-value stat-block-value--bad">{{ ultimaPerda }}</div>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="rpg-panel chart-panel" v-if="store.historico.length">
        <div class="chart-title">Evolução do Treinamento</div>
        <Line :data="chartData" :options="chartOptions" />
      </div>

      <!-- Histórico em tabela estilo RPG -->
      <div class="rpg-panel historico-panel" v-if="store.historico.length">
        <div class="chart-title">Registro de Sessões</div>
        <table class="rpg-table" aria-label="Histórico de treinamento">
          <thead>
            <tr>
              <th>Sessão</th>
              <th>Acurácia</th>
              <th>Perda</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(h, i) in store.historico" :key="i">
              <td>{{ i + 1 }}</td>
              <td class="val-good">{{ (h.acuracia * 100).toFixed(1) }}%</td>
              <td class="val-bad">{{ h.perda.toFixed(4) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!store.historico.length" class="rpg-empty">
        <div class="rpg-empty-icon">📜</div>
        <p>Nenhum treinamento registrado para esta missão.</p>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useProgressoStore } from '../stores/progresso'
import { useTarefasStore } from '../stores/tarefas'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useProgressoStore()
const tarefasStore = useTarefasStore()
const tarefaId = ref('')

const ultimaAcuracia = computed(() => {
  if (!store.historico.length) return '—'
  return (store.historico[store.historico.length - 1].acuracia * 100).toFixed(1) + '%'
})

const ultimaPerda = computed(() => {
  if (!store.historico.length) return '—'
  return store.historico[store.historico.length - 1].perda.toFixed(4)
})

const chartData = computed(() => ({
  labels: store.historico.map((_, i) => `S${i + 1}`),
  datasets: [
    {
      label: 'Acurácia',
      data: store.historico.map(p => p.acuracia),
      borderColor: '#80c080',
      backgroundColor: 'rgba(128, 192, 128, 0.1)',
      tension: 0.3,
      pointBackgroundColor: '#80c080',
    },
    {
      label: 'Perda',
      data: store.historico.map(p => p.perda),
      borderColor: '#c08080',
      backgroundColor: 'rgba(192, 128, 128, 0.1)',
      tension: 0.3,
      pointBackgroundColor: '#c08080',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: { color: '#d4c9a8', font: { family: 'Cinzel, serif', size: 11 } },
    },
  },
  scales: {
    x: {
      ticks: { color: '#8a7d5a' },
      grid:  { color: 'rgba(58, 48, 32, 0.5)' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#8a7d5a' },
      grid:  { color: 'rgba(58, 48, 32, 0.5)' },
    },
  },
}

function carregar() {
  if (tarefaId.value) store.buscar(tarefaId.value)
}

onMounted(async () => {
  if (!tarefasStore.tarefas.length) await tarefasStore.buscar()
  if (tarefasStore.tarefas.length) {
    tarefaId.value = tarefasStore.tarefas[0].id
    carregar()
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-block {
  text-align: center;
  padding: 1rem;
}

.stat-block-label {
  font-family: 'Cinzel', serif;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

.stat-block-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-bright);
  font-family: 'Cinzel', serif;
}

.stat-block-value--good { color: #80c080; }
.stat-block-value--bad  { color: #c08080; }

.chart-panel,
.historico-panel {
  margin-bottom: 1.25rem;
}

.chart-title {
  font-family: 'Cinzel', serif;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 1rem;
}

/* Tabela RPG */
.rpg-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.rpg-table th {
  font-family: 'Cinzel', serif;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  text-transform: uppercase;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border-gold);
}

.rpg-table td {
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
}

.rpg-table tr:hover td {
  background: var(--bg-hover);
}

.val-good { color: #80c080; }
.val-bad  { color: #c08080; }

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
