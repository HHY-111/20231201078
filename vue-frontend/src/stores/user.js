import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login/', credentials)
      const { user: userData, token: userToken } = response.data
      
      setToken(userToken)
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || '登录失败' 
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout/')
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      const response = await api.get('/api/auth/user/')
      setUser(response.data)
      return true
    } catch (error) {
      setToken(null)
      setUser(null)
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    login,
    logout,
    checkAuth
  }
})