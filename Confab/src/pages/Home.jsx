import React, {useState, useEffect} from 'react'
import { Query } from 'appwrite'
import blogpost from '../appwrite/post'
import FriendRequest from '../appwrite/friendRequest'
import { Postcard, ProjectsCard, SideNav } from '../components/index'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux'

async function addPostAuthors(postList, currentUser) {
    const authorIds = [...new Set(postList.map((post) => post.user_id).filter(Boolean))]
    const authors = new Map()

    await Promise.all(authorIds.map(async (authorId) => {
        const authorResult = await blogpost.findUser(authorId)
        const authorProfile = authorResult?.rows?.[0]
        if (authorId === currentUser?.$id) {
            authors.set(authorId, {
                ...authorProfile,
                userName: currentUser.name || authorProfile?.userName
            })
            return
        }

        authors.set(authorId, authorProfile || null)
    }))

    return postList.map((post) => ({ ...post, author: authors.get(post.user_id) || null }))
}

function Home() {
    const [posts,setPosts] = useState(null)
    const currentUser = useSelector((state) => state.auth.userdata)

    useEffect(() => {
        let isCurrent = true

        async function loadPosts() {
            try {
                if (!currentUser?.$id) {
                    const fallbackPosts = await blogpost.listItems()
                    if (!fallbackPosts) throw new Error('Failed to load posts.')
                    const postsWithAuthors = await addPostAuthors(fallbackPosts.documents, currentUser)
                    if (isCurrent) setPosts(postsWithAuthors)
                    return
                }

                const friendshipResult = await FriendRequest.checkFriendship(currentUser.$id)
                if (!friendshipResult) throw new Error('Failed to load friendships.')

                const friendIds = [...new Set((friendshipResult.rows || [])
                    .map((friendship) => {
                        if (friendship.friend1Id === currentUser.$id) return friendship.friend2Id
                        if (friendship.friend2Id === currentUser.$id) return friendship.friend1Id
                        return null
                    })
                    .filter((friendId) => friendId && friendId !== currentUser.$id))]

                const [friendPostsResult, fallbackPostsResult] = await Promise.all([
                    friendIds.length > 0
                        ? blogpost.listItems([
                            Query.equal('user_id', friendIds),
                            Query.orderDesc('$updatedAt'),
                            Query.orderDesc('$createdAt'),
                            Query.limit(10)
                        ])
                        : Promise.resolve(null),
                    blogpost.listItems()
                ])

                if (!fallbackPostsResult || (friendIds.length > 0 && !friendPostsResult)) {
                    throw new Error('Failed to load feed posts.')
                }

                if (!isCurrent) return
                const friendPosts = friendPostsResult?.documents || []
                const friendPostIds = new Set(friendPosts.map((post) => post.$id))
                const fallbackPosts = fallbackPostsResult.documents.filter(
                    (post) => !friendPostIds.has(post.$id)
                )
                const postsWithAuthors = await addPostAuthors([...friendPosts, ...fallbackPosts], currentUser)
                if (isCurrent) setPosts(postsWithAuthors)
            }
            catch (error) {
                console.error('Failed to load feed posts.', error)
                if (isCurrent) setPosts([])
            }
        }

        loadPosts()
        return () => {
            isCurrent = false
        }
    }, [currentUser])
    return (
        <div className='w-full'>
                <div className='flex flex-col md:flex-row md:items-start'>
                    <SideNav />
                    <div className='grid min-w-0 flex-1 grid-cols-1 gap-6 px-4 py-6 md:grid-cols-2 xl:grid-cols-3'>
                        {posts ? posts.map((post) => (
                            <Postcard {...post} key={post.$id} />
                        )) : Array.from({ length: 6 }, (_, index) => (
                            <div className="min-h-96 rounded-lg bg-white p-4 shadow-lg" key={index}>
                                <div className="mb-4 flex items-center gap-3">
                                    <Skeleton circle height={40} width={40} />
                                    <Skeleton height={18} width={130} />
                                </div>
                                <Skeleton height={24} width="70%" className="mb-3" />
                                <Skeleton height={16} width="45%" className="mb-4" />
                                <Skeleton count={3} height={18} className="mb-2" />
                                <Skeleton height={190} className="mb-4" />
                                <Skeleton height={20} width={70} />
                            </div>
                        ))}
                        {posts && <ProjectsCard />}
                    </div>
                </div>   
        </div>
    )
}

export default Home
