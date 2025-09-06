<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-custom fixed-top">
    <div class="container">
      <!-- Logo/Brand -->
      <RouterLink to="/" class="navbar-brand d-flex align-items-center">
        <span class="fw-bold text-gradient">Chile Instrumentos</span>
      </RouterLink>

      <!-- Mobile toggle button -->
      <button
        class="navbar-toggler border-0"
        type="button"
        aria-controls="navbarNav"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle navigation"
        @click="toggleMobileMenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation items -->
      <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link fw-500" active-class="active" @click="closeMobileMenu">
              <i class="bi bi-house me-1"></i>
              Catálogo
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link fw-500" active-class="active" @click="closeMobileMenu">
              <i class="bi bi-info-circle me-1"></i>
              Acerca de
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link fw-500" active-class="active" @click="closeMobileMenu">
              <i class="bi bi-envelope me-1"></i>
              Contacto
            </RouterLink>
          </li>
        </ul>

        <!-- Authentication Menu -->
        <ul class="navbar-nav ms-auto">
          <!-- Guest Menu -->
          <template v-if="!authStore.isAuthenticated">
            <li class="nav-item">
              <RouterLink to="/login" class="btn btn-outline-primary nav-btn me-2" @click="closeMobileMenu">
                <i class="bi bi-box-arrow-in-right me-1"></i>
                Iniciar Sesión
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/register" class="btn btn-primary nav-btn" @click="closeMobileMenu">
                <i class="bi bi-person-plus me-1"></i>
                Registrarse
              </RouterLink>
            </li>
          </template>

          <!-- Authenticated Menu -->
          <template v-else>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle fw-500 d-flex align-items-center"
                href="#"
                id="navbarDropdown"
                role="button"
                :aria-expanded="isDropdownOpen"
                @click.prevent="toggleDropdown"
              >
                <i class="bi bi-person-circle me-2"></i>
                <span class="d-none d-md-inline">{{ userDisplayName }}</span>
                <span class="d-md-none">Perfil</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" :class="{ show: isDropdownOpen }" aria-labelledby="navbarDropdown">
                <li>
                  <RouterLink to="/profile" class="dropdown-item" @click="closeMobileMenu">
                    <i class="bi bi-person me-2"></i>
                    Mi Perfil
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button
                    class="dropdown-item text-danger"
                    @click="handleLogout"
                    :disabled="authStore.loading"
                  >
                    <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)

// Computed
const userDisplayName = computed(() => {
  return authStore.userDisplayName || 'Usuario'
})

// Toggle dropdown menu
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Simple mobile menu toggle
const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  const navbarCollapse = document.getElementById('navbarNav')
  const navbarToggler = document.querySelector('.navbar-toggler')

  if (navbarCollapse && navbarToggler) {
    if (isMenuOpen.value) {
      navbarCollapse.classList.add('show')
      navbarToggler.setAttribute('aria-expanded', 'true')
      navbarToggler.classList.remove('collapsed')
    } else {
      navbarCollapse.classList.remove('show')
      navbarToggler.setAttribute('aria-expanded', 'false')
      navbarToggler.classList.add('collapsed')
    }
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  if (isMenuOpen.value) {
    isMenuOpen.value = false
    const navbarCollapse = document.getElementById('navbarNav')
    const navbarToggler = document.querySelector('.navbar-toggler')

    if (navbarCollapse) {
      navbarCollapse.classList.remove('show')
    }
    if (navbarToggler) {
      navbarToggler.setAttribute('aria-expanded', 'false')
      navbarToggler.classList.add('collapsed')
    }
  }
  // Also close dropdown
  isDropdownOpen.value = false
}

// Methods
const handleLogout = async () => {
  // Close mobile menu first
  closeMobileMenu()

  const result = await authStore.signOut()
  if (result.success) {
    router.push('/login')
  }
}

onMounted(async () => {
  // Initialize auth state
  authStore.initializeAuth()

  // Wait for DOM to be ready
  await nextTick()

  // Close menu and dropdown when clicking outside
  document.addEventListener('click', (event) => {
    const navbar = document.querySelector('.navbar')
    if (navbar && !navbar.contains(event.target)) {
      if (isMenuOpen.value) {
        closeMobileMenu()
      }
      if (isDropdownOpen.value) {
        isDropdownOpen.value = false
      }
    }
  })

  // Close menu on route change
  router.afterEach(() => {
    closeMobileMenu()
  })
})
</script>

<style scoped>
.text-override {
  color: var(--electric-indigo) !
}
.navbar {
  background: rgba(248, 240, 251, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--ash-gray);
  transition: all 0.3s ease;
}

.navbar-brand {
  font-size: 1.5rem;
  text-decoration: none !important;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.nav-link {
  color: var(--raisin-black) !important;
  font-weight: 500;
  padding: 0.75rem 1rem !important;
  border-radius: 8px;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #4338CA !important;
  background: rgba(67, 56, 202, 0.1);
  transform: translateY(-2px);
}

.nav-link.active {
  color: white !important;
  background: linear-gradient(135deg, #4338CA, #6366F1) !important;
  box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);
}

.nav-btn {
  padding: 0.5rem 1rem !important;
  border-radius: 8px !important;
  text-decoration: none !important;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 120px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-outline-primary.nav-btn {
  color: #4338CA !important;
  border-color: #4338CA !important;
  background: white !important;
}

.btn-outline-primary.nav-btn:hover {
  color: white !important;
  background: #4338CA !important;
  border-color: #4338CA !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);
}

.btn-primary.nav-btn {
  color: white !important;
  background: linear-gradient(135deg, #4338CA, #6366F1) !important;
  border-color: transparent !important;
}

.btn-primary.nav-btn:hover {
  background: linear-gradient(135deg, #3730A3, #6366F1) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 56, 202, 0.3);
  color: white !important;
}

.dropdown-toggle::after {
  margin-left: 0.5rem;
}

.dropdown-menu {
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(33, 26, 29, 0.15);
  background: white;
  backdrop-filter: blur(10px);
  display: none;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  color: var(--raisin-black);
  font-weight: 400;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 0.25rem 0.25rem;
  width: calc(100% - 0.5rem);
}

.dropdown-item:hover {
  color: #4338CA !important;
  background: linear-gradient(135deg, rgba(67, 56, 202, 0.1), rgba(99, 102, 241, 0.05)) !important;
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(67, 56, 202, 0.15);
}

.dropdown-item.text-danger {
  color: #dc2626 !important;
}

.dropdown-item.text-danger:hover {
  color: white !important;
  background: linear-gradient(135deg, #dc2626, #ef4444) !important;
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.dropdown-item:active {
  transform: translateX(1px);
}

.navbar-toggler {
  padding: 0.5rem;
  border-radius: 8px;
}


.fw-500 {
  font-weight: 500;
}

/* Add padding to body to account for fixed navbar */
:global(body) {
  padding-top: 76px;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--ash-gray);
  }

  .nav-link {
    margin: 0.25rem 0;
  }

  .nav-btn {
    margin: 0.25rem 0;
    display: block;
    width: 100%;
    text-align: center;
  }

  .btn-outline-primary.nav-btn {
    margin-bottom: 0.5rem;
  }

  .dropdown-menu {
    position: static !important;
    transform: none !important;
    box-shadow: none;
    border: 1px solid var(--ash-gray);
    margin-top: 0.5rem;
    width: 100%;
  }
}
</style>
