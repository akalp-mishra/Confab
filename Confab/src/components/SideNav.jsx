import { useState } from 'react'
import { useSelector } from 'react-redux'
import fileupload from '../appwrite/fileUpload'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'

function SideNav() {
  const navigate = useNavigate()

  const authStatus = useSelector((state)=> state.auth.isAuthenticated)
  const userdata = useSelector((state)=> state.auth.userdata)
  let pfpId
  if(userdata && userdata.pfpId.rows[0]!= undefined){
    pfpId = userdata.pfpId.rows[0].profileImage
  }
  if(authStatus==false){
    return (
      <div className='h-110 sticky top-15 bottom-20 w-1/4 mr-4 ml-3 bg-white border-black rounded-lg shadow-lg mt-2  px-5 py-5'>
          <div className='text-3xl'>
            <button className='mr-2 hover:text-blue-600' onClick={()=>navigate('/signup')}>Register</button>
            <p>or</p>
            <button className='hover:text-blue-600' onClick={()=>navigate('/login')}>Login</button>
          </div>
        <hr className='mt-5 mb-5'/>
      </div>
    )
  }
  return (
    <div className='h-110 sticky top-27.5 bottom-20 w-1/4 mr-4 ml-3 bg-white border-black rounded-lg shadow-lg mt-2  px-5 py-5'>
      <div className='flex'>
        {pfpId?<img className='h-15 w-15 rounded-full mr-2' src={fileupload.getFileView(pfpId)} alt="No Image" />: <Skeleton circle height={50} width={50}/>}
        <div>
          {userdata?<p className='text-4xl'>{userdata.name}</p> : <Skeleton containerClassName='flex-1' width={140} height={20}/>}
          {userdata?<p className='font-light text-sm'>{userdata.email}</p>: <Skeleton containerClassName='flex-1' width={100} height={15}/>}
        </div>
      </div>
      <hr className='mt-5 mb-5 border-gray-300'/>
    </div>
  )
}

export default SideNav
