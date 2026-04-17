<template>
  <div id="mathia-app">
    <nav role="navigation" aria-label="Navegação principal" class="main-nav">
      <div class="nav-brand">mathIA</div>
      <ul class="nav-links">
        <li><router-link to="/" aria-label="Tarefas de aprendizado">Tarefas</router-link></li>
        <li><router-link to="/progresso" aria-label="Progresso do modelo">Progresso</router-link></li>
        <li><router-link to="/testar" aria-label="Testar a IA">Testar</router-link></li>
      </ul>
    </nav>
    <main role="main" class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; color: #333; }
#mathia-app { min-width: 320px; min-height: 100vh; }
.main-nav { display: flex; align-items: center; gap: 2rem; padding: 1rem 2rem; background: #1a1a2e; color: #fff; }
.nav-brand { font-size: 1.5rem; font-weight: bold; }
.nav-links { display: flex; list-style: none; gap: 1rem; }
.nav-links a { color: #ccc; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: background 0.2s; }
.nav-links a:hover, .nav-links a.router-link-active { background: #16213e; color: #fff; }
.main-content { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
</style>
