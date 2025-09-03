import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const authStore = useAuthStore()

  // Form validation helpers
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const validateForm = (email, password) => {
    const errors = []

    if (!email) {
      errors.push('El email es requerido')
    } else if (!validateEmail(email)) {
      errors.push('El email no tiene un formato válido')
    }

    if (!password) {
      errors.push('La contraseña es requerida')
    } else if (!validatePassword(password)) {
      errors.push('La contraseña debe tener al menos 6 caracteres')
    }

    return errors
  }

  const validatePasswordConfirmation = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    return null
  }

  // Form submission helpers
  const handleSignUp = async (email, password, confirmPassword, displayName) => {
    const errors = validateForm(email, password)
    const confirmError = validatePasswordConfirmation(password, confirmPassword)

    if (confirmError) {
      errors.push(confirmError)
    }

    if (!displayName || !displayName.trim()) {
      errors.push('El nombre de usuario es requerido')
    } else if (displayName.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    } else if (displayName.trim().length > 50) {
      errors.push('El nombre no puede tener más de 50 caracteres')
    }

    if (errors.length > 0) {
      return { success: false, errors }
    }

    const result = await authStore.signUp(email, password, displayName.trim())
    return result
  }

  const handleSignIn = async (email, password) => {
    const errors = validateForm(email, password)

    if (errors.length > 0) {
      return { success: false, errors }
    }

    const result = await authStore.signIn(email, password)
    return result
  }

  const handleSignOut = async () => {
    return await authStore.signOut()
  }

  const handleResetPassword = async (email) => {
    if (!email) {
      return { success: false, errors: ['El email es requerido'] }
    }

    if (!validateEmail(email)) {
      return { success: false, errors: ['El email no tiene un formato válido'] }
    }

    const result = await authStore.resetPassword(email)
    return result
  }

  const handleUpdateDisplayName = async (displayName) => {
    if (!displayName || !displayName.trim()) {
      return { success: false, errors: ['El nombre de usuario es requerido'] }
    }

    if (displayName.trim().length < 2) {
      return { success: false, errors: ['El nombre debe tener al menos 2 caracteres'] }
    }

    if (displayName.trim().length > 50) {
      return { success: false, errors: ['El nombre no puede tener más de 50 caracteres'] }
    }

    const result = await authStore.updateDisplayName(displayName.trim())
    return result
  }

  const handleUpdatePassword = async (password, confirmPassword) => {
    const errors = validateForm('temp@email.com', password) // Use temp email for validation
    const confirmError = validatePasswordConfirmation(password, confirmPassword)

    if (confirmError) {
      errors.push(confirmError)
    }

    // Remove email error since we only want password validation
    const passwordErrors = errors.filter(error => !error.includes('email'))

    if (passwordErrors.length > 0) {
      return { success: false, errors: passwordErrors }
    }

    const result = await authStore.updatePassword(password)
    return result
  }

  return {
    // Store access
    authStore,

    // Validation helpers
    validateEmail,
    validatePassword,
    validateForm,
    validatePasswordConfirmation,

    // Action helpers
    handleSignUp,
    handleSignIn,
    handleSignOut,
    handleResetPassword,
    handleUpdateDisplayName,
    handleUpdatePassword,
  }
}
