<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-custom">
          <div class="card-header text-center">
            <h4 class="mb-0">
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Iniciar Sesión
            </h4>
          </div>
          <div class="card-body p-4">
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

            <!-- Login Form -->
            <form @submit.prevent="handleLogin">
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
                    placeholder="Tu contraseña"
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
                <div class="form-check">
                  <input
                    id="remember"
                    v-model="formData.remember"
                    type="checkbox"
                    class="form-check-input"
                    :disabled="authStore.loading"
                  >
                  <label for="remember" class="form-check-label">
                    Recordarme
                  </label>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="authStore.loading"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </form>

            <!-- Additional Actions -->
            <div class="text-center">
              <router-link to="/forgot-password" class="text-decoration-none text-primary">
                <i class="bi bi-question-circle me-1"></i>
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>

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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { authStore, handleSignIn } = useAuth()

// Form data
const formData = ref({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const validationErrors = ref([])

// Methods
const handleLogin = async () => {
  validationErrors.value = []
  authStore.clearError()

  const result = await handleSignIn(formData.value.email, formData.value.password)

  if (result.success) {
    // Redirect to catalog or intended page
    const redirectTo = router.currentRoute.value.query.redirect || '/'
    router.push(redirectTo)
  } else if (result.errors) {
    validationErrors.value = result.errors
  }
}

// Clear errors when component mounts
onMounted(() => {
  authStore.clearError()
  validationErrors.value = []
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
</style>
