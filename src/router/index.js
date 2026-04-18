import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView    from '../views/LoginView.vue'
import TarefasView  from '../views/TarefasView.vue'
import EnsinarView  from '../views/EnsinarView.vue'
import ProgressoView from '../views/ProgressoView.vue'
import TestarView   from '../views/TestarView.vue'
import ChatView     from '../views/ChatView.vue'

const routes = [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/',               name: 'tarefas',  component: TarefasView },
    { path: '/ensinar/:tarefaId', name: 'ensinar', component: EnsinarView, props: true },
    { path: '/progresso',      name: 'progresso', component: ProgressoView },
    { path: '/testar',         name: 'testar',    component: TestarView },
    { path: '/chat',           name: 'chat',      component: ChatView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const auth = useAuthStore()
    if (!to.meta.public && !auth.isAuthenticated) {
        return { name: 'login' }
    }
    if (to.name === 'login' && auth.isAuthenticated) {
        return { name: 'tarefas' }
    }
})

export default router
