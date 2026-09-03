import React from 'react'
import fileupload from '../appwrite/fileUpload'
import {Link} from 'react-router-dom'

function Postcard({$id, title,featured_image, $createdAt}) {
  return (
    <div>
      <Link to={`/post/${$id}`}>
      <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="w-full h-48 bg-gray-300 rounded-md mb-4 justify center">
              <img src={fileupload.getFileView(featured_image)} alt={title} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">Published on {new Date($createdAt).toLocaleDateString()}</p>
        </div>
      </Link>
    </div>
  )
}

export default Postcard
