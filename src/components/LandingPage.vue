<script setup>
</script>

<template>
  <div class="landing-container">

    <nav class="navbar">
      <div class="logo">Recordatorios<span>Vue</span></div>
      <RouterLink to="/login" class="login-button">Iniciar Sesión</RouterLink>
    </nav>

    <header class="hero">
      <h1 class="hero-title">Domina tu tiempo, <br> <span class="highlight">sin olvidar lo importante.</span></h1>
      <p class="hero-subtitle">
        La herramienta de recordatorios minimalista diseñada para desarrolladores que buscan eficiencia y claridad.
      </p>
      <div class="cta-group">
        <RouterLink to="/login" class="cta-main">Comenzar ahora</RouterLink>
      </div>
    </header>

    <section id="features" class="features">
      <div class="feature-card">
        <div class="icon">⚡</div>
        <h3>Gestión Rápida</h3>
        <p>Añade tareas y asigna prioridades en segundos.</p>
      </div>
      <div class="feature-card">
        <div class="icon">🎯</div>
        <h3>Enfoque Total</h3>
        <p>Interfaz limpia para que nada te distraiga de tus objetivos.</p>
      </div>
      <div class="feature-card">
        <div class="icon">📊</div>
        <h3>Estadísticas</h3>
        <p>Visualiza tu progreso con nuestro contador de tareas completadas.</p>
      </div>
    </section>

    <footer class="footer">
      <p>Desarrollado por Iván Ortiz Santos</p>
    </footer>
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  padding: 0 2rem;
  overflow-x: hidden;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  max-width: 1100px;
  margin: 0 auto;
}

.logo { font-size: 1.5rem; font-weight: bold; }
.logo span { color: #42b883; }

.login-button {
  text-decoration: none;
  color: #fff;
  border: 1px solid #42b883;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: 0.3s;
  white-space: nowrap;
}

.login-button:hover { background: #42b883; }

.hero {
  text-align: center;
  padding: 4rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.highlight { color: #42b883; }

.hero-subtitle {
  font-size: 1.2rem;
  color: #aaa;
  margin-bottom: 2rem;
}

.cta-main {
  background: #42b883;
  color: #1a1a1a;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  margin-right: 1rem;
  display: inline-block;
  transition: background 0.3s;
}

.cta-main:hover { background: #3aa876; }
.cta-secondary { color: #fff; text-decoration: underline; }

.preview {
  margin: 4rem auto;
  max-width: 900px;
  perspective: 1000px;
}

.window-mockup {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  transform: rotateX(5deg);
}

.dots { display: flex; gap: 5px; margin-bottom: 10px; }
.dots span { width: 10px; height: 10px; border-radius: 50%; background: #ff5f56; }
.dots span:nth-child(2) { background: #ffbd2e; }
.dots span:nth-child(3) { background: #27c93f; }

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 4rem auto;
}

.feature-card {
  background: #252525;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
}

.icon { font-size: 2rem; margin-bottom: 1rem; }

.footer {
  text-align: center;
  padding: 4rem 0;
  color: #666;
  font-size: 0.9rem;
}

/* ── Tablet (≤768px) ── */
@media (max-width: 768px) {
  .landing-container { padding: 0 1rem; }
  .navbar { padding: 1.2rem 0; }
  .logo { font-size: 1.2rem; }
  .login-button { padding: 0.4rem 1rem; font-size: 0.9rem; }

  .hero { padding: 2.5rem 0; }
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }

  .cta-main {
    display: block;
    width: 100%;
    text-align: center;
    margin-right: 0;
    margin-bottom: 0.75rem;
  }

  .cta-secondary { display: block; text-align: center; }

  .features { grid-template-columns: 1fr; gap: 1rem; margin: 2rem auto; }
  .feature-card { padding: 1.5rem; }

  .preview { margin: 1.5rem auto; }
  .window-mockup { transform: none; padding: 0.75rem; }

  .footer { padding: 2rem 0; }
}

/* ── Móvil pequeño (≤480px) ── */
@media (max-width: 480px) {
  .landing-container { 
    padding: 0 1rem; /* Menos padding en móviles pequeños */
  }
  .navbar { flex-direction: column; gap: 1rem; align-items: flex-start; }
  .login-button { align-self: flex-start; }
  .hero-title { font-size: 1.6rem; }
  .hero-subtitle { font-size: 0.95rem; }
  .feature-card { padding: 1.2rem; }
}

/* ── Desktop grande (≥1280px) ── */
@media (min-width: 1280px) {
  .hero-title { font-size: 4rem; }
  .features { grid-template-columns: repeat(3, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .window-mockup { transform: none; }
}
</style>