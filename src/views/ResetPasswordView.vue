<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-custom">
          <div class="card-header text-center">
            <h4 class="mb-0">
              <i class="bi bi-lock-fill me-2"></i>
              Restablecer Contraseña
            </h4>
          </div>
          <div class="card-body p-4">
            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="alert alert-success d-flex align-items-center" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>
                ¡Contraseña actualizada correctamente! Ahora puedes iniciar sesión con tu nueva contraseña.
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

            <!-- Token Invalid Message -->
            <div v-if="invalidToken" class="alert alert-warning" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              El enlace de recuperación ha expirado o no es válido. Por favor solicita un nuevo enlace de recuperación.
            </div>

            <!-- Reset Password Form -->
            <form @submit.prevent="handleResetPassword" v-if="!showSuccessMessage && !invalidToken">
              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="bi bi-lock me-1"></i>
                  Nueva Contraseña
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
                  Confirmar Nueva Contraseña
                </label>
                <div class="input-group">
                  <input
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Repite la contraseña"
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

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="authStore.loading"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-check-circle me-2"></i>
                {{ authStore.loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
              </button>
            </form>

            <!-- Navigation -->
            <div class="text-center">
              <router-link v-if="showSuccessMessage" to="/login" class="btn btn-primary">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </router-link>

              <div v-else-if="invalidToken">
                <router-link to="/forgot-password" class="btn btn-outline-primary me-2">
                  <i class="bi bi-envelope me-2"></i>
                  Solicitar Nuevo Enlace
                </router-link>
                <router-link to="/login" class="text-decoration-none text-primary">
                  <i class="bi bi-arrow-left me-1"></i>
                  Volver a Iniciar Sesión
                </router-link>
              </div>

              <router-link v-else to="/login" class="text-decoration-none text-primary">
                <i class="bi bi-arrow-left me-1"></i>
                Volver a Iniciar Sesión
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { authStore, handleUpdatePassword } = useAuth()

// Form data
const formData = ref({
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const validationErrors = ref([])
const showSuccessMessage = ref(false)
const invalidToken = ref(false)

// Methods
const handleResetPassword = async () => {
  validationErrors.value = []
  authStore.clearError()

  const result = await handleUpdatePassword(formData.value.password, formData.value.confirmPassword)

  if (result.success) {
    showSuccessMessage.value = true
    formData.value.password = ''
    formData.value.confirmPassword = ''
  } else if (result.errors) {
    validationErrors.value = result.errors
  }
}

const checkRecoveryToken = async () => {
  // Check both query parameters and URL hash for recovery tokens
  const token = route.query.token
  const type = route.query.type

  // Supabase often sends tokens in the URL hash (fragment)
  const urlFragment = window.location.hash.substring(1)
  const fragmentParams = new URLSearchParams(urlFragment)

  const accessToken = route.query.access_token || fragmentParams.get('access_token')
  const refreshToken = route.query.refresh_token || fragmentParams.get('refresh_token')
  const errorCode = route.query.error || fragmentParams.get('error')
  const errorDescription = route.query.error_description || fragmentParams.get('error_description')

  // Check for errors first
  if (errorCode) {
    console.error('Recovery error:', errorCode, errorDescription)
    invalidToken.value = true
    authStore.setError(errorDescription || 'Error al procesar el enlace de recuperación')
    return
  }

  // For password recovery, we need either a recovery token or access_token
  if (type !== 'recovery' && !accessToken) {
    invalidToken.value = true
    return
  }

  try {
    // If we have access_token and refresh_token, set the session
    if (accessToken && refreshToken) {
      const result = await authStore.setRecoverySession(accessToken, refreshToken)
      if (!result.success) {
        invalidToken.value = true
        return
      }
    } else if (token) {
      // Verify the recovery token
      const result = await authStore.verifyRecoveryToken(token)
      if (!result.success) {
        invalidToken.value = true
        return
      }
    } else {
      invalidToken.value = true
      return
    }

    // If we get here, the token is valid
    invalidToken.value = false

    // Clean up the URL to remove sensitive tokens
    const cleanUrl = window.location.origin + window.location.pathname
    window.history.replaceState({}, document.title, cleanUrl)

  } catch (error) {
    console.error('Error checking recovery token:', error)
    invalidToken.value = true
    authStore.setError('Error al verificar el enlace de recuperación')
  }
}

// Clear errors when component mounts
onMounted(async () => {
  authStore.clearError()
  validationErrors.value = []
  showSuccessMessage.value = false
  await checkRecoveryToken()
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
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: var(--electric-indigo);
  border-color: var(--electric-indigo);
}

.shadow-custom {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.alert {
  border-radius: 8px;
  border: none;
}

.alert-success {
  background-color: #d1edff;
  color: #0c4a6e;
}

.alert-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.alert-warning {
  background-color: #fef3c7;
  color: #92400e;
}
</style>
