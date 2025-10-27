<template>
  <div class="entry-list">
    <!-- 筛选条件 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">筛选条件</h6>
          </div>
          <div class="card-body">
            <!-- 分类筛选 -->
            <div class="mb-3">
              <label class="form-label">分类</label>
              <select v-model="selectedCategory" class="form-select" @change="filterEntries">
                <option value="">全部</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- 标签筛选 -->
            <div class="mb-3">
              <label class="form-label">标签</label>
              <select v-model="selectedTag" class="form-select" @change="filterEntries">
                <option value="">全部</option>
                <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                  {{ tag.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 词条列表 -->
      <div class="col-md-9">
        <!-- 搜索提示 -->
        <div v-if="searchQuery" class="alert alert-info">
          搜索 "{{ searchQuery }}" 的结果 ({{ filteredEntries.length }} 条)
        </div>
        
        <!-- 词条卡片 -->
        <div v-if="filteredEntries.length > 0" class="row">
          <div v-for="entry in paginatedEntries" :key="entry.id" class="col-lg-6 mb-4">
            <div class="card entry-card h-100">
              <div class="card-body">
                <h5 class="card-title">
                  <router-link :to="`/entry/${entry.id}`" class="text-decoration-none">
                    {{ entry.title }}
                  </router-link>
                </h5>
                
                <p v-if="entry.summary" class="card-text text-muted">
                  {{ entry.summary }}
                </p>
                
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span v-if="entry.category" class="badge bg-primary me-1">
                      {{ entry.category.name }}
                    </span>
                    <span v-for="tag in entry.tags" :key="tag.id" class="badge bg-success me-1">
                      {{ tag.name }}
                    </span>
                  </div>
                  
                  <small class="text-muted">
                    <i class="fas fa-eye"></i> {{ entry.view_count }}
                    <i class="fas fa-heart ms-2"></i> {{ entry.like_count }}
                  </small>
                </div>
              </div>
              
              <div class="card-footer">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-user"></i> {{ entry.author.username }}
                  </small>
                  <small class="text-muted">
                    <i class="fas fa-clock"></i> {{ formatDate(entry.created_at) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="text-center py-5">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">暂无词条</h4>
          <p class="text-muted">还没有词条内容，快来创建第一个词条吧！</p>
          <router-link v-if="userStore.isAuthenticated" to="/create" class="btn btn-primary">
            <i class="fas fa-plus"></i> 创建词条
          </router-link>
        </div>
        
        <!-- 分页 -->
        <nav v-if="totalPages > 1" aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">上一页</button>
            </li>
            
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">下一页</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'

const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const entries = ref([])
const categories = ref([])
const tags = ref([])
const selectedCategory = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// 从路由获取搜索查询
const searchQuery = computed(() => route.query.q || '')

// 计算属性
const filteredEntries = computed(() => {
  return entries.value.filter(entry => {
    const matchesSearch = !searchQuery.value || 
      entry.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = !selectedCategory.value || 
      entry.category?.id === parseInt(selectedCategory.value)
    
    const matchesTag = !selectedTag.value || 
      entry.tags.some(tag => tag.id === parseInt(selectedTag.value))
    
    return matchesSearch && matchesCategory && matchesTag
  })
})

const totalPages = computed(() => 
  Math.ceil(filteredEntries.value.length / itemsPerPage)
)

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEntries.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 方法
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const filterEntries = () => {
  currentPage.value = 1
}

const fetchData = async () => {
  try {
    const [entriesResponse, categoriesResponse, tagsResponse] = await Promise.all([
      api.get('/api/entries/'),
      api.get('/api/categories/'),
      api.get('/api/tags/')
    ])
    
    entries.value = entriesResponse.data
    categories.value = categoriesResponse.data
    tags.value = tagsResponse.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  fetchData()
})

// 监听路由变化
import { watch } from 'vue'
watch(() => route.query.q, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.entry-card {
  transition: transform 0.2s;
}

.entry-card:hover {
  transform: translateY(-2px);
}

.pagination {
  margin-top: 2rem;
}
</style>