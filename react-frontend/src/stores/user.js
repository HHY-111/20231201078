import { create } from 'zustand'
import api from '../services/api'

const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  
  isAuthenticated: () => {
    const { token, user } = get()
    return !!token && !!user
  },
  
  setUser: (userData) => set({ user: userData }),
  
  setToken: (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    set({ token: newToken })
  },
  
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login/', credentials)
      const { user: userData, token: userToken } = response.data
      
      get().setToken(userToken)
      get().setUser(userData)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || '登录失败' 
      }
    }
  },
  
  logout: async () => {
    try {
      await api.post('/api/auth/logout/')
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      get().setToken(null)
      get().setUser(null)
    }
  },
  
  checkAuth: async () => {
    const { token } = get()
    if (!token) return false
    
    try {
      const response = await api.get('/api/auth/user/')
      get().setUser(response.data)
      return true
    } catch (error) {
      get().setToken(null)
      get().setUser(null)
      return false
    }
  }
}))

export default useUserStore