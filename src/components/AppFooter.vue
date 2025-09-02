<template>
  <footer class="footer py-3">
    <div class="container text-center">
      <p class="mb-0 text-light opacity-75">
        © {{ currentYear }} Chile Instrumentos. Todos los derechos reservados.
        <span class="ms-2">
          Desarrollado por
          <a
            href="https://estudiodospuntos.cl"
            target="_blank"
            rel="noopener noreferrer"
            class="studio-link"
          >
            <i class="bi bi-box-arrow-up-right me-1"></i>Estudio Dos Puntos
          </a>
        </span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--raisin-black) !important;
  margin-top: auto;
}

.text-light {
  color: #f8f9fa !important;
}

.opacity-75 {
  opacity: 0.75 !important;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1rem;
}

.studio-link {
  color: inherit;
  text-decoration: none;
  opacity: 0.9;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.studio-link:hover {
  transform: translateY(-1px);
  opacity: 1;
}
</style>
