<script setup>
import { onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'

onMounted(() => {
  // Cargar Bootstrap CSS
  const bootstrapLink = document.createElement('link')
  bootstrapLink.rel = 'stylesheet'
  bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
  document.head.appendChild(bootstrapLink)

  // Cargar Bootstrap Icons CSS
  const iconsLink = document.createElement('link')
  iconsLink.rel = 'stylesheet'
  iconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css'
  document.head.appendChild(iconsLink)

  // Cargar Google Fonts - Roboto y Roboto Mono
  const fontsLink = document.createElement('link')
  fontsLink.rel = 'stylesheet'
  fontsLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap'
  document.head.appendChild(fontsLink)

  // Cargar Animate.css
  const animateLink = document.createElement('link')
  animateLink.rel = 'stylesheet'
  animateLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
  document.head.appendChild(animateLink)

  // Cargar Bootstrap JS
  const bootstrapScript = document.createElement('script')
  bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
  document.head.appendChild(bootstrapScript)
})
</script>

<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style>
/* CSS Variables - Color Palette */
:root {
  --raisin-black: #211a1d;
  --electric-indigo: #4338CA;
  --medium-slate-blue: #8075ff;

  /* Gradient Variables */
  --gradient-primary: linear-gradient(135deg, var(--electric-indigo), var(--medium-slate-blue));
  --gradient-background: linear-gradient(180deg, #ffffff, #f8f9fa);
}

.text-primary {
  color: var(--electric-indigo) !important;
}
/* Reset and Base Styles */
* {
  box-sizing: border-box;
}

body {
  background: #ffffff;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--raisin-black);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  background: var(--gradient-background);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 76px; /* Espacio para el navbar fijo */
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  color: var(--raisin-black);
}

.display-1, .display-2, .display-3, .display-4 {
  font-weight: 700;
}

code, pre, .code {
  font-family: 'Roboto Mono', monospace;
}

/* Custom Color Classes */
.text-primary {
  color: var(--electric-indigo) !important;
}

.text-secondary {
  color: var(--medium-slate-blue) !important;
}

.text-dark {
  color: var(--raisin-black) !important;
}

.text-light {
  color: #6c757d !important;
}

.text-muted {
  color: #6c757d !important;
}

.bg-primary {
  background: var(--gradient-primary) !important;
  color: white !important;
}

.bg-secondary {
  background-color: var(--medium-slate-blue) !important;
  color: white !important;
}

.bg-light {
  background-color: #f8f9fa !important;
  color: var(--raisin-black) !important;
}

.bg-dark {
  background-color: var(--raisin-black) !important;
  color: white !important;
}

/* Button Styles */
.btn-primary {
  background: var(--gradient-primary);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #3730A3, #6366F1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 56, 202, 0.3);
}

.btn-outline-primary {
  color: var(--electric-indigo);
  border-color: var(--electric-indigo);
  background: transparent;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: var(--gradient-primary);
  border-color: var(--electric-indigo);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 56, 202, 0.3);
}

.btn-outline-secondary {
  color: var(--medium-slate-blue);
  border-color: var(--medium-slate-blue);
  background: transparent;
}

.btn-outline-secondary:hover {
  background-color: var(--medium-slate-blue);
  border-color: var(--medium-slate-blue);
  color: white;
}

/* Card Styles */
.card {
  border: none;
  box-shadow: 0 4px 20px rgba(33, 26, 29, 0.1);
  border-radius: 16px;
  background: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 40px rgba(33, 26, 29, 0.15);
  transform: translateY(-4px);
}

.card-header {
  background: var(--gradient-primary) !important;
  color: white !important;
  border-bottom: none;
  border-radius: 16px 16px 0 0 !important;
  font-weight: 500;
}

/* Form Controls */
.form-control, .form-select {
  border: 2px solid #dee2e6;
  border-radius: 12px;
  background: white;
  color: var(--raisin-black);
  font-family: 'Roboto', sans-serif;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--electric-indigo);
  box-shadow: 0 0 0 0.2rem rgba(67, 56, 202, 0.25);
  background: white;
}

.input-group-text {
  background: var(--gradient-primary);
  color: white;
  border: none;
  font-weight: 500;
}

/* Badges */
.badge {
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.5em 0.75em;
  border-radius: 8px;
}

.badge.bg-primary {
  background: var(--gradient-primary) !important;
  color: white !important;
}

.badge.bg-secondary {
  background-color: var(--medium-slate-blue) !important;
  color: white !important;
}

.badge.bg-light {
  background-color: #f8f9fa !important;
  color: var(--raisin-black) !important;
  border: 1px solid #dee2e6;
}

/* Alert Styles */
.alert {
  border: none;
  border-radius: 12px;
  font-weight: 500;
}

.alert-danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

.alert-info {
  background: #f8f9fa;
  color: var(--raisin-black);
  border: 2px solid #dee2e6;
}

/* Pagination */
.page-link {
  border: none;
  color: var(--electric-indigo);
  padding: 0.75rem 1rem;
  margin: 0 0.25rem;
  border-radius: 12px;
  background: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.page-link:hover {
  background: var(--gradient-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);
}

.page-item.active .page-link {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);
}

.page-item.disabled .page-link {
  color: #6c757d;
  background: #f8f9fa;
}

/* Spinner */
.spinner-border {
  color: var(--electric-indigo) !important;
}

/* Dropdown */
.dropdown-menu {
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(33, 26, 29, 0.15);
  background: white;
  backdrop-filter: blur(10px);
}

.dropdown-item {
  color: var(--raisin-black);
  font-weight: 400;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: var(--gradient-primary);
  color: white;
}

/* Custom Utilities */
.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shadow-custom {
  box-shadow: 0 8px 40px rgba(33, 26, 29, 0.15) !important;
}

/* Smooth transitions */
* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .card {
    border-radius: 12px;
  }

  .btn {
    border-radius: 8px;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f8f9fa;
}

::-webkit-scrollbar-thumb {
  background: var(--gradient-primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #3730A3, #6366F1);
}
</style>
