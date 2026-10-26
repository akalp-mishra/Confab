import { useState } from 'react'
import { useSelector } from 'react-redux'
import fileupload from '../appwrite/fileUpload'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'
import { UserGroup, UserCircle, Bell, Menu, X } from 'lucide-react'

function SideNav() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const authStatus = useSelector((state)=> state.auth.isAuthenticated)
  const userdata = useSelector((state)=> state.auth.userdata)
  const profileImage = userdata?.pfpId?.rows?.[0]?.profileImage

  function navigateTo(path) {
    setIsOpen(false)
    navigate(path)
  }

  function SidebarContent() {
    if (!authStatus) {
      return (
        <>
          <div className='text-2xl font-semibold'>
            <button className='hover:text-blue-600' onClick={() => navigateTo('/signup')}>Register</button>
            <p className='my-2 text-base font-normal text-gray-500'>or</p>
            <button className='hover:text-blue-600' onClick={() => navigateTo('/login')}>Login</button>
          </div>
          <hr className='mt-5 border-gray-300' />
        </>
      )
    }

    return (
      <>
        <div className='flex min-w-0 items-center gap-3'>
          {profileImage
            ? <img className='h-12 w-12 shrink-0 rounded-full object-cover' src={fileupload.getFileView(profileImage)} alt={`${userdata.name}'s profile`} />
            : <UserCircle size={48} className='shrink-0' />}
          <div className='min-w-0'>
            <p className='truncate text-xl font-semibold'>{userdata?.name || 'User'}</p>
            <p className='truncate text-sm font-light'>{userdata?.email}</p>
          </div>
        </div>
        <hr className='my-5 border-gray-300' />
        <button
          type="button"
          className='mt-6 flex w-full text-left hover:text-blue-600'
          onClick={() => navigateTo(`/friends/${userdata.$id}`)}
        >
          <UserGroup className='mr-4 inline' />
          <p>Friends</p>
        </button>
        <button
          type="button"
          className='mt-6 flex w-full text-left hover:text-blue-600'
          onClick={() => navigateTo('/notification')}
        >
          <Bell className='mr-4 inline' />
          <p>Notification</p>
        </button>
      </>
    )
  }

  return (
    <>
      <div className='w-full md:hidden'>
        <button
          type="button"
          className='mb-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow'
          aria-expanded={isOpen}
          aria-controls='mobile-side-navigation'
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
          <span>{isOpen ? 'Close menu' : 'Menu'}</span>
        </button>
        {isOpen && (
          <div className='fixed inset-0 z-[60] md:hidden'>
            <button
              type="button"
              className='absolute inset-0 h-full w-full bg-black/40'
              aria-label="Close navigation menu"
              onClick={() => setIsOpen(false)}
            />
            <aside
              id='mobile-side-navigation'
              className='absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl'
            >
              <SidebarContent />
            </aside>
          </div>
        )}
      </div>
      <aside className='sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-5 shadow-lg md:block'>
        <SidebarContent />
      </aside>
    </>
  )
}

export default SideNav
