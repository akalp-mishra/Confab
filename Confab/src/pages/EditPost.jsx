import React, {useEffect, useState} from 'react'
import { Container, PostForm, Protected, Header } from '../components/index'
import blogpost from '../appwrite/post'
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
    const [post,setPost] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        if(slug){
            blogpost.getPost(slug).then((post)=>{
                if(post){
                    setPost(post)
                }   
            })
        }
        else {
            navigate('/')
        }
    },[slug, navigate])

  if(post){
    return <div className="py-8">
        <Protected authentication={true}>
            <Container>
                <Header />
                <PostForm post={post}/>
            </Container>
        </Protected>
    </div>
  }
  return null
}

export default EditPost
