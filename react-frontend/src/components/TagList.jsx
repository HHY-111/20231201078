import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function TagList() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await api.get('/api/tags/')
      setTags(response.data)
    } catch (error) {
      console.error('获取标签失败:', error)
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
    <div className="tag-list">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6">标签列表</h1>
          <p className="text-muted">浏览所有标签</p>
        </div>
      </div>

      <div className="row">
        {tags.map(tag => (
          <div key={tag.id} className="col-md-4 col-lg-3 mb-3">
            <Link 
              to={`/?tag=${tag.id}`}
              className="btn btn-outline-success btn-sm w-100"
            >
              {tag.name} 
              <span className="badge bg-secondary ms-1">
                {tag.entry_count || 0}
              </span>
            </Link>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-tags fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">暂无标签</h4>
          <p className="text-muted">还没有创建任何标签</p>
        </div>
      )}
    </div>
  )
}

export default TagList