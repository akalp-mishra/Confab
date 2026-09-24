import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Container, LogoutBtn} from './index.js'
import { useSelector } from 'react-redux'

const Header = () => {
  const authStatus = useSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate();
  const navItems = [
    {name: "Home", slug: "/", active : true},
    {name: "Login", slug: "/login", active : !authStatus},
    {name: "Signup", slug: "/signup", active : !authStatus},
    {name: "Create", slug: "/add-posts", active : authStatus},
  ]

  return (
    <header className="bg-white text-black py-4 sticky top-0 z-50 w-full border-b border-black">
      <div className="container mx-auto">
        <ul className="flex ml-auto">
          <li className='size-l mr-5 ml-5'> &#9746;</li>
          {navItems.map((item) =>
            item.active && (
              <li key = {item.name}> <button onClick={() => navigate(item.slug)} className="hover:bg-gray-300 px-3 py-2 mr-3 rounded-xl text-sm hover:text-blue-600 font-medium">
                {item.name}
              </button></li>
            )
          )}
          {authStatus && (
            <li className='fixed right-5'>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Header
