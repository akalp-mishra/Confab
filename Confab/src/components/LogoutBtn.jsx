import React from 'react'
import logout from '../store/authSlice.js'
import AuthServiceObj from '../appwrite/auth'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = () => {
      AuthServiceObj.logout().then(()=>{
        dispatch(logout())
      })
      navigate('/')
    }
  return (
    <button onClick={logoutHandler} className='bg-red-400 px-6 py-2 duration-200 hover:bg-red-500 rounded-full'>Logout</button>
  )
}

export default LogoutBtn;
