import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useUserStore from '../stores/user'
import api from '../services/api'

function EntryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft'
  })
  const [categories, setCategories] = useState([])
  const [allTags, setAllTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const userStore = useUserStore()
  const isEdit = !!id

  useEffect(() => {
    if (!userStore.isAuthenticated()) {
      navigate('/login')
      return
    }
    
    fetchFormData()
  }, [id])

  const fetchFormData = async () => {
    try {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        api.get('/api/categories/'),
        api.get('/api/tags/')
      ])
      
      setCategories(categoriesResponse.data)
      setAllTags(tagsResponse.data)
      
      if (isEdit) {
        const entryResponse = await api.get(`/api/entries/${id}/`)
        const entry = entryResponse.data
        
        setFormData({
          title: entry.title,
          summary: entry.summary || '',
          content: entry.content,
          category: entry.category?.id || '',
          tags: entry.tags.map(tag => tag.id),
          status: entry.status
        })
        
        setSelectedTags(entry.tags.map(tag => tag.id))
      }
    } catch (error) {
      setError('加载数据失败')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
      
      setFormData({
        ...formData,
        tags: newTags
      })
      
      return newTags
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const submitData = {
        ...formData,
        tags: formData.tags
      }
      
      if (isEdit) {
        await api.put(`/api/entries/${id}/`, submitData)
      } else {
        await api.post('/api/entries/', submitData)
      }
      
      navigate('/my-entries')
    } catch (error) {
      setError(error.response?.data?.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  const autoResizeTextarea = (e) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  return (
    <div className="entry-form">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                {isEdit ? '编辑词条' : '创建词条'}
              </h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* 标题 */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    标题 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength="200"
                  />
                </div>
                
                {/* 摘要 */}
                <div className="mb-3">
                  <label htmlFor="summary" className="form-label">
                    摘要
                  </label>
                  <textarea
                    className="form-control"
                    id="summary"
                    name="summary"
                    rows="3"
                    value={formData.summary}
                    onChange={handleChange}
                    maxLength="500"
                    placeholder="请输入词条摘要（可选）"
                  />
                </div>
                
                {/* 内容 */}
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    内容 <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="15"
                    value={formData.content}
                    onChange={(e) => {
                      handleChange(e)
                      autoResizeTextarea(e)
                    }}
                    required
                    placeholder="请输入词条详细内容..."
                  />
                </div>
                
                {/* 分类 */}
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分类 <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">请选择分类</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 标签 */}
                <div className="mb-3">
                  <label className="form-label">
                    标签
                  </label>
                  <div className="tag-selector">
                    {allTags.map(tag => (
                      <div key={tag.id} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                        />
                        <label 
                          className="form-check-label" 
                          htmlFor={`tag-${tag.id}`}
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 状态 */}
                <div className="mb-4">
                  <label className="form-label">状态</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        id="status-draft"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="status-draft">
                        草稿
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        id="status-published"
                        value="published"
                        checked={formData.status === 'published'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="status-published">
                        发布
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    取消
                  </button>
                  
                  <div className="btn-group">
                    <button 
                      type="submit" 
                      name="status"
                      value="draft"
                      className="btn btn-outline-primary"
                      disabled={loading}
                      onClick={(e) => {
                        setFormData({...formData, status: 'draft'})
                      }}
                    >
                      {loading ? '保存中...' : '保存草稿'}
                    </button>
                    
                    <button 
                      type="submit" 
                      name="status"
                      value="published"
                      className="btn btn-primary"
                      disabled={loading}
                      onClick={(e) => {
                        setFormData({...formData, status: 'published'})
                      }}
                    >
                      {loading ? '发布中...' : '立即发布'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntryForm