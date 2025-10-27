import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import EntryList from '../components/EntryList'
import EntryDetail from '../components/EntryDetail'
import EntryForm from '../components/EntryForm'
import Login from '../components/Login'
import Register from '../components/Register'
import CategoryList from '../components/CategoryList'
import TagList from '../components/TagList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <EntryList />
      },
      {
        path: 'entry/:id',
        element: <EntryDetail />
      },
      {
        path: 'create',
        element: <EntryForm />
      },
      {
        path: 'edit/:id',
        element: <EntryForm />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'categories',
        element: <CategoryList />
      },
      {
        path: 'tags',
        element: <TagList />
      },
      {
        path: 'my-entries',
        element: <EntryList myEntries={true} />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
])

export default router