<template>
  <div id="grimoire-app">

    <!-- Fundo com textura -->
    <div class="bg-texture"></div>

    <!-- Layout principal -->
    <div class="grimoire-layout">

      <!-- Sidebar — Painel do Personagem -->
      <aside class="sidebar" role="navigation" aria-label="Painel do Personagem">
        <div class="sidebar-inner">

          <!-- Avatar + Nome da IA -->
          <div class="char-header">
            <div class="char-portrait">
              <div class="portrait-frame">
                <span class="portrait-icon">🧠</span>
              </div>
            </div>
            <div class="char-info">
              <div class="char-name">mathIA</div>
              <div class="char-title">Entidade Arcana</div>
            </div>
          </div>

          <!-- Separador ornamental -->
          <div class="ornament-divider"><span>✦</span></div>

          <!-- Menu de navegação estilo RPG -->
          <nav class="rpg-menu" role="menubar">
            <router-link to="/" class="menu-item" role="menuitem" active-class="menu-item--active" exact>
              <span class="menu-icon">⚔️</span>
              <span class="menu-label">Missões</span>
            </router-link>
            <router-link to="/progresso" class="menu-item" role="menuitem" active-class="menu-item--active">
              <span class="menu-icon">📜</span>
              <span class="menu-label">Atributos</span>
            </router-link>
            <router-link to="/testar" class="menu-item" role="menuitem" active-class="menu-item--active">
              <span class="menu-icon">🔮</span>
              <span class="menu-label">Invocar</span>
            </router-link>
            <router-link to="/chat" class="menu-item" role="menuitem" active-class="menu-item--active">
              <span class="menu-icon">💬</span>
              <span class="menu-label">Consultar</span>
            </router-link>
          </nav>

          <!-- Separador ornamental -->
          <div class="ornament-divider"><span>✦</span></div>

          <!-- Stats rápidos -->
          <div class="quick-stats">
            <div class="stat-row">
              <span class="stat-name">Nível</span>
              <span class="stat-val">1</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Almas</span>
              <span class="stat-val">—</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Missões</span>
              <span class="stat-val">—</span>
            </div>
          </div>

          <!-- Rodapé da sidebar -->
          <div class="sidebar-footer">
            <span class="footer-hint">✦ Selecione ✦ Confirmar</span>
          </div>

        </div>
      </aside>

      <!-- Conteúdo principal -->
      <main class="main-panel" role="main">
        <div class="panel-frame">
          <div class="panel-inner">
            <router-view v-slot="{ Component }">
              <transition name="fade-panel" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
</script>

<style>
/* ============================================================
   RESET & BASE
   ============================================================ */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --gold:        #c9a84c;
  --gold-light:  #e8c96a;
  --gold-dark:   #8a6a1a;
  --bg-deep:     #0d0b08;
  --bg-panel:    #13110d;
  --bg-card:     #1a1610;
  --bg-hover:    #221e16;
  --text-main:   #d4c9a8;
  --text-dim:    #8a7d5a;
  --text-bright: #f0e6c0;
  --border:      #3a3020;
  --border-gold: #5a4a1a;
  --red:         #8b2020;
  --green:       #2a5a2a;
  --blue:        #1a3a5a;
  --sidebar-w:   260px;
}

html, body {
  height: 100%;
  background: var(--bg-deep);
  color: var(--text-main);
  font-family: 'IM Fell English', Georgia, serif;
  font-size: 15px;
  line-height: 1.6;
  overflow-x: hidden;
}

/* Scrollbar estilo RPG */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: var(--gold-dark); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--gold); }

/* ============================================================
   FUNDO COM TEXTURA
   ============================================================ */
.bg-texture {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(100, 70, 10, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(80, 50, 5, 0.06) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
  pointer-events: none;
}

/* ============================================================
   LAYOUT
   ============================================================ */
#grimoire-app {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.grimoire-layout {
  display: flex;
  min-height: 100vh;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--bg-panel);
  border-right: 2px solid var(--border-gold);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0,0,0,0.6);
}

/* Borda ornamental interna */
.sidebar::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(201, 168, 76, 0.15);
  pointer-events: none;
  z-index: 0;
}

.sidebar-inner {
  position: relative;
  z-index: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
}

/* Cabeçalho do personagem */
.char-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
}

.char-portrait {
  flex-shrink: 0;
}

.portrait-frame {
  width: 56px;
  height: 56px;
  border: 2px solid var(--gold);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  position: relative;
  clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px);
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.3), inset 0 0 8px rgba(0,0,0,0.5);
}

.char-info {
  flex: 1;
  min-width: 0;
}

.char-name {
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--gold-light);
  letter-spacing: 0.05em;
  text-shadow: 0 0 8px rgba(201, 168, 76, 0.4);
}

.char-title {
  font-size: 0.72rem;
  color: var(--text-dim);
  font-style: italic;
  margin-top: 0.1rem;
}

/* Divisor ornamental */
.ornament-divider {
  text-align: center;
  color: var(--gold-dark);
  font-size: 0.7rem;
  letter-spacing: 0.5em;
  padding: 0.6rem 0;
  position: relative;
}

.ornament-divider::before,
.ornament-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border-gold));
}

.ornament-divider::before { left: 0; }
.ornament-divider::after  { right: 0; background: linear-gradient(to left, transparent, var(--border-gold)); }

/* Menu RPG */
.rpg-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.25rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  color: var(--text-dim);
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  border: 1px solid transparent;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
}

.menu-item:hover {
  color: var(--gold-light);
  background: var(--bg-hover);
  border-color: var(--border-gold);
}

.menu-item--active {
  color: var(--gold-light) !important;
  background: var(--bg-card) !important;
  border-color: var(--gold-dark) !important;
}

.menu-item--active::before {
  content: '▶';
  position: absolute;
  left: -1px;
  color: var(--gold);
  font-size: 0.6rem;
}

.menu-icon { font-size: 1rem; width: 1.2rem; text-align: center; }
.menu-label { flex: 1; }

/* Stats rápidos */
.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.5rem 0;
  flex: 1;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.stat-name {
  color: var(--text-dim);
  font-family: 'Cinzel', serif;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
}

.stat-val {
  color: var(--text-bright);
  font-weight: 600;
  font-size: 0.85rem;
}

/* Rodapé sidebar */
.sidebar-footer {
  padding-top: 0.75rem;
  text-align: center;
  font-size: 0.65rem;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  border-top: 1px solid var(--border);
}

/* ============================================================
   PAINEL PRINCIPAL
   ============================================================ */
.main-panel {
  flex: 1;
  min-width: 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.panel-frame {
  flex: 1;
  border: 2px solid var(--border-gold);
  background: var(--bg-panel);
  position: relative;
  box-shadow: 0 0 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3);
}

/* Cantos ornamentais */
.panel-frame::before,
.panel-frame::after {
  content: '✦';
  position: absolute;
  color: var(--gold);
  font-size: 0.8rem;
  line-height: 1;
}
.panel-frame::before { top: -0.5rem; left: -0.5rem; }
.panel-frame::after  { bottom: -0.5rem; right: -0.5rem; }

.panel-inner {
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  position: relative;
}

/* Borda interna sutil */
.panel-inner::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(201, 168, 76, 0.08);
  pointer-events: none;
}

/* ============================================================
   TRANSIÇÃO DE PÁGINAS
   ============================================================ */
.fade-panel-enter-active,
.fade-panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-panel-enter-from { opacity: 0; transform: translateY(6px); }
.fade-panel-leave-to   { opacity: 0; transform: translateY(-6px); }

/* ============================================================
   UTILITÁRIOS GLOBAIS (usados pelas views)
   ============================================================ */

/* Título de seção estilo RPG */
.rpg-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.1rem;
  color: var(--gold-light);
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(201, 168, 76, 0.3);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rpg-subtitle {
  font-size: 0.8rem;
  color: var(--text-dim);
  font-style: italic;
  margin-bottom: 1.5rem;
}

/* Painel com borda dourada */
.rpg-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  padding: 1.25rem;
  position: relative;
}

.rpg-panel::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(201, 168, 76, 0.1);
  pointer-events: none;
}

/* Botão estilo RPG */
.rpg-btn {
  font-family: 'Cinzel', serif;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  padding: 0.5rem 1.25rem;
  background: var(--bg-card);
  color: var(--gold);
  border: 1px solid var(--gold-dark);
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  position: relative;
}

.rpg-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--gold);
  color: var(--gold-light);
  box-shadow: 0 0 8px rgba(201, 168, 76, 0.2);
}

.rpg-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.rpg-btn--primary {
  background: rgba(201, 168, 76, 0.1);
  border-color: var(--gold);
}

.rpg-btn--danger {
  color: #c06060;
  border-color: #6a2020;
}

.rpg-btn--danger:hover:not(:disabled) {
  background: rgba(139, 32, 32, 0.2);
  border-color: #c06060;
  color: #e08080;
}

/* Input estilo RPG */
.rpg-input,
.rpg-textarea,
.rpg-select {
  background: var(--bg-deep);
  border: 1px solid var(--border-gold);
  color: var(--text-main);
  padding: 0.6rem 0.75rem;
  font-family: 'IM Fell English', Georgia, serif;
  font-size: 0.9rem;
  width: 100%;
  transition: border-color 0.2s;
  outline: none;
}

.rpg-input:focus,
.rpg-textarea:focus,
.rpg-select:focus {
  border-color: var(--gold);
  box-shadow: 0 0 6px rgba(201, 168, 76, 0.15);
}

.rpg-textarea {
  resize: vertical;
  line-height: 1.5;
}

.rpg-select option {
  background: var(--bg-deep);
  color: var(--text-main);
}

/* Label */
.rpg-label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
}

/* Badge de status */
.rpg-badge {
  display: inline-block;
  font-family: 'Cinzel', serif;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.6rem;
  border: 1px solid;
  text-transform: uppercase;
}

.rpg-badge--active  { color: #80c080; border-color: #2a5a2a; background: rgba(42, 90, 42, 0.2); }
.rpg-badge--done    { color: #c0c080; border-color: #5a5a2a; background: rgba(90, 90, 42, 0.2); }
.rpg-badge--pending { color: #8080c0; border-color: #2a2a5a; background: rgba(42, 42, 90, 0.2); }

/* Mensagem de erro/sucesso */
.rpg-alert {
  padding: 0.6rem 1rem;
  font-size: 0.82rem;
  border: 1px solid;
  margin-bottom: 1rem;
  font-style: italic;
}

.rpg-alert--error   { color: #e08080; border-color: #6a2020; background: rgba(139, 32, 32, 0.15); }
.rpg-alert--success { color: #80c080; border-color: #2a5a2a; background: rgba(42, 90, 42, 0.15); }
.rpg-alert--info    { color: #80a0c0; border-color: #2a4a6a; background: rgba(42, 74, 106, 0.15); }

/* Divisor de seção */
.rpg-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.25rem 0;
  position: relative;
}

/* Spinner */
.rpg-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  gap: 0.5rem;
  color: var(--text-dim);
  font-style: italic;
  font-size: 0.85rem;
}

.rpg-spinner::before {
  content: '⟳';
  font-size: 1.5rem;
  color: var(--gold-dark);
  animation: rpg-spin 1.2s linear infinite;
  display: inline-block;
}

@keyframes rpg-spin { to { transform: rotate(360deg); } }

/* Texto vazio */
.rpg-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-dim);
  font-style: italic;
}

.rpg-empty-icon { font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.5; }
</style>
