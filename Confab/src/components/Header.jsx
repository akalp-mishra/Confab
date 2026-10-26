import React from 'react'
import {useNavigate} from 'react-router-dom'
import {LogoutBtn} from './index.js'
import { useSelector } from 'react-redux'
import { House, SquarePen } from 'lucide-react'

const Header = () => {
  const authStatus = useSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate();
  const navItems = [
    {name: "Home", slug: "/", active : true, Icon: House},
    {name: "Login", slug: "/login", active : !authStatus},
    {name: "Signup", slug: "/signup", active : !authStatus},
    {name: "Create", slug: "/add-posts", active : authStatus, Icon: SquarePen},
  ]

  return (
    <header className="bg-white text-black py-4 sticky top-0 z-50 w-full border-b border-black">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-start">
          {navItems.map((item) =>
            item.active && (
              <li key = {item.name}>
                <button onClick={() => navigate(item.slug)} className="mr-2 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-blue-600">
                {item.Icon && <item.Icon size={18} aria-hidden="true" />}
                {item.name}
                </button>
              </li>
            )
          )}
          {authStatus && (
            <li className='ml-auto'>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Header
