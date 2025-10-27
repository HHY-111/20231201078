import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import useUserStore from './stores/user'
import EntryList from './components/EntryList'
import EntryDetail from './components/EntryDetail'
import EntryForm from './components/EntryForm'
import Login from './components/Login'
import Register from './components/Register'
import CategoryList from './components/CategoryList'
import TagList from './components/TagList'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const userStore = useUserStore()
  const navigate = useNavigate()

  useEffect(() => {
    // 检查用户认证状态
    userStore.checkAuth()
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    await userStore.logout()
    navigate('/')
  }

  return (
    <div className="App">
      {/* 导航栏 */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-book"></i> 百科词条
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="fas fa-home"></i> 首页
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/categories">
                  <i className="fas fa-folder"></i> 分类
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tags">
                  <i className="fas fa-tags"></i> 标签
                </Link>
              </li>
              {userStore.isAuthenticated() && (
                <li className="nav-item">
                  <Link className="nav-link" to="/create">
                    <i className="fas fa-plus"></i> 创建词条
                  </Link>
                </li>
              )}
            </ul>
            
            {/* 搜索框 */}
            <div className="d-flex me-3">
              <input 
                className="form-control me-2" 
                type="search" 
                placeholder="搜索词条..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-outline-light" onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            {/* 用户认证 */}
            <ul className="navbar-nav">
              {!userStore.isAuthenticated ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt"></i> 登录
                  </Link>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="fas fa-user"></i> {userStore.user?.username}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/my-entries">我的词条</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>退出登录</a></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<EntryList />} />
          <Route path="/entry/:id" element={<EntryDetail />} />
          <Route path="/create" element={<EntryForm />} />
          <Route path="/edit/:id" element={<EntryForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/tags" element={<TagList />} />
          <Route path="/my-entries" element={<EntryList myEntries={true} />} />
        </Routes>
      </main>

      {/* 页脚 */}
      <footer className="bg-light mt-5 py-4">
        <div className="container text-center">
          <p className="text-muted mb-0">
            &copy; 2024 百科词条管理系统. 基于 Django + React 构建
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App