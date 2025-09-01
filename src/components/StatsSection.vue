<template>
  <div class="stats-container py-4">
    <div class="container-fluid">
      <div class="row g-3">
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <div class="stat-icon mb-2">
              <i class="bi bi-music-note-beamed"></i>
            </div>
            <div class="stat-number">{{ totalControllers }}</div>
            <div class="stat-label">Controladores Totales</div>
          </div>
        </div>
        
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <div class="stat-icon mb-2">
              <i class="bi bi-building"></i>
            </div>
            <div class="stat-number">{{ totalManufacturers }}</div>
            <div class="stat-label">Fabricantes</div>
          </div>
        </div>
        
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <div class="stat-icon mb-2">
              <i class="bi bi-search"></i>
            </div>
            <div class="stat-number">{{ filteredResults }}</div>
            <div class="stat-label">Resultados Filtrados</div>
          </div>
        </div>
        
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <div class="stat-icon mb-2">
              <i class="bi bi-calendar"></i>
            </div>
            <div class="stat-number">{{ latestYear }}</div>
            <div class="stat-label">Año Más Reciente</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalControllers: {
    type: Number,
    default: 0
  },
  totalManufacturers: {
    type: Number,
    default: 0
  },
  filteredResults: {
    type: Number,
    default: 0
  },
  latestYear: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.stats-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 2rem;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .stat-number {
    font-size: 2rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
}
</style>
