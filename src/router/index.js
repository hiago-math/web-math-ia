import { createRouter, createWebHistory } from 'vue-router'
import TarefasView from '../views/TarefasView.vue'
import EnsinarView from '../views/EnsinarView.vue'
import ProgressoView from '../views/ProgressoView.vue'
import TestarView from '../views/TestarView.vue'

const routes = [
    { path: '/', name: 'tarefas', component: TarefasView },
    { path: '/ensinar/:tarefaId', name: 'ensinar', component: EnsinarView, props: true },
    { path: '/progresso', name: 'progresso', component: ProgressoView },
    { path: '/testar', name: 'testar', component: TestarView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
