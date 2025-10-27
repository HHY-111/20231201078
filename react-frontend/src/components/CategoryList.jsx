import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories/')
      setCategories(response.data)
    } catch (error) {
      console.error('获取分类失败:', error)
    } finally {
      setLoading(false)
    }
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
    <div className="category-list">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6">分类列表</h1>
          <p className="text-muted">浏览所有分类</p>
        </div>
      </div>

      <div className="row">
        {categories.map(category => (
          <div key={category.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <Link 
                    to={`/?category=${category.id}`}
                    className="text-decoration-none"
                  >
                    {category.name}
                  </Link>
                </h5>
                
                {category.description && (
                  <p className="card-text text-muted">
                    {category.description}
                  </p>
                )}
                
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {category.entry_count || 0} 个词条
                  </small>
                  <Link 
                    to={`/?category=${category.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    查看词条
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">暂无分类</h4>
          <p className="text-muted">还没有创建任何分类</p>
        </div>
      )}
    </div>
  )
}

export default CategoryList