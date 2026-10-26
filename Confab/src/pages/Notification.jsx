import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserCircle } from 'lucide-react'
import { Protected, Header, SideNav } from '../components/index'
import FriendRequest from '../appwrite/friendRequest'
import blogpost from '../appwrite/post'
import fileupload from '../appwrite/fileUpload'

function Notification() {
  const userdata = useSelector((state) => state.auth.userdata)
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('loading')
  const [updatingRequestId, setUpdatingRequestId] = useState(null)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadRequests() {
      if (!userdata?.$id) {
        setRequests([])
        setStatus('error')
        return
      }

      setStatus('loading')
      try {
        const result = await FriendRequest.checkFriendRequest(null, userdata.$id)
        if (!result?.rows) {
          throw new Error('Friend request lookup returned no rows.')
        }

        const incomingRequests = await Promise.all(
          result.rows.map(async (request) => {
            const senderResult = await blogpost.findUser(request.SenderId)
            const sender = senderResult?.rows?.[0]
            if (!sender) {
              throw new Error(`Could not find profile for friend request sender ${request.SenderId}.`)
            }
            return { ...request, sender }
          })
        )

        if (isCurrent) {
          setRequests(incomingRequests)
          setStatus('ready')
        }
      } catch (error) {
        console.error('Failed to load incoming friend requests.', error)
        if (isCurrent) setStatus('error')
      }
    }

    loadRequests()
    return () => {
      isCurrent = false
    }
  }, [userdata?.$id])

  async function handleRequest(request, action) {
    if (updatingRequestId) return

    setUpdatingRequestId(request.$id)
    setActionError('')
    try {
      let result
      if (action === 'accept') {
        result = await FriendRequest.acceptFriendRequest(
          request.SenderId,
          request.ReceiverId,
          request.$id
        )
      } else {
        await FriendRequest.deleteFriendRequest(request.$id)
        result = true
      }

      if (!result) throw new Error(`The ${action} request operation did not complete.`)
      setRequests((current) => current.filter((item) => item.$id !== request.$id))
    }
    catch (error) {
      console.error(`Failed to ${action} friend request.`, error)
      setActionError('Could not update the friend request. Please try again.')
    }
    finally {
      setUpdatingRequestId(null)
    }
  }

  return (
    <Protected authentication={true}>
      <Header />
      <main className="flex min-h-screen w-full flex-col gap-5 bg-gray-100 p-5 md:flex-row">
        <SideNav />
        <section className="w-full">
          <h1 className="mb-5 text-2xl font-bold">Notifications</h1>
          {actionError && <p role="alert" className="mb-4 text-red-700">{actionError}</p>}
          {status === 'loading' && <p role="status">Loading friend requests...</p>}
          {status === 'error' && (
            <p role="alert">Could not load friend requests. Please try again later.</p>
          )}
          {status === 'ready' && requests.length === 0 && (
            <p>You have no incoming friend requests.</p>
          )}
          {status === 'ready' && requests.length > 0 && (
            <ul className="max-w-2xl space-y-3">
              {requests.map((request) => {
                const sender = request.sender
                const displayName = sender.userName || 'User'
                const isUpdating = updatingRequestId === request.$id

                return (
                  <li
                    key={request.$id}
                    className="flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow"
                  >
                    {sender.profileImage ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={fileupload.getFileView(sender.profileImage)}
                        alt={`${displayName}'s profile`}
                      />
                    ) : (
                      <UserCircle className="h-12 w-12 text-gray-500" aria-label="No profile picture" />
                    )}
                    <p className="min-w-32 flex-1 font-semibold">
                      {displayName} sent you a friend request
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRequest(request, 'accept')}
                      disabled={Boolean(updatingRequestId)}
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequest(request, 'reject')}
                      disabled={Boolean(updatingRequestId)}
                      className="rounded border border-gray-400 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </Protected>
  )
}

export default Notification
