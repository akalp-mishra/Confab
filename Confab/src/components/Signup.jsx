import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice.js'
import {Button, Input} from './index.js'
import {useDispatch} from 'react-redux'
import authService from '../appwrite/auth.js'
import fileupload from '../appwrite/fileUpload.js'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const createAccount = async(data) => {
        try{
           const userData = await authService.createAccount(data)
           if(userData) console.log("Account created Successfully")
           const fileIdPromise = data.pfp[0] ? await fileupload.uploadFile(data.pfp[0]): null
           const fileId =  await fileIdPromise
           const sessionPromise = await authService.login({email:data.email,password:data.password})
           const session = await sessionPromise

           if(session){
                dispatch(login(userData))   
            }
            if(fileId && session){
                const dbUserPromise = await authService.addAccount({
                    ...userData,
                    pfp : fileId
                })
                const dbResponse = await dbUserPromise
                console.log(dbResponse) 
                navigate('/')
            }
        }
        catch(err){
            console.log(err.message)
        }
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100">
      <div className='w-full max-w-md p-8 bg-white rounded shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Signup</h2>
        <form onSubmit={handleSubmit(createAccount)} className="mt-8">
            <div className="mb-4">
                <Input label="Full Name " placeholder="Enter your full name" {...register("name",{required:true})}/>
                <br />
                <Input label="Email " placeholder="Enter your email" type="email" {...register("email",{required:true,validate:(value)=>/\S+@\S+\.\S+/.test(value)||"Email is not valid"})}/>
                <br />
                <Input label="Password " placeholder="Enter your Password" type="password" {...register("password", {required:true})}/>
                <Input label="Profile Picture" type="file" {...register("pfp",{required:false})}></Input>
                <br />
                <Button type="submit" className="w-full py-2 px-4 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Signup
                </Button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Signup

