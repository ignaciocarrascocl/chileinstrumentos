<template>
  <div class="info-boxes mb-3">
    <!-- Keys Box -->
    <div class="info-box">
      <div class="info-box-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
        <span class="fw-bold">Teclas:</span>
      </div>
      <div class="info-box-content">
        <span v-if="controller.keys_count && controller.keys_count !== 'NA'" class="fw-medium">
          {{ controller.keys_count }} teclas
        </span>
        <span v-else class="text-muted">N/A</span>
      </div>
    </div>

    <!-- Pads Box -->
    <div class="info-box">
      <div class="info-box-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid me-2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        <span class="fw-bold">Pads:</span>
      </div>
      <div class="info-box-content">
        <span v-if="controller.pads_count && controller.pads_count > 0" class="fw-medium">
          {{ controller.pads_count }} pads
        </span>
        <span v-else class="text-muted">N/A</span>
      </div>
    </div>

    <!-- Connections Box -->
    <div class="info-box">
      <div class="info-box-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-usb me-2"><circle cx="10" cy="7" r="1"/><circle cx="4" cy="20" r="1"/><path d="M4.7 19.3 19 5"/><path d="m21 3-3 1 2 2Z"/><path d="M9.26 7.68 5 12l2 5"/><path d="m10 14 5 2 3.5-3.5"/><path d="m18 12 1-1 1 1-1 1Z"/></svg>
        <span class="fw-bold">Conexiones:</span>
      </div>
      <div class="info-box-content">
        <div v-if="controller.connectivity && controller.connectivity.length > 0" class="connections-badges">
          <span
            v-for="connection in controller.connectivity"
            :key="connection"
            class="badge bg-info"
          >
            {{ formatConnectionName(connection) }}
          </span>
        </div>
        <span v-else class="text-muted">N/A</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImageHandling } from '@/composables/useImageHandling'

defineProps({
  controller: {
    type: Object,
    required: true
  }
})

const { formatConnectionName } = useImageHandling()
</script>

<style scoped>
.info-boxes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-box {
  background: rgba(67, 56, 202, 0.05);
  border: 1px solid rgba(67, 56, 202, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  border-left: 3px solid var(--electric-indigo);
}

.info-box-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--electric-indigo);
  font-size: 0.875rem;
}

.info-box-content {
  font-size: 0.875rem;
  color: var(--raisin-black);
}

.connections-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.connections-badges .badge {
  font-size: 0.7rem;
}
</style>
