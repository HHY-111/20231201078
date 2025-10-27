<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="fas fa-book"></i> 百科词条
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="fas fa-home"></i> 首页
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/categories">
                <i class="fas fa-folder"></i> 分类
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tags">
                <i class="fas fa-tags"></i> 标签
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.isAuthenticated">
              <router-link class="nav-link" to="/create">
                <i class="fas fa-plus"></i> 创建词条
              </router-link>
            </li>
          </ul>
          
          <!-- 搜索框 -->
          <div class="d-flex me-3">
            <input 
              class="form-control me-2" 
              type="search" 
              placeholder="搜索词条..."
              v-model="searchQuery"
              @keyup.enter="performSearch"
            >
            <button class="btn btn-outline-light" @click="performSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>
          
          <!-- 用户认证 -->
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!userStore.isAuthenticated">
              <router-link class="nav-link" to="/login">
                <i class="fas fa-sign-in-alt"></i> 登录
              </router-link>
            </li>
            <li class="nav-item dropdown" v-else>
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user"></i> {{ userStore.user?.username }}
              </a>
              <ul class="dropdown-menu">
                <li><router-link class="dropdown-item" to="/my-entries">我的词条</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click="logout">退出登录</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="container mt-4">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="bg-light mt-5 py-4">
      <div class="container text-center">
        <p class="text-muted mb-0">
          &copy; 2024 百科词条管理系统. 基于 Django + Vue 构建
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const logout = async () => {
  await userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}

.search-form {
  max-width: 400px;
}
</style>