import React, {useState, useEffect} from 'react'
import blogpost from '../appwrite/config'
import { Container, Postcard, Protected } from '../components/index'

function Home() {
    const [posts,setPosts] = useState([])
    useEffect(()=>{
        blogpost.getPosts().then((posts)=>{
            if(posts){
                setPosts(posts.documents)
            }
        })
    },[])
    if(posts.length === 0){
        return (
            <div className="w-full p-8 mt-4 text-center">
                <Container >
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='teaxt-2xl font-bold hover:text-gray-500'>Loading</h1>
                        </div>
                    </div>  
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container >
                <div className='felx gap-4'>
                    {posts.map((post)=>(
                        <div className='p-2 w-100 inline-block' key={post.$id}>
                            <Postcard {...post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home
