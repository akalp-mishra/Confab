import React, {useState}from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authSlice.js'
import {Button, Input} from './index.js'
import {useDispatch} from 'react-redux'
import authService from '../appwrite/auth.js'
import {useForm} from 'react-hook-form'
import blogpost from '../appwrite/post.js'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {register, handleSubmit} = useForm()
  const [error, setError] = useState('')

  const login = async(data) => {
    setError('')
    try{
      const session = await authService.login(data)
      if(session){
        let userData = await authService.getCurrentUser()
        const pfpId = await blogpost.findUser(userData.$id)
        const userdata = {
          ...userData,
          pfpId
        }
        if(userdata){
          dispatch(authLogin(userdata))
          navigate('/')
        }
      }
    }
    catch(err){
      console.log(err.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="mb-4">
            <Input label="Email:" placeholder="Enter your Email" type="email" {...register("email", {
              required:true, 
              validate:{
                matchPattern : (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address"
              }
              })}/>
              <Input label="Password:" placeholder="Enter your Password" type="password" {...register("password", {
                required:true
              })}/>
              <Button type="submit" className="w-full py-2 px-4 my-4 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" bg="blue-500">
                Login
              </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
