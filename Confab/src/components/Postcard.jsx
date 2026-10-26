import React, {useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import fileupload from '../appwrite/fileUpload'
import Likes from '../appwrite/likes'
import {Link} from 'react-router-dom'
import parse from 'html-react-parser/lib/index'
import {ThumbsUp, UserCircle} from 'lucide-react'

function Postcard({$id, title,content, featured_image, likes, $createdAt, author}) {
  const authStatus = useSelector((state)=> state.auth.isAuthenticated)
  const userdata = useSelector((state)=> state.auth.userdata)

  const [ThumbsUpIcon, setThumbsUpIcon] = useState(false)
  const [ThumbsUpCount, setThumbsUpCount] = useState(0)

  let postcardContent;
  const postContent = parse(content).props.children
  if(postContent.length >=75) postcardContent = postContent.substring(0,75) + '... read more'
  else postcardContent = postContent

  useEffect(()=>{
    setThumbsUpCount(likes)
  },[])

useEffect(()=>{
  if(authStatus){
    Likes.checkUserLiked($id, userdata.$id).then((value)=>{
      setThumbsUpIcon(value);
    })
  }
},[authStatus])

function handleLikes(){
  if(ThumbsUpIcon){
    Likes.removeLike($id, userdata.$id);
    setThumbsUpCount((prev)=> prev-1)
  }
  else if (ThumbsUpIcon===false){
    Likes.addLike($id, userdata.$id)
    setThumbsUpCount((prev)=> prev+1)
  }
  setThumbsUpIcon((prev)=> !prev)
}

  return (
      <article className="h-full rounded-lg bg-white p-4 shadow-lg transition-colors duration-200 hover:bg-red-100">
          <div className="mb-4 flex min-w-0 items-center gap-3">
            {author?.profileImage
              ? <img src={fileupload.getFileView(author.profileImage)} alt={`${author.userName || 'User'}'s profile`} className="h-10 w-10 shrink-0 rounded-full object-cover" />
              : <UserCircle className="h-10 w-10 shrink-0 text-gray-500" aria-label="No profile picture" />}
            <span className="truncate font-semibold">{author?.userName || 'Unknown author'}</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">Published on {new Date($createdAt).toLocaleDateString()}</p>
          <Link to={`/post/${$id}`}>
            <p className='mb-5'>{postcardContent}</p>
          </Link>
          <div className="w-full h-48 bg-gray-300 border border-black rounded mb-4 justify center">
              <img src={fileupload.getFileView(featured_image)} alt='No Image' className="w-full h-full object-cover rounded-md" />
          </div>
          <hr />
          <div className='flex'>
            <button onClick={handleLikes} className='m-1 mt-3 ml-5 inline-block justify-items-end'>{ThumbsUpIcon?<ThumbsUp color="blue"/>:<ThumbsUp/>}</button>
            <div className='m-1.5 mt-4.5'>{ThumbsUpCount}</div>
          </div>
      </article>
  )
}

export default Postcard
