const app = document.getElementById('app');
const canvas = document.getElementById('gameCanvas');

// Menú principal
function renderMenu() {
  canvas.style.display = "none";
  app.innerHTML = `
    <div class="menu">
      <h1>F1 Web Game</h1>
      <button class="button" onclick="renderModoPiloto()">Modo Piloto</button>
      <button class="button" onclick="renderModoManager()">Modo Manager</button>
      <button class="button" onclick="renderAjustes()">Ajustes</button>
    </div>
  `;
}

// Modo Piloto (placeholder)
function renderModoPiloto() {
  app.innerHTML = `
    <div class="modo">
      <h2>Modo Piloto</h2>
      <p>En desarrollo. Aquí podrás jugar carreras en tiempo real contra la IA.</p>
      <button class="button" onclick="renderMenu()">Volver al menú principal</button>
    </div>
  `;
}

// Modo Manager (placeholder)
function renderModoManager() {
  app.innerHTML = `
    <div class="modo">
      <h2>Modo Manager</h2>
      <p>En desarrollo. Aquí tomarás decisiones estratégicas y verás los resultados de tus pilotos.</p>
      <button class="button" onclick="renderMenu()">Volver al menú principal</button>
    </div>
  `;
}

// Ajustes (placeholder)
function renderAjustes() {
  app.innerHTML = `
    <div class="ajustes">
      <h2>Ajustes</h2>
      <p>En desarrollo. Pronto podrás configurar dificultad, gráficos, audio y más.</p>
      <button class="button" onclick="renderMenu()">Volver al menú principal</button>
    </div>
  `;
}

// Exponer funciones globalmente
window.renderMenu = renderMenu;
window.renderModoPiloto = renderModoPiloto;
window.renderModoManager = renderModoManager;
window.renderAjustes = renderAjustes;

// Inicia en el menú
renderMenu();