import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import AuthServiceObj from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import Home from './pages/Home'
import blogpost from './appwrite/post'
import { useNavigate } from 'react-router-dom'
import { SkeletonTheme } from 'react-loading-skeleton'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await AuthServiceObj.getCurrentUser()
        const pfpId = await blogpost.findUser(userData.$id)
        const userdata = {
          ...userData,
          pfpId
        }
        if (userdata) {
          dispatch(login(userdata))
          navigate('/')
        }
        else {
          dispatch(logout())
        }
      }
      catch (error) {
        console.log("No existing session:", error.message)
        dispatch(logout())
      }
    }
    
    checkSession()
  }, [dispatch])
  
  return(
    <SkeletonTheme baseColor='#e0e0e0' highlightColor='#f5f5f5'>
      <div className='min-h-screen flex flex-wrap content-between bg-gray-100'>
        <div className='w-full block'>
          <Header />
          <main>
            <Home />
          </main>
          <Footer />
        </div>
      </div>
    </SkeletonTheme>
  )
}

export default App