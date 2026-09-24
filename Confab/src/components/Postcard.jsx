import React, {useState,useEffect} from 'react'
import fileupload from '../appwrite/fileUpload'
import {Link} from 'react-router-dom'
import parse from 'html-react-parser/lib/index'
import {ThumbsUp} from 'lucide-react'

function Postcard({$id, title,content, featured_image, likes, $createdAt}) {
  const postContent = parse(content).props.children
  let postcardContent;
  if(postContent.length >=250) postcardContent = postContent.substring(0,250) + '... read more'
  else postcardContent = postContent

  const [ThumbsUpIcon, setThumbsUpIcon] = useState(null)
  const [ThumbsUpCount, setThumbsUpCount] = useState(0)
  useEffect(()=>{
    if(likes===null) setThumbsUpCount(1);
    else setThumbsUpCount(likes);
  },[])
  useEffect(()=>{
    if(ThumbsUpIcon) setThumbsUpCount(prev=>prev+1)
    else if(ThumbsUpIcon===false) setThumbsUpCount(prev=>prev-1)
  },[ThumbsUpIcon])

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-lg w-full h-100">
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
            <button onClick={()=>{(ThumbsUpIcon!==null)?setThumbsUpIcon(prev=>!prev):setThumbsUpIcon(true)}} className='m-1 mt-3 ml-5 inline-block'>{ThumbsUpIcon?<ThumbsUp color="blue"/>:<ThumbsUp/>}</button>
            <div className='m-1.5 mt-4.5'>{ThumbsUpCount}</div>
          </div>
        </div>
    </div>
  )
}

export default Postcard
