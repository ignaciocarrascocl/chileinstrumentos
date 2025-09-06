<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Welcome Card -->
        <div class="card shadow-custom mb-4">
          <div class="card-header">
            <h4 class="mb-0">
              <i class="bi bi-person-circle me-2"></i>
              Mi Perfil
            </h4>
          </div>
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h5 class="text-override mb-2">¡Bienvenido, {{ authStore.userDisplayName }}!</h5>
                <p class="text-muted mb-2">
                  <i class="bi bi-envelope me-2"></i>
                  {{ authStore.userEmail }}
                </p>
                <p class="text-muted mb-0">
                  <i class="bi bi-calendar-check me-2"></i>
                  Cuenta activa desde {{ formatDate(authStore.user?.created_at) }}
                </p>
              </div>
              <div class="col-md-4 text-md-end">
                <div class="avatar-placeholder">
                  <i class="bi bi-person-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card shadow-custom h-100">
              <div class="card-body p-4 text-center">
                <div class="feature-icon mb-3">
                  <i class="bi bi-person-badge"></i>
                </div>
                <h5>Nombre de Usuario</h5>
                <p class="text-muted">Personaliza cómo te ven otros usuarios</p>
                <button
                  class="btn btn-outline-override"
                  @click="showDisplayNameModal = true"
                >
                  <i class="bi bi-pencil me-2"></i>
                  Editar Nombre
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="card shadow-custom h-100">
              <div class="card-body p-4 text-center">
                <div class="feature-icon mb-3">
                  <i class="bi bi-lock"></i>
                </div>
                <h5>Cambiar Contraseña</h5>
                <p class="text-muted">Actualiza tu contraseña para mantener tu cuenta segura</p>
                <button
                  class="btn btn-outline-override"
                  @click="showPasswordModal = true"
                >
                  <i class="bi bi-key me-2"></i>
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="card shadow-custom h-100">
              <div class="card-body p-4 text-center">
                <div class="feature-icon mb-3">
                  <i class="bi bi-box-arrow-right"></i>
                </div>
                <h5>Cerrar Sesión</h5>
                <p class="text-muted">Cierra tu sesión de forma segura</p>
                <button
                  class="btn btn-outline-danger"
                  @click="handleLogout"
                  :disabled="authStore.loading"
                >
                  <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity (placeholder) -->
        <div class="card shadow-custom">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-clock-history me-2"></i>
              Actividad Reciente
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="text-center text-muted py-4">
              <i class="bi bi-inbox display-4 mb-3"></i>
              <p>No hay actividad reciente que mostrar</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Display Name Modal -->
    <div v-if="showDisplayNameModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="closeDisplayNameModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-badge me-2"></i>
              Editar Nombre de Usuario
            </h5>
            <button type="button" class="btn-close" @click="closeDisplayNameModal"></button>
          </div>
          <div class="modal-body">
            <!-- Error Alert -->
            <div v-if="authStore.error" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ authStore.error }}
              <button type="button" class="btn-close ms-auto" @click="authStore.clearError"></button>
            </div>

            <!-- Validation Errors -->
            <div v-if="displayNameErrors.length > 0" class="alert alert-danger" role="alert">
              <ul class="mb-0">
                <li v-for="error in displayNameErrors" :key="error">{{ error }}</li>
              </ul>
            </div>

            <!-- Success Message -->
            <div v-if="displayNameSuccess" class="alert alert-info" role="alert">
              <i class="bi bi-check-circle me-2"></i>
              Nombre de usuario actualizado exitosamente
            </div>

            <form @submit.prevent="handleDisplayNameChange">
              <div class="mb-3">
                <label for="displayName" class="form-label">Nombre de Usuario</label>
                <input
                  id="displayName"
                  v-model="displayNameForm.displayName"
                  type="text"
                  class="form-control"
                  placeholder="Ej: Juan Pérez"
                  :disabled="authStore.loading"
                  required
                >
                <div class="form-text">
                  Este nombre se mostrará en tu perfil y será visible para otros usuarios.
                </div>
              </div>

              <div class="modal-footer px-0 pb-0">
                <button type="button" class="btn btn-back" @click="closeDisplayNameModal">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-override"
                  :disabled="authStore.loading"
                >
                  <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ authStore.loading ? 'Actualizando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="closePasswordModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-lock me-2"></i>
              Cambiar Contraseña
            </h5>
            <button type="button" class="btn-close" @click="closePasswordModal"></button>
          </div>
          <div class="modal-body">
            <!-- Error Alert -->
            <div v-if="authStore.error" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ authStore.error }}
              <button type="button" class="btn-close ms-auto" @click="authStore.clearError"></button>
            </div>

            <!-- Validation Errors -->
            <div v-if="passwordErrors.length > 0" class="alert alert-danger" role="alert">
              <ul class="mb-0">
                <li v-for="error in passwordErrors" :key="error">{{ error }}</li>
              </ul>
            </div>

            <!-- Success Message -->
            <div v-if="passwordSuccess" class="alert alert-info" role="alert">
              <i class="bi bi-check-circle me-2"></i>
              Contraseña actualizada exitosamente
            </div>

            <form @submit.prevent="handlePasswordChange">
              <div class="mb-3">
                <label for="newPassword" class="form-label">Nueva Contraseña</label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-control"
                  placeholder="Mínimo 6 caracteres"
                  :disabled="authStore.loading"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="confirmNewPassword" class="form-label">Confirmar Nueva Contraseña</label>
                <input
                  id="confirmNewPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-control"
                  placeholder="Repite la nueva contraseña"
                  :disabled="authStore.loading"
                  required
                >
              </div>

              <div class="modal-footer px-0 pb-0">
                <button type="button" class="btn btn-secondary" @click="closePasswordModal">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-override"
                  :disabled="authStore.loading"
                >
                  <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ authStore.loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
                </button>
              </div>
            </form>
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
const { authStore, handleSignOut, handleUpdateDisplayName, handleUpdatePassword } = useAuth()

// Modal state
const showPasswordModal = ref(false)
const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
})
const passwordErrors = ref([])
const passwordSuccess = ref(false)

// Display name modal state
const showDisplayNameModal = ref(false)
const displayNameForm = ref({
  displayName: ''
})
const displayNameErrors = ref([])
const displayNameSuccess = ref(false)

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = async () => {
  const result = await handleSignOut()
  if (result.success) {
    router.push('/login')
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.value = {
    newPassword: '',
    confirmPassword: ''
  }
  passwordErrors.value = []
  passwordSuccess.value = false
  authStore.clearError()
}

const closeDisplayNameModal = () => {
  showDisplayNameModal.value = false
  displayNameForm.value = {
    displayName: ''
  }
  displayNameErrors.value = []
  displayNameSuccess.value = false
  authStore.clearError()
}

const handlePasswordChange = async () => {
  passwordErrors.value = []
  passwordSuccess.value = false
  authStore.clearError()

  // Use the composable's helper method
  const result = await handleUpdatePassword(passwordForm.value.newPassword, passwordForm.value.confirmPassword)

  if (result.success) {
    passwordSuccess.value = true
    passwordForm.value = {
      newPassword: '',
      confirmPassword: ''
    }
    setTimeout(() => {
      closePasswordModal()
    }, 2000)
  } else {
    passwordErrors.value = result.errors || ['Error al actualizar la contraseña']
  }
}

const handleDisplayNameChange = async () => {
  displayNameErrors.value = []
  displayNameSuccess.value = false
  authStore.clearError()

  // Use the composable's helper method
  const result = await handleUpdateDisplayName(displayNameForm.value.displayName)

  if (result.success) {
    displayNameSuccess.value = true
    displayNameForm.value = {
      displayName: ''
    }
    setTimeout(() => {
      closeDisplayNameModal()
    }, 2000)
  } else {
    displayNameErrors.value = result.errors || ['Error al actualizar el nombre de usuario']
  }
}

// Initialize
onMounted(() => {
  authStore.clearError()
  // Set current display name when component mounts
  displayNameForm.value.displayName = authStore.userDisplayName || ''
})
</script>

<style scoped>
.btn-back {
  background: #6c757d;
  color: white;
  border: none;
}
.btn-back:hover {
  background: #5a6268;
  color: white;
}
.btn-override:hover {
  background: var(--electric-indigo);
  color: white;
}
.btn-override {
  background: var(--electric-indigo);
  color: white;
  border: none;
}
.btn-outline-override {
  color: var(--electric-indigo);
  border-color: var(--electric-indigo);
}
.btn-secondary { /* --- IGNORE --- */
  background: var(--electric-indigo);
  border-color: var(--electric-indigo);
}
.btn-outline-override:hover {
  background-color: var(--electric-indigo);
  border-color: var(--electric-indigo);
  color: white;
}
.text-override {
  color: var(--electric-indigo) !important;
}
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

.avatar-placeholder {
  font-size: 4rem;
  color: var(--electric-indigo);
  text-align: center;
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.modal.show {
  display: block !important;
}

.modal-content {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
