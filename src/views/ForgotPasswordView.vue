<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-custom">
          <div class="card-header text-center">
            <h4 class="mb-0">
              <i class="bi bi-key me-2"></i>
              Recuperar Contraseña
            </h4>
          </div>
          <div class="card-body p-4">
            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="alert alert-success d-flex align-items-center" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>
                ¡Perfecto! Te hemos enviado un email con instrucciones para restablecer tu contraseña.
                Por favor revisa tu bandeja de entrada.
              </div>
            </div>

            <!-- Error Alert - Single error display -->
            <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div class="flex-grow-1">{{ errorMessage }}</div>
              <button
                type="button"
                class="btn-close ms-2"
                @click="clearErrors"
                aria-label="Close">
              </button>
            </div>

            <!-- Instructions -->
            <div v-if="!showSuccessMessage && !errorMessage" class="alert alert-info" role="alert">
              <i class="bi bi-info-circle me-2"></i>
              Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
            </div>

            <!-- Reset Password Form -->
            <form @submit.prevent="handleSubmit" v-if="!showSuccessMessage">
              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="bi bi-envelope me-1"></i>
                  Email
                </label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="tu@email.com"
                  :disabled="isLoading"
                  required
                >
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="isLoading || !email.trim()"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-envelope me-2"></i>
                {{ isLoading ? 'Enviando...' : 'Enviar Instrucciones' }}
              </button>
            </form>

            <!-- Navigation -->
            <div class="text-center">
              <button
              class="btn btn-primary w-100 mb-3"
              @click="$router.push('/login')"
              type="button"
              >
              <i class="bi bi-arrow-left me-1"></i>
              Volver a Iniciar Sesión
              </button>
            </div>

            <div v-if="!showSuccessMessage">
              <hr class="my-4">
              <div class="text-center">
                <p class="text-muted mb-2">¿No tienes una cuenta?</p>
                <router-link to="/register" class="btn btn-outline-primary">
                  <i class="bi bi-person-plus me-2"></i>
                  Crear Cuenta
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { authStore, handleResetPassword } = useAuth()

// Reactive state
const email = ref('')
const showSuccessMessage = ref(false)

// Computed properties
const isLoading = computed(() => authStore.loading)
const errorMessage = computed(() => authStore.error)

// Methods
const clearErrors = () => {
  authStore.clearError()
  showSuccessMessage.value = false
}

const handleSubmit = async () => {
  if (!email.value.trim()) return

  clearErrors()

  const result = await handleResetPassword(email.value.trim())

  if (result.success) {
    showSuccessMessage.value = true
    email.value = ''
  }
  // Error handling is managed by the auth store
}

// Initialize component
onMounted(() => {
  clearErrors()
})
</script>

<style scoped>
.card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(67, 56, 202, 0.25);
  border-color: var(--electric-indigo);
}

.btn-primary {
  background: var(--gradient-primary);
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #3730A3, #6366F1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 56, 202, 0.3);
}

.btn-primary:disabled {
  background: #6c757d;
  border-color: #6c757d;
  transform: none;
  box-shadow: none;
}

.btn-outline-primary {
  color: var(--electric-indigo);
  border-color: var(--electric-indigo);
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: var(--gradient-primary);
  border-color: var(--electric-indigo);
  color: white;
  transform: translateY(-1px);
}

.alert-success {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
}

.alert-info {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  border: none;
}

.alert-danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
}

.btn-close {
  filter: invert(1);
}
.btn-primary {
  background: var(--gradient-primary);
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #3730A3, #6366F1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 56, 202, 0.3);
}

.btn-outline-primary {
  color: var(--electric-indigo);
  border-color: var(--electric-indigo);
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: var(--electric-indigo);
  border-color: var(--electric-indigo);
}
</style>
