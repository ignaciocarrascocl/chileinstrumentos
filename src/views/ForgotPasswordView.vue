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
            <div v-if="showSuccessMessage" class="alert alert-info d-flex align-items-center" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>
                ¡Perfecto! Te hemos enviado un email con instrucciones para restablecer tu contraseña.
                Por favor revisa tu bandeja de entrada.
              </div>
            </div>

            <!-- Error Alert -->
            <div v-if="authStore.error" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ authStore.error }}
              <button
                type="button"
                class="btn-close ms-auto"
                @click="authStore.clearError"
                aria-label="Close">
              </button>
            </div>

            <!-- Validation Errors -->
            <div v-if="validationErrors.length > 0" class="alert alert-danger" role="alert">
              <ul class="mb-0">
                <li v-for="error in validationErrors" :key="error">{{ error }}</li>
              </ul>
            </div>

            <!-- Instructions -->
            <div v-if="!showSuccessMessage" class="alert alert-info" role="alert">
              <i class="bi bi-info-circle me-2"></i>
              Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
            </div>

            <!-- Reset Password Form -->
            <form @submit.prevent="handleResetPassword" v-if="!showSuccessMessage">
              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="bi bi-envelope me-1"></i>
                  Email
                </label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="form-control"
                  placeholder="tu@email.com"
                  :disabled="authStore.loading"
                  required
                >
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="authStore.loading"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-envelope me-2"></i>
                {{ authStore.loading ? 'Enviando...' : 'Enviar Instrucciones' }}
              </button>
            </form>

            <!-- Navigation -->
            <div class="text-center">
              <router-link to="/login" class="text-decoration-none text-primary">
                <i class="bi bi-arrow-left me-1"></i>
                Volver a Iniciar Sesión
              </router-link>
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
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { authStore, handleResetPassword: resetPassword } = useAuth()

// Form data
const formData = ref({
  email: ''
})

const validationErrors = ref([])
const showSuccessMessage = ref(false)

// Methods
const handleResetPassword = async () => {
  validationErrors.value = []
  authStore.clearError()
  showSuccessMessage.value = false

  const result = await resetPassword(formData.value.email)

  if (result.success) {
    showSuccessMessage.value = true
    formData.value.email = ''
  } else if (result.errors) {
    validationErrors.value = result.errors
  }
}

// Clear errors when component mounts
onMounted(() => {
  authStore.clearError()
  validationErrors.value = []
  showSuccessMessage.value = false
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
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #3730A3, #6366F1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 56, 202, 0.3);
}

.btn-outline-primary {
  color: var(--electric-indigo);
  border-color: var(--electric-indigo);
}

.btn-outline-primary:hover {
  background: var(--gradient-primary);
  border-color: var(--electric-indigo);
  color: white;
}

.alert-info {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  border: none;
}
</style>
