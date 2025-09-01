<script setup>
import { onMounted } from 'vue'

onMounted(() => {
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
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* CSS Variables - Color Palette */
:root {
  --raisin-black: #211a1d;
  --electric-indigo: #6320ee;
  --medium-slate-blue: #8075ff;
  --magnolia: #f8f0fb;
  --ash-gray: #cad5ca;
  
  /* Gradient Variables */
  --gradient-primary: linear-gradient(135deg, var(--electric-indigo), var(--medium-slate-blue));
  --gradient-background: linear-gradient(180deg, var(--magnolia), var(--ash-gray));
}

/* Reset and Base Styles */
* {
  box-sizing: border-box;
}

body {
  background: var(--magnolia);
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--raisin-black);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  background: var(--gradient-background);
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
  color: var(--ash-gray) !important;
}

.bg-primary {
  background: var(--gradient-primary) !important;
  color: white !important;
}

.bg-secondary {
  background-color: var(--medium-slate-blue) !important;
}

.bg-light {
  background-color: var(--magnolia) !important;
}

.bg-dark {
  background-color: var(--raisin-black) !important;
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
  background: linear-gradient(135deg, #5a1ccc, #7066e6);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 32, 238, 0.3);
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
  box-shadow: 0 8px 25px rgba(99, 32, 238, 0.3);
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
  background: rgba(248, 240, 251, 0.9);
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
  border: 2px solid var(--ash-gray);
  border-radius: 12px;
  background: rgba(248, 240, 251, 0.8);
  color: var(--raisin-black);
  font-family: 'Roboto', sans-serif;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--electric-indigo);
  box-shadow: 0 0 0 0.2rem rgba(99, 32, 238, 0.25);
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
}

.badge.bg-light {
  background-color: var(--magnolia) !important;
  color: var(--raisin-black) !important;
  border: 1px solid var(--ash-gray);
}

.badge.bg-info {
  background: linear-gradient(135deg, var(--medium-slate-blue), var(--ash-gray)) !important;
  color: var(--raisin-black) !important;
}

.badge.bg-warning {
  background: linear-gradient(135deg, var(--ash-gray), var(--magnolia)) !important;
  color: var(--raisin-black) !important;
}

/* Alert Styles */
.alert {
  border: none;
  border-radius: 12px;
  font-weight: 500;
}

.alert-danger {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
}

.alert-info {
  background: var(--magnolia);
  color: var(--raisin-black);
  border: 2px solid var(--ash-gray);
}

/* Pagination */
.page-link {
  border: none;
  color: var(--electric-indigo);
  padding: 0.75rem 1rem;
  margin: 0 0.25rem;
  border-radius: 12px;
  background: rgba(248, 240, 251, 0.8);
  font-weight: 500;
  transition: all 0.3s ease;
}

.page-link:hover {
  background: var(--gradient-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(99, 32, 238, 0.3);
}

.page-item.active .page-link {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 32, 238, 0.3);
}

.page-item.disabled .page-link {
  color: var(--ash-gray);
  background: rgba(202, 213, 202, 0.3);
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
  background: rgba(248, 240, 251, 0.95);
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
  background: var(--magnolia);
}

::-webkit-scrollbar-thumb {
  background: var(--gradient-primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a1ccc, #7066e6);
}
</style>
