import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authSlice.js'
import {Button, Input} from './index.js'
import {useDispatch} from 'react-redux'
import authService from '../appwrite/auth.js'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState('')

    const createAccount = async(data) => {
        setError('')
        try{
           const userData = await authService.createAccount(data)
           console.log("Account created Successfully")
           if(userData){
            const userData = await authService.getCurrentUser()
            if(userData){
                dispatch(authLogin(userData))   
            }
            navigate('/')
           }
        }
        catch(err){
            setError(err.message)
        }
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100">
      <div className='w-full max-w-md p-8 bg-white rounded shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Signup</h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form onSubmit={handleSubmit(createAccount)} className="mt-8">
            <div className="mb-4">
                <Input label="Full Name: " placeholder="Enter your full name" {...register("name",{required:true})}/>
                <Input label="Email: " placeholder="Enter your email" type="email" {...register("email",{required:true,validate:(value)=>/\S+@\S+\.\S+/.test(value)||"Email is not valid"})}/>
                <Input label="Password: " placeholder="Enter your Password" type="password" {...register("password", {required:true})}/>
                <Button type="submit" className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Signup
                </Button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Signup

