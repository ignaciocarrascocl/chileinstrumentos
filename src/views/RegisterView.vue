<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-custom">
          <div class="card-header text-center">
            <h4 class="mb-0">
              <i class="bi bi-person-plus me-2"></i>
              Crear Cuenta
            </h4>
          </div>
          <div class="card-body p-4">
            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="alert alert-info d-flex align-items-center" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>
                ¡Cuenta creada exitosamente! Te hemos enviado un email de confirmación.
                Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
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

            <!-- Register Form -->
            <form @submit.prevent="handleRegister" v-if="!showSuccessMessage">
              <div class="mb-3">
                <label for="displayName" class="form-label">
                  <i class="bi bi-person me-1"></i>
                  Nombre de Usuario
                </label>
                <input
                  id="displayName"
                  v-model="formData.displayName"
                  type="text"
                  class="form-control"
                  placeholder="Ej: Juan Pérez"
                  :disabled="authStore.loading"
                  required
                >
              </div>

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

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="bi bi-lock me-1"></i>
                  Contraseña
                </label>
                <div class="input-group">
                  <input
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Mínimo 6 caracteres"
                    :disabled="authStore.loading"
                    required
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                    :disabled="authStore.loading"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  <i class="bi bi-lock-fill me-1"></i>
                  Confirmar Contraseña
                </label>
                <div class="input-group">
                  <input
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Repite tu contraseña"
                    :disabled="authStore.loading"
                    required
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showConfirmPassword = !showConfirmPassword"
                    :disabled="authStore.loading"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="terms"
                    v-model="formData.acceptTerms"
                    type="checkbox"
                    class="form-check-input"
                    :disabled="authStore.loading"
                    required
                  >
                  <label for="terms" class="form-check-label">
                    Acepto los
                    <a href="#" class="text-decoration-none">términos y condiciones</a>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="authStore.loading || !formData.acceptTerms"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-person-plus me-2"></i>
                {{ authStore.loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </button>
            </form>

            <!-- Navigation -->
            <div v-if="showSuccessMessage" class="text-center">
              <router-link to="/login" class="btn btn-primary">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Ir a Iniciar Sesión
              </router-link>
            </div>

            <div v-else>
              <hr class="my-4">
              <div class="text-center">
                <p class="text-muted mb-2">¿Ya tienes una cuenta?</p>
                <router-link to="/login" class="btn btn-outline-primary">
                  <i class="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
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

const { authStore, handleSignUp } = useAuth()

// Form data
const formData = ref({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const validationErrors = ref([])
const showSuccessMessage = ref(false)

// Methods
const handleRegister = async () => {
  validationErrors.value = []
  authStore.clearError()
  showSuccessMessage.value = false

  const result = await handleSignUp(
    formData.value.email,
    formData.value.password,
    formData.value.confirmPassword,
    formData.value.displayName
  )

  if (result.success) {
    showSuccessMessage.value = true
    // Reset form
    formData.value = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
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
