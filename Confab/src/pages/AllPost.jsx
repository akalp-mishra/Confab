import React , {useState, useEffect} from 'react'
import blogpost from '../appwrite/config'
import { Postcard, Container, Protected} from '../components/index'

function AllPost() {
    const [posts, setPosts] = useState([])
    useEffect(()=>{
        blogpost.getPosts([]).then((response)=>response?setPosts(response.documents):null)
    },[])

  return (
    <div className='w-full py-8'>
        <Protected authentication={true}>
            <Container >
                <div className="flex flex-wrap">
                    {posts.map((post)=>(
                        <div className="p-3 w-1/4" key={post.$id}>
                            <Postcard key={post.$id} post={post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </Protected>
    </div>
  )
}

export default AllPost
