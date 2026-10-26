import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserCircle } from 'lucide-react'
import fileupload from '../appwrite/fileUpload'
import FriendRequest from '../appwrite/friendRequest'

function UserFriend({ id }) {
  const sender = useSelector((state) => state.auth.userdata)
  const [lookup, setLookup] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [requestResult, setRequestResult] = useState(null)

  useEffect(() => {
    let isCurrent = true

    async function loadUser() {
      try {
        const foundUser = await FriendRequest.findAccount(id)
        if (!isCurrent) return
        if (!foundUser) {
          setLookup({ id, status: 'not-found', user: null })
          return
        }

        setLookup({ id, status: 'ready', user: foundUser })
      }
      catch (error) {
        console.error('Failed to load the requested user.', error)
        if (isCurrent) setLookup({ id, status: 'error', user: null })
      }
    }

    if (!id) return undefined

    loadUser()
    return () => {
      isCurrent = false
    }
  }, [id])

  async function handleSendFriendRequest() {
    if (!sender?.$id || !user?.userId || sender.$id === user.userId || isSending) return

    setIsSending(true)
    try {
      const request = await FriendRequest.sendFriendRequest(sender.$id, user.userId)
      if (request) {
        setRequestResult({ id, status: 'sent' })
      } else {
        setRequestResult({ id, status: 'error' })
      }
    }
    catch (error) {
      console.error('Failed to send the friend request.', error)
      setRequestResult({ id, status: 'error' })
    }
    finally {
      setIsSending(false)
    }
  }

  if (!id) {
    return <p>Enter a user ID to find a friend.</p>
  }

  const status = lookup?.id === id ? lookup.status : 'loading'
  const user = lookup?.id === id ? lookup.user : null
  const requestStatus = requestResult?.id === id ? requestResult.status : 'idle'

  if (status === 'loading') {
    return <p role="status">Looking up user...</p>
  }
  if (status === 'not-found') {
    return <p role="status">No user found with that ID.</p>
  }
  if (status === 'error') {
    return <p role="alert">Unable to load this user. Please try again.</p>
  }
  if (!user) return null

  const isSelf = sender?.$id === user.userId
  const profileImage = user.profileImage
  const displayName = user.userName || 'User'

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow">
      {profileImage ? (
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={fileupload.getFileView(profileImage)}
          alt={`${displayName}'s profile`}
        />
      ) : (
        <UserCircle className="h-12 w-12 text-gray-500" aria-label="No profile picture" />
      )}
      <p className="flex-1 font-semibold">{displayName}</p>
      {requestStatus === 'sent' ? (
        <p role="status" className="text-green-700">Friend request sent</p>
      ) : isSelf ? (
        <p className="text-gray-600">This is your account.</p>
      ) : <>
        {requestStatus === 'error' && (
          <p role="alert" className="text-red-700">Could not send the friend request. Please try again.</p>
        )}
        <button
          type="button"
          onClick={handleSendFriendRequest}
          disabled={!sender?.$id || isSending}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Send friend request'}
        </button>
      </>}
    </div>
  )
}

export default UserFriend
