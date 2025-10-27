import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import useUserStore from '../stores/user'
import api from '../services/api'

function EntryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [relatedEntries, setRelatedEntries] = useState([])
  
  const userStore = useUserStore()

  useEffect(() => {
    fetchEntry()
  }, [id])

  const fetchEntry = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/entries/${id}/`)
      setEntry(response.data)
      setComments(response.data.comments || [])
      
      // 获取相关词条
      if (response.data.category) {
        const relatedResponse = await api.get(`/api/entries/?category=${response.data.category.id}&limit=5`)
        setRelatedEntries(relatedResponse.data.filter(e => e.id !== parseInt(id)))
      }
    } catch (error) {
      setError('词条不存在或加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!userStore.isAuthenticated()) {
      navigate('/login')
      return
    }
    
    try {
      await api.post(`/api/entries/${id}/like/`)
      setEntry(prev => ({
        ...prev,
        like_count: prev.like_count + 1,
        user_liked: true
      }))
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!userStore.isAuthenticated()) {
      navigate('/login')
      return
    }
    
    if (!newComment.trim()) return
    
    try {
      const response = await api.post(`/api/entries/${id}/comments/`, {
        content: newComment
      })
      
      setComments(prev => [response.data, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('评论失败:', error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这个词条吗？此操作不可撤销。')) {
      return
    }
    
    try {
      await api.delete(`/api/entries/${id}/`)
      navigate('/')
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN')
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

  if (error) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h4 className="text-warning">{error}</h4>
        <Link to="/" className="btn btn-primary">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="entry-detail">
      <div className="row">
        {/* 主要内容 */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {/* 标题和操作按钮 */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h1 className="display-6">{entry.title}</h1>
                  <div className="d-flex align-items-center text-muted">
                    <span className="badge bg-primary me-2">
                      {entry.category?.name}
                    </span>
                    <small>
                      <i className="fas fa-user"></i> {entry.author.username}
                    </small>
                    <small className="ms-3">
                      <i className="fas fa-clock"></i> {formatDate(entry.created_at)}
                    </small>
                  </div>
                </div>
                
                {userStore.isAuthenticated() && (
                  <div className="btn-group">
                    {userStore.user?.id === entry.author.id && (
                      <>
                        <Link 
                          to={`/edit/${entry.id}`} 
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="fas fa-edit"></i> 编辑
                        </Link>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={handleDelete}
                        >
                          <i className="fas fa-trash"></i> 删除
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* 标签 */}
              {entry.tags.length > 0 && (
                <div className="mb-4">
                  {entry.tags.map(tag => (
                    <span key={tag.id} className="badge bg-success me-1">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              {/* 摘要 */}
              {entry.summary && (
                <div className="alert alert-info">
                  <strong>摘要：</strong>{entry.summary}
                </div>
              )}
              
              {/* 内容 */}
              <div className="entry-content">
                <div 
                  dangerouslySetInnerHTML={{ __html: entry.content }}
                  className="entry-content-html"
                />
              </div>
              
              {/* 统计信息 */}
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <div className="d-flex gap-3">
                  <span className="text-muted">
                    <i className="fas fa-eye"></i> {entry.view_count} 次浏览
                  </span>
                  <button 
                    className={`btn btn-sm ${entry.user_liked ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleLike}
                    disabled={!userStore.isAuthenticated()}
                  >
                    <i className="fas fa-heart"></i> {entry.like_count} 点赞
                  </button>
                </div>
                
                <div className="dropdown">
                  <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="fas fa-share"></i> 分享
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">复制链接</a></li>
                    <li><a className="dropdown-item" href="#">分享到微信</a></li>
                    <li><a className="dropdown-item" href="#">分享到微博</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* 评论区域 */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-comments"></i> 评论 ({comments.length})
              </h5>
            </div>
            
            {/* 评论表单 */}
            {userStore.isAuthenticated() ? (
              <div className="card-body">
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="写下您的评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    发表评论
                  </button>
                </form>
              </div>
            ) : (
              <div className="card-body text-center">
                <p className="text-muted">请<Link to="/login">登录</Link>后发表评论</p>
              </div>
            )}
            
            {/* 评论列表 */}
            {comments.length > 0 ? (
              <div className="list-group list-group-flush">
                {comments.map(comment => (
                  <div key={comment.id} className="list-group-item">
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{comment.author.username}</strong>
                          <small className="text-muted">{formatDate(comment.created_at)}</small>
                        </div>
                        <p className="mb-0 mt-2">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body text-center">
                <p className="text-muted">暂无评论</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 侧边栏 */}
        <div className="col-lg-4">
          {/* 作者信息 */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">作者信息</h6>
            </div>
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-user-circle fa-3x text-muted"></i>
              </div>
              <h5>{entry.author.username}</h5>
              <p className="text-muted">
                创建于 {formatDate(entry.author.date_joined)}
              </p>
              <Link 
                to={`/my-entries?author=${entry.author.id}`}
                className="btn btn-outline-primary btn-sm"
              >
                查看该作者的所有词条
              </Link>
            </div>
          </div>
          
          {/* 相关词条 */}
          {relatedEntries.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">相关词条</h6>
              </div>
              <div className="list-group list-group-flush">
                {relatedEntries.map(relatedEntry => (
                  <Link 
                    key={relatedEntry.id}
                    to={`/entry/${relatedEntry.id}`}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{relatedEntry.title}</h6>
                    </div>
                    <small className="text-muted">
                      {relatedEntry.category?.name}
                    </small>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EntryDetail