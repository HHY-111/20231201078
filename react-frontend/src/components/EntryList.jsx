import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useUserStore from '../stores/user'
import api from '../services/api'

function EntryList({ myEntries = false }) {
  const [entries, setEntries] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  const userStore = useUserStore()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [myEntries])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const endpoints = [
        api.get(myEntries ? '/api/my-entries/' : '/api/entries/'),
        api.get('/api/categories/'),
        api.get('/api/tags/')
      ]
      
      const [entriesResponse, categoriesResponse, tagsResponse] = await Promise.all(endpoints)
      
      setEntries(entriesResponse.data)
      setCategories(categoriesResponse.data)
      setTags(tagsResponse.data)
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || 
      entry.category?.id === parseInt(selectedCategory)
    
    const matchesTag = !selectedTag || 
      entry.tags.some(tag => tag.id === parseInt(selectedTag))
    
    return matchesSearch && matchesCategory && matchesTag
  })

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage)

  const visiblePages = () => {
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + 4)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const filterEntries = () => {
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">加载中...</span>
        </div>
        <p className="mt-2">加载中...</p>
      </div>
    )
  }

  return (
    <div className="entry-list">
      {/* 页面标题 */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6">
            {myEntries ? '我的词条' : '百科词条'}
          </h1>
          <p className="text-muted">
            {myEntries ? '管理您创建的所有词条' : '探索知识的海洋'}
          </p>
        </div>
      </div>

      <div className="row">
        {/* 筛选条件 */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">筛选条件</h6>
            </div>
            <div className="card-body">
              {/* 分类筛选 */}
              <div className="mb-3">
                <label className="form-label">分类</label>
                <select 
                  className="form-select" 
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    filterEntries()
                  }}
                >
                  <option value="">全部</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 标签筛选 */}
              <div className="mb-3">
                <label className="form-label">标签</label>
                <select 
                  className="form-select" 
                  value={selectedTag}
                  onChange={(e) => {
                    setSelectedTag(e.target.value)
                    filterEntries()
                  }}
                >
                  <option value="">全部</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">词条统计</h6>
              <div className="row">
                <div className="col-6">
                  <h4 className="text-primary">{filteredEntries.length}</h4>
                  <small className="text-muted">总词条</small>
                </div>
                <div className="col-6">
                  <h4 className="text-success">{categories.length}</h4>
                  <small className="text-muted">分类数</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 词条列表 */}
        <div className="col-md-9">
          {/* 搜索提示 */}
          {searchQuery && (
            <div className="alert alert-info">
              搜索 "{searchQuery}" 的结果 ({filteredEntries.length} 条)
            </div>
          )}
          
          {paginatedEntries.length > 0 ? (
            <>
              <div className="row">
                {paginatedEntries.map(entry => (
                  <div key={entry.id} className="col-lg-6 mb-4">
                    <div className="card entry-card h-100">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link to={`/entry/${entry.id}`} className="text-decoration-none">
                            {entry.title}
                          </Link>
                        </h5>
                        
                        {entry.summary && (
                          <p className="card-text text-muted">
                            {entry.summary}
                          </p>
                        )}
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {entry.category && (
                              <span className="badge bg-primary me-1">
                                {entry.category.name}
                              </span>
                            )}
                            {entry.tags.map(tag => (
                              <span key={tag.id} className="badge bg-success me-1">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          
                          <small className="text-muted">
                            <i className="fas fa-eye"></i> {entry.view_count}
                            <i className="fas fa-heart ms-2"></i> {entry.like_count}
                          </small>
                        </div>
                      </div>
                      
                      <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="fas fa-user"></i> {entry.author.username}
                          </small>
                          <small className="text-muted">
                            <i className="fas fa-clock"></i> {formatDate(entry.created_at)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 分页 */}
              {totalPages > 1 && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => changePage(currentPage - 1)}
                      >
                        上一页
                      </button>
                    </li>
                    
                    {visiblePages().map(page => (
                      <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => changePage(page)}>
                          {page}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => changePage(currentPage + 1)}
                      >
                        下一页
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">暂无词条</h4>
              <p className="text-muted">
                {myEntries ? '您还没有创建任何词条' : '还没有词条内容，快来创建第一个词条吧！'}
              </p>
              {userStore.isAuthenticated() && !myEntries && (
                <Link to="/create" className="btn btn-primary">
                  <i className="fas fa-plus"></i> 创建词条
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EntryList