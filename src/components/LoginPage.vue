<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword} from 'firebase/auth';

const auth = getAuth();
const router = useRouter();

const providerGoogle = new GoogleAuthProvider();
const providerTwitter = new TwitterAuthProvider();
const providerFaceBook = new FacebookAuthProvider();

var logueado = ref(false);

const email = ref("");
const password = ref("");
const mensaje = ref("");

async function iniciarSesionProvider(provider) {
  try { await signInWithPopup(auth, provider); 
        // Si tiene éxito, redirigimos
    router.push('/recordatorios');
  } 
  catch (error) { mensaje.value = error.message; }
}

async function iniciarSesionEmail() {
  if (!email.value || !password.value) return mensaje.value = "Rellena los campos";
  try { await signInWithEmailAndPassword(auth, email.value, password.value); 
    // Si tiene éxito, redirigimos
    router.push('/recordatorios');
  } 
  catch (error) { 
    if (error.code === 'auth/invalid-credential') {
      mensaje.value = "Correo o contraseña incorrectos.";
    } else {
      mensaje.value = "Error de inicio de sesión. Inténtalo de nuevo.";
    }
  }
}
</script>
<template>
  <div class="auth-container">
    <div class="auth-card">
      <header class="auth-header">
        <div class="logo-circle">
          <i class="fas fa-sign-in-alt"></i>
        </div>
        <h1>Iniciar Sesion</h1>
      </header>

      <div class="auth-form">
        <div class="input-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="ejemplo@correo.com"
            required
            v-model="email"
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••"
            required
            v-model="password"
          />
        </div>

        <p class="errorMessage"> {{ mensaje }}</p>

        <button @click="iniciarSesionEmail" class="btn-login">
          Iniciar Sesion
        </button>
      </div>

      <div class="social-auth">
    <div class="divider">
      <span>o continúa con</span>
    </div>

    <div class="social-buttons">
      <button @click="iniciarSesionProvider(providerGoogle)" class="social-btn google" title="Iniciar sesión con Google">
        <i class="fab fa-google"></i>
      </button>
      
      <button @click="iniciarSesionProvider(providerTwitter)" class="social-btn twitter" title="Iniciar sesión con Twitter">
        <i class="fab fa-twitter"></i>
      </button>
      
      <button @click="iniciarSesionProvider(providerFaceBook)" class="social-btn facebook" title="Iniciar sesión con Facebook">
        <i class="fab fa-facebook-f"></i>
      </button>
    </div>
  </div>

      <footer class="auth-footer">
        <p>¿No tienes cuenta? <RouterLink to="register" class="back-link">Registrate</RouterLink> </p>
        <RouterLink to="/" class="back-link">← Volver a Inicio</RouterLink>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212;
  padding: 1rem;
}

.auth-card {
  background-color: #1e1e1e;
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  box-sizing: border-box;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-circle {
  width: 50px;
  height: 50px;
  background-color: #42b883;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #121212;
  font-size: 1.2rem;
}

.check-icon {
  color: #121212;
  font-size: 1.5rem;
  font-weight: bold;
}

.auth-header h1 {
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #888;
  font-size: 0.9rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: #ccc;
  font-size: 0.85rem;
  font-weight: 500;
}

.input-group input {
  background-color: #2a2a2a;
  border: 1px solid #444;
  padding: 0.8rem;
  border-radius: 6px;
  color: #fff;
  transition: border-color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #42b883;
}

.btn-login,
.btn-register {
  background-color: #42b883;
  color: #121212;
  border: none;
  padding: 0.9rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  font-family: inherit;
  font-size: 1rem;
  width: 100%;
}

.btn-login:hover,
.btn-register:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer p {
  color: #888;
  margin-bottom: 1rem;
}

.auth-footer a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
}

.back-link {
  display: block;
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
  margin-top: 1rem;
}

.back-link:hover { color: #fff; }

.social-auth { margin-top: 1.5rem; }

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #666;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #333;
}

.divider span {
  padding: 0 10px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-btn {
  background-color: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.social-btn:hover      { transform: translateY(-3px); border-color: #fff; }
.google:hover          { color: #ea4335; box-shadow: 0 4px 15px rgba(234,67,53,0.2); }
.twitter:hover         { color: #1da1f2; box-shadow: 0 4px 15px rgba(29,161,242,0.2); }
.facebook:hover        { color: #1877f2; box-shadow: 0 4px 15px rgba(24,119,242,0.2); }

.errorMessage { color: rgb(200, 43, 43); }

/* ── Tablet (≤768px) ── */
@media (max-width: 768px) {
  .auth-card { padding: 2rem 1.5rem; }
  .auth-header h1 { font-size: 1.3rem; }
}

/* ── Móvil pequeño (≤480px) ── */
@media (max-width: 480px) {
  .auth-container { align-items: flex-start; padding-top: 2rem; }
  .auth-card { padding: 1.5rem 1rem; max-width: 100%; }
  .auth-header h1 { font-size: 1.2rem; }
  .logo-circle { width: 44px; height: 44px; }
  .social-btn { width: 44px; height: 44px; font-size: 1rem; }
  .btn-login,
  .btn-register { padding: 0.8rem; font-size: 0.95rem; }
}
</style>