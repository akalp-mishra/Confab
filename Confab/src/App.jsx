import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import AuthServiceObj from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await AuthServiceObj.getCurrentUser()
        if (userData) {
          dispatch(login(userData))
        } else {
          dispatch(logout())
        }
      } catch (error) {
        console.log("No existing session:", error.message)
        dispatch(logout())
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
          <Home />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App