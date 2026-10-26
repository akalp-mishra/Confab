import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserCircle } from 'lucide-react'
import { Header, Protected, SideNav } from '../components'
import UserFriend from '../components/UserFriend'
import FriendRequest from '../appwrite/friendRequest'
import fileupload from '../appwrite/fileUpload'

function FriendsPage() {
  const currentUser = useSelector((state) => state.auth.userdata)
  const [friends, setFriends] = useState([])
  const [friendsStatus, setFriendsStatus] = useState('loading')
  const [userId, setUserId] = useState('')
  const [searchedUserId, setSearchedUserId] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadFriends() {
      if (!currentUser?.$id) {
        setFriendsStatus('loading')
        return
      }

      setFriendsStatus('loading')
      try {
        const friendshipResult = await FriendRequest.checkFriendship(currentUser.$id)
        const friendIds = [...new Set((friendshipResult?.rows || [])
          .map((friendship) => {
            if (friendship.friend1Id === currentUser.$id) return friendship.friend2Id
            if (friendship.friend2Id === currentUser.$id) return friendship.friend1Id
            return null
          })
          .filter((friendId) => friendId && friendId !== currentUser.$id))]
        const friendAccounts = await Promise.all(
          friendIds.map((friendId) => FriendRequest.findAccount(friendId))
        )

        if (!isCurrent) return
        setFriends(friendAccounts.filter(Boolean))
        setFriendsStatus('ready')
      }
      catch (error) {
        console.error('Failed to load friends.', error)
        if (isCurrent) setFriendsStatus('error')
      }
    }

    loadFriends()
    return () => {
      isCurrent = false
    }
  }, [currentUser?.$id])

  function handleSearch(event) {
    event.preventDefault()
    setSearchedUserId(userId.trim())
  }

  return (
    <Protected authentication={true}>
      <div>
        <Header />
        <main className="flex min-h-screen w-full flex-col gap-5 bg-gray-100 p-5 md:flex-row">
            <SideNav />
          <section className="mx-auto max-w-2xl">
            <h1 className="mb-4 text-2xl font-bold">Your friends</h1>
            {friendsStatus === 'loading' && <p role="status">Loading friends...</p>}
            {friendsStatus === 'error' && (
              <p role="alert">Unable to load your friends. Please try again.</p>
            )}
            {friendsStatus === 'ready' && friends.length === 0 && (
              <p className="mb-6 text-gray-600">You have no friends yet.</p>
            )}
            {friends.length > 0 && (
              <ul className="mb-8 space-y-3">
                {friends.map((friend) => (
                  <li key={friend.$id} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow">
                    {friend.profileImage ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={fileupload.getFileView(friend.profileImage)}
                        alt={`${friend.userName || 'User'}'s profile`}
                      />
                    ) : (
                      <UserCircle className="h-12 w-12 text-gray-500" aria-label="No profile picture" />
                    )}
                    <p className="font-semibold">{friend.userName || 'User'}</p>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="mb-4 text-2xl font-bold">Find friends</h2>
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
              <label htmlFor="friend-user-id" className="sr-only">User ID</label>
              <input
                id="friend-user-id"
                type="text"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="Enter a user ID"
                className="min-w-0 flex-1 rounded border border-gray-300 bg-white p-2"
              />
              <button
                type="submit"
                disabled={!userId.trim()}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
              </button>
            </form>
            {searchedUserId && <UserFriend id={searchedUserId} />}
          </section>
        </main>
      </div>
    </Protected>
  )
}

export default FriendsPage
