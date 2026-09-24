import React, {useState, useEffect} from 'react'
import blogpost from '../appwrite/post'
import { Container, Postcard, SideNav } from '../components/index'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux'

function Home() {
    const [posts,setPosts] = useState(null)
    useEffect(()=>{
        blogpost.listItems().then((post)=>{
            if(post){
                setPosts(post.documents)
            }
        })
    },[])
    return (
        <div className='w-full py-8'>
            <Container >
                <div className='flex'>
                    <SideNav/>
                    <div>
                        {posts?posts.map((post)=>(
                            <div className='p-2' key={post.$id}>
                                <Postcard {...post}/>
                            </div>
                        )): <div  className="bg-white p-4 rounded-lg shadow-lg w-full h-100">
                                <Skeleton height={20} width={100} containerClassName='flex-1' className='mb-3'/>
                                <Skeleton height={20} width={200} containerClassName='flex-1'/>
                                <Skeleton height={30} count={3} width={750} containerClassName='flex-1'/>
                                <Skeleton height={100} width={750} containerClassName='flex-1'/>
                            </div>}
                    </div>
                </div>   
            </Container>
        </div>
    )
}

export default Home
