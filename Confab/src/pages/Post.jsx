import React, {useState, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import blogpost from '../appwrite/post'
import fileupload from '../appwrite/fileUpload'
import { Button, Container, Header } from '../components/index'
import parse from "html-react-parser"
import { useSelector } from 'react-redux'
import EditPost from './EditPost'

function Post() {
    const [post, setPost] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    const userData = useSelector((state)=> state.auth.userdata)
    const isAuthor = post && userData ? post.user_id === userData.$id : false;

    useEffect(()=>{
        if(slug){
            blogpost.getPost(slug).then((post)=>{
                if (post) setPost(post)
                else navigate('/')
            })
        }
        else navigate("/")
    },[slug, navigate])

    const deletePost= () => {
        blogpost.deletePost(post.$id).then((status)=>{
            if(status){
                blogpost.deletePost(post.featured_image)
                navigate("/")
            }
        })
    }

  return post ?(
    <div>
        <Header />
        <div className='bg-gray-200 h-full w-full p-5'>
                {isAuthor && (
                    <div className='absolute right-6'>
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button className="bg-blue-500 active:bg-blue-800 w-20 rounded-l mr-3 h-10">EDIT</Button>
                        </Link>
                        <Link to={''}>
                            <Button onClick={()=>{
                                blogpost.deletePost(post.$id);
                                fileupload.deleteFile(post.featured_image);
                            }} className="bg-red-500 w-20 rounded-full h-10">DELETE</Button>
                        </Link>
                    </div>
                )}
            <div className='relative w-full mb-4 mt-5 mr-4'>
                <h1 className='text-2xl font-bold'>{post.title}</h1>
            </div>
            <div className='browser-css mb-10'>{parse(post.content)}</div>
            <div className='border rounded-lg max-h-150 flex mb-10'>
                <img src={fileupload.getFileView(post.featured_image)} alt={post.title} className='rounded-lg max-h-150 w-full'/>
            </div>
        </div>
    </div>
  ): null
}

export default Post
