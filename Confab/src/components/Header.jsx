import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Container, LogoutBtn} from './index.js'
import { useSelector } from 'react-redux'

const Header = () => {
  const authStatus = useSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate();
  const navItems = [
    {name: "Home", slug: "/", active : true},
    {name: "login", slug: "/login", active : !authStatus},
    {name: "signup", slug: "/signup", active : !authStatus},
    {name: "create", slug: "/add-posts", active : authStatus},
  ]

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto">
        <ul className="flex ml-auto">
          {navItems.map((item) =>
            item.active && (
              <li key = {item.name}> <button onClick={() => navigate(item.slug)} className="hover:text-grey-300 px-3 py-2 rounded-xl text-sm font-medium">
                {item.name}
              </button></li>
            )
          )}
          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Header
