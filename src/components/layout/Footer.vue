<template>
    <footer class="footer">
      <!-- Línea decorativa superior -->
      <div class="footer-divider">
        <span class="divider-symbol">◈</span>
        <span class="divider-line"></span>
        <span class="divider-symbol">✦</span>
        <span class="divider-line"></span>
        <span class="divider-symbol">◈</span>
      </div>
  
      <div class="footer-container">
        <!-- Columna 1: Marca -->
        <div class="footer-column footer-brand">
          <div class="brand-logo">
            <img 
              src="@/assets/images/logos/logobrana.png" 
              alt="Brana Logo" 
              class="footer-logo"
            />
            <h3 class="brand-name">BRANA</h3>
          </div>
          <p class="brand-tagline">
            Hiperstición vestible para la generación eterna.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
                <circle cx="18.406" cy="5.594" r="1.44"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Discord">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
        </div>
  
        <!-- Columna 2: Shop -->
        <div class="footer-column">
          <h4 class="column-title">SHOP</h4>
          <ul class="footer-links">
            <li><router-link to="/productos">Todos los Productos</router-link></li>
            <li><router-link to="/categoria/remeras">Remeras</router-link></li>
            <li><router-link to="/categoria/buzos">Buzos</router-link></li>
            <li><router-link to="/categoria/pantalones">Pantalones</router-link></li>
            <li><router-link to="/coleccion">Colecciones</router-link></li>
          </ul>
        </div>
  
        <!-- Columna 3: Info -->
        <div class="footer-column">
          <h4 class="column-title">INFO</h4>
          <ul class="footer-links">
            <li><router-link to="/about">Sobre Nosotros</router-link></li>
            <li><router-link to="/filosofia">Nuestra Filosofía</router-link></li>
            <li><router-link to="/noticias">Noticias</router-link></li>
            <li><router-link to="/contacto">Contacto</router-link></li>
          </ul>
        </div>
  
        <!-- Columna 4: Legal -->
        <div class="footer-column">
          <h4 class="column-title">LEGAL</h4>
          <ul class="footer-links">
            <li><router-link to="/terminos">Términos y Condiciones</router-link></li>
            <li><router-link to="/privacidad">Política de Privacidad</router-link></li>
            <li><router-link to="/envios">Envíos y Devoluciones</router-link></li>
            <li><router-link to="/faq">FAQ</router-link></li>
          </ul>
        </div>
  
        <!-- Columna 5: Newsletter -->
        <div class="footer-column footer-newsletter">
          <h4 class="column-title">ÚNETE AL ARCANO</h4>
          <p class="newsletter-text">
            Suscríbete y recibe noticias, ofertas exclusivas y acceso anticipado.
          </p>
          <form @submit.prevent="handleNewsletter" class="newsletter-form">
            <input 
              v-model="email"
              type="email" 
              placeholder="TU EMAIL" 
              class="newsletter-input"
              required
            />
            <button type="submit" class="newsletter-button">
              <span>→</span>
            </button>
          </form>
        </div>
      </div>
  
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} BRANA. Todos los derechos reservados.
          </p>
          <div class="footer-badges">
            <span class="badge">MADE WITH ◈ IN ARGENTINA</span>
          </div>
        </div>
      </div>
  
      <!-- Línea decorativa inferior -->
      <div class="footer-divider footer-divider-bottom">
        <span class="divider-line"></span>
        <span class="divider-symbol">✦</span>
        <span class="divider-line"></span>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const email = ref('');
  const currentYear = computed(() => new Date().getFullYear());
  
  const handleNewsletter = () => {
    console.log('Newsletter subscription:', email.value);
    // Aquí iría la lógica para suscribir
    alert('¡Gracias por suscribirte!');
    email.value = '';
  };
  </script>
  
  <style scoped>
  /* Variables */
  :root {
    --gold: #DAA520;
    --gold-light: #FFD700;
    --bg-dark: #0a0a0a;
    --bg-darker: #050505;
  }
  
  /* Footer principal */
  .footer {
    background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-darker) 100%);
    color: rgba(255, 255, 255, 0.8);
    padding: 4rem 0 0;
    position: relative;
    overflow: hidden;
  }
  
  /* Efecto de brillo sutil en el fondo */
  .footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--gold) 50%,
      transparent
    );
    opacity: 0.5;
  }
  
  /* Divider decorativo */
  .footer-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 4rem;
    opacity: 0.6;
  }
  
  .footer-divider-bottom {
    margin-top: 2rem;
    margin-bottom: 0;
    padding-top: 2rem;
  }
  
  .divider-line {
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  
  .divider-symbol {
    font-size: 1.2rem;
    color: var(--gold);
    animation: symbolRotate 8s linear infinite;
  }
  
  @keyframes symbolRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* Container */
  .footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem 4rem;
    display: grid;
    grid-template-columns: 2fr repeat(4, 1fr);
    gap: 3rem;
  }
  
  /* Columnas */
  .footer-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .column-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin: 0;
  }
  
  /* Marca */
  .footer-brand {
    gap: 1.5rem;
  }
  
  .brand-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .footer-logo {
    width: 50px;
    height: auto;
    filter: drop-shadow(0 0 10px rgba(218, 165, 32, 0.5));
    animation: logoFloat 6s ease-in-out infinite;
  }
  
  @keyframes logoFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(180deg); }
  }
  
  .brand-name {
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--gold);
    letter-spacing: 0.3em;
    margin: 0;
    text-shadow: 0 0 20px rgba(218, 165, 32, 0.3);
  }
  
  .brand-tagline {
    font-size: 0.9rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    max-width: 280px;
  }
  
  /* Social Links */
  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(218, 165, 32, 0.1);
    border: 1px solid rgba(218, 165, 32, 0.3);
    border-radius: 8px;
    color: var(--gold);
    transition: all 0.3s ease;
  }
  
  .social-link svg {
    width: 20px;
    height: 20px;
  }
  
  .social-link:hover {
    background: var(--gold);
    color: #000;
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(218, 165, 32, 0.4);
  }
  
  /* Links */
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .footer-links a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
  }
  
  .footer-links a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--gold);
    transition: width 0.3s ease;
  }
  
  .footer-links a:hover {
    color: var(--gold);
    transform: translateX(5px);
  }
  
  .footer-links a:hover::after {
    width: 100%;
  }
  
  /* Newsletter */
  .footer-newsletter {
    gap: 1rem;
  }
  
  .newsletter-text {
    font-size: 0.9rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }
  
  .newsletter-form {
    display: flex;
    gap: 0.5rem;
  }
  
  .newsletter-input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(218, 165, 32, 0.3);
    border-radius: 8px;
    color: #ffffff;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .newsletter-input:focus {
    outline: none;
    border-color: var(--gold);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 15px rgba(218, 165, 32, 0.2);
  }
  
  .newsletter-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .newsletter-button {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    border: none;
    border-radius: 8px;
    color: #000;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .newsletter-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(218, 165, 32, 0.5);
  }
  
  /* Footer Bottom */
  .footer-bottom {
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem 0;
    border-top: 1px solid rgba(218, 165, 32, 0.1);
  }
  
  .footer-bottom-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .copyright {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }
  
  .footer-badges {
    display: flex;
    gap: 1rem;
  }
  
  .badge {
    font-size: 0.75rem;
    color: var(--gold);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(218, 165, 32, 0.3);
    border-radius: 20px;
    background: rgba(218, 165, 32, 0.05);
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .footer-container {
      grid-template-columns: repeat(2, 1fr);
    }
  
    .footer-brand {
      grid-column: 1 / -1;
    }
  }
  
  @media (max-width: 768px) {
    .footer-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  
    .footer-bottom-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  
    .social-links {
      justify-content: center;
    }
  
    .divider-line {
      width: 60px;
    }
  }
  
  @media (max-width: 480px) {
    .footer {
      padding: 3rem 0 0;
    }
  
    .footer-container {
      padding: 0 1rem 3rem;
    }
  
    .brand-name {
      font-size: 1.5rem;
    }
  
    .footer-logo {
      width: 40px;
    }
  }
  </style>