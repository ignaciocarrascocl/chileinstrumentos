<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-custom fixed-top">
    <div class="container">
      <!-- Logo/Brand -->
      <RouterLink to="/" class="navbar-brand d-flex align-items-center">
        <span class="fw-bold text-gradient">Chile Instrumentos</span>
      </RouterLink>

      <!-- Mobile toggle button -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link fw-500" active-class="active">
              <i class="bi bi-house me-1"></i>
              Catálogo
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link fw-500" active-class="active">
              <i class="bi bi-info-circle me-1"></i>
              Acerca de
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link fw-500" active-class="active">
              <i class="bi bi-envelope me-1"></i>
              Contacto
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Inicializar Bootstrap JS para el navbar
  if (typeof window !== 'undefined' && window.bootstrap) {
    // Bootstrap ya está cargado
  } else {
    // Cargar Bootstrap JS si no está disponible
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
.navbar {
  background: rgba(248, 240, 251, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--ash-gray);
  transition: all 0.3s ease;
}

.navbar-brand {
  font-size: 1.5rem;
  text-decoration: none !important;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.nav-link {
  color: var(--raisin-black) !important;
  font-weight: 500;
  padding: 0.75rem 1rem !important;
  border-radius: 8px;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--electric-indigo) !important;
  background: rgba(67, 56, 202, 0.1);
  transform: translateY(-2px);
}

.nav-link.active {
  color: white !important;
  background: var(--gradient-primary) !important;
  box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);
}

.navbar-toggler {
  padding: 0.5rem;
  border-radius: 8px;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(67, 56, 202, 0.25);
}

.fw-500 {
  font-weight: 500;
}

/* Add padding to body to account for fixed navbar */
:global(body) {
  padding-top: 76px;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--ash-gray);
  }

  .nav-link {
    margin: 0.25rem 0;
  }
}
</style>
