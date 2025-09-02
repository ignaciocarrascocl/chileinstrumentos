<template>
  <div class="under-construction-page d-flex align-items-center justify-content-center">
    <div class="text-center p-4">
      <h1 class="mb-3">Estamos construyendo esta sección y este sitio.</h1>
      <p class="mb-3">
        Si quieres contactarnos, hazlo acá:
        <a
          href="https://estudiodospuntos.cl"
          target="_blank"
          rel="noopener noreferrer"
          class="studio-link"
        >
          estudiodospuntos.cl
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
// ...existing code...
</script>

<style scoped>
.under-construction-page {
  min-height: calc(100vh - 76px);
  background: var(--gradient-background);
  color: var(--bs-body-color, #222);
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
}

.studio-link {
  color: var(--bs-primary);
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
}

.studio-link:hover {
  text-decoration: underline;
}
</style>
