import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email)
  const userDisplayName = computed(() => {
    if (!user.value) return null

    // Try to get display name from user metadata
    const displayName = user.value?.user_metadata?.display_name || user.value?.user_metadata?.full_name

    if (displayName) return displayName

    // Fallback to email username
    if (user.value?.email) {
      const emailName = user.value.email.split('@')[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }

    return 'Usuario'
  })

  // Actions
  const clearError = () => {
    error.value = null
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const signUp = async (email, password, displayName) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            full_name: displayName
          }
        }
      })

      if (signUpError) throw signUpError

      // Don't set user here - wait for email confirmation
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      setUser(data.user)
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      setUser(null)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email) => {
    try {
      loading.value = true
      error.value = null

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) throw resetError

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      loading.value = true
      error.value = null

      // Simply update the password for the current authenticated user
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateDisplayName = async (displayName) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          full_name: displayName
        }
      })

      if (updateError) throw updateError

      // Update local user state
      setUser(data.user)
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      return currentUser
    } catch (err) {
      console.error('Error getting current user:', err)
      setUser(null)
      return null
    }
  }

  const setRecoverySession = async (accessToken, refreshToken) => {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (error) throw error

      setUser(data.user)
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const verifyRecoveryToken = async (token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery'
      })

      if (error) throw error

      setUser(data.user)
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Initialize auth state listener
  const initializeAuth = () => {
    // Handle auth state from URL on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)

      // Handle specific auth events
      if (event === 'PASSWORD_RECOVERY') {
        // Password recovery flow is being handled
        console.log('Password recovery event detected')
      }

      // Clean URL hash/query params after successful auth state change
      if (session && (window.location.hash.includes('access_token') || window.location.search.includes('access_token'))) {
        // Clean URL without refreshing the page
        const url = new URL(window.location)
        url.hash = ''
        url.search = ''
        window.history.replaceState({}, document.title, url.toString())
      }
    })
  }

  return {
    // State
    user,
    loading,
    error,

    // Computed
    isAuthenticated,
    userEmail,
    userDisplayName,

    // Actions
    clearError,
    setError,
    setUser,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateDisplayName,
    getCurrentUser,
    setRecoverySession,
    verifyRecoveryToken,
    initializeAuth,
  }
})
