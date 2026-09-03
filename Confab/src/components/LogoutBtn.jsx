import React from 'react'
import logout from '../store/authslice.js'
import AuthServiceObj from '../appwrite/auth'
import { useDispatch } from 'react-redux';

function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        AuthServiceObj.logout().then(()=>{
            dispatch(logout())
        })
    }
  return (
    <button onClick={logoutHandler} className='bg-red-500 inline-block px-6 py-2 duration-200 hover:bg-gray-500 rounded-full'>Logout</button>
  )
}

export default LogoutBtn;
