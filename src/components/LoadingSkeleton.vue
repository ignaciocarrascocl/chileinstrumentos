<template>
  <div class="container-fluid py-4">
    <!-- Header Skeleton -->
    <div class="row mb-4">
      <div class="col-12 text-center">
        <div class="skeleton skeleton-title mx-auto mb-3"></div>
        <div class="skeleton skeleton-subtitle mx-auto"></div>
      </div>
    </div>

    <!-- Stats Skeleton -->
    <div class="stats-skeleton py-4 mb-4">
      <div class="container-fluid">
        <div class="row g-3">
          <div v-for="i in 4" :key="i" class="col-md-3 col-sm-6">
            <div class="skeleton-stat-card p-3">
              <div class="skeleton skeleton-icon mx-auto mb-2"></div>
              <div class="skeleton skeleton-number mx-auto mb-2"></div>
              <div class="skeleton skeleton-label mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Skeleton -->
    <div class="card shadow-sm mb-4">
      <div class="card-header">
        <div class="skeleton skeleton-filter-title"></div>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-8">
            <div class="skeleton skeleton-search-bar"></div>
          </div>
          <div class="col-md-4">
            <div class="skeleton skeleton-button"></div>
          </div>
        </div>
        <div class="row">
          <div v-for="i in 6" :key="i" class="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div class="skeleton skeleton-select"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Info Skeleton -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="skeleton skeleton-results-info"></div>
      <div class="skeleton skeleton-sort-button"></div>
    </div>

    <!-- Cards Skeleton -->
    <div class="row g-4">
      <div v-for="i in 12" :key="i" class="col-xl-3 col-lg-4 col-md-6">
        <div class="card h-100 shadow-sm border-0">
          <div class="skeleton skeleton-card-image"></div>
          <div class="card-body">
            <div class="skeleton skeleton-card-title mb-2"></div>
            <div class="skeleton skeleton-card-subtitle mb-2"></div>
            <div class="skeleton skeleton-card-description mb-3"></div>
            <div class="row g-1 mb-2">
              <div class="col-6">
                <div class="skeleton skeleton-spec"></div>
              </div>
              <div class="col-6">
                <div class="skeleton skeleton-spec"></div>
              </div>
            </div>
            <div class="skeleton skeleton-badge mb-2"></div>
            <div class="skeleton skeleton-price mb-2"></div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="skeleton skeleton-button"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica en este componente de loading
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-title {
  height: 3rem;
  width: 400px;
  margin-bottom: 1rem;
}

.skeleton-subtitle {
  height: 1.5rem;
  width: 300px;
}

.stats-skeleton {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.skeleton-stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.skeleton-icon {
  height: 2rem;
  width: 2rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.skeleton-number {
  height: 2.5rem;
  width: 80px;
  background: rgba(255, 255, 255, 0.3);
}

.skeleton-label {
  height: 1rem;
  width: 120px;
  background: rgba(255, 255, 255, 0.3);
}

.skeleton-filter-title {
  height: 1.5rem;
  width: 200px;
}

.skeleton-search-bar {
  height: 2.5rem;
  width: 100%;
}

.skeleton-button {
  height: 2.5rem;
  width: 100%;
}

.skeleton-select {
  height: 2.5rem;
  width: 100%;
}

.skeleton-results-info {
  height: 1.25rem;
  width: 250px;
}

.skeleton-sort-button {
  height: 2.5rem;
  width: 150px;
}

.skeleton-card-image {
  height: 200px;
  width: 100%;
  border-radius: 0;
}

.skeleton-card-title {
  height: 1.5rem;
  width: 80%;
}

.skeleton-card-subtitle {
  height: 1rem;
  width: 60%;
}

.skeleton-card-description {
  height: 1rem;
  width: 90%;
}

.skeleton-spec {
  height: 0.875rem;
  width: 100%;
}

.skeleton-badge {
  height: 1.5rem;
  width: 70px;
  border-radius: 12px;
}

.skeleton-price {
  height: 1.5rem;
  width: 80px;
}

@media (max-width: 768px) {
  .skeleton-title {
    width: 300px;
    height: 2.5rem;
  }
  
  .skeleton-subtitle {
    width: 250px;
  }
}
</style>
