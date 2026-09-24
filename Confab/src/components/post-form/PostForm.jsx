import React, {useCallback, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import blogpost from '../../appwrite/post'
import fileupload from '../../appwrite/fileUpload'
import { useNavigate, useParams } from 'react-router-dom'
import parse from 'html-react-parser'
import {useSelector} from 'react-redux'
 
function PostForm({post=null}) {
  const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
    defaultValues: {
      title: post? post.title :'',
      slug: post? (post.title):'',
      content : post? post.content: '',
      status: post? post.status: ''
    },
  })

  const navigate = useNavigate()
  const userData = useSelector(state => state.auth.userdata)
  
  const submit = async(data) => {
    if (post !== null){
      const fileIdPromise = data.featured_image[0] ? await fileupload.uploadFile(data.featured_image[0]): null
      let fileId = await fileIdPromise
      if(fileId!==null){
        fileupload.deleteFile(post.featured_image)
      }
      else fileId = post.featured_image
      const dbPostPromise = await  blogpost.updatepost(post.$id,{ ...data, featured_image:(fileId.$id!==post.featured_image? fileId.$id : post.featured_image)})
      const dbPost =  await dbPostPromise
      if(dbPost){
        navigate(`/post/${dbPost.$id}`)
      }
    }
    else {
      const fileIdPromise = data.featured_image[0] ? await fileupload.uploadFile(data.featured_image[0]): null
      const fileId = await fileIdPromise
      if (fileId){
        data.featured_image = fileId
        const dbPostPromise = await blogpost.createPost({
          ...data,
          user_id: userData.$id
        })
        const dbPost = await dbPostPromise
        if(dbPost){
            navigate(`/post/${dbPost.$id}`)
        }
      }
    }
  }

  const slugTransform = useCallback((value) =>{
    if(value && typeof value === "string"){
      const result = value.toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
      return result;
    }
    return "";
  }, [])

  const titleValue = watch("title")
  const slugValue = watch("slug")

  useEffect(() => {
    if(titleValue){
      const newSlug = slugTransform(titleValue)
      setValue("slug", newSlug)
    }
    else if(titleValue == ""){
      setValue("slug","")
    }
  }, [titleValue, slugTransform, setValue, slugValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className='w-2/3 px-2'>
        <Input label="Title" className="mb-5" {...register("title", {required : true})}/>
        <div className="flex flex-col mb-5">
          <label className="mb-2">Slug</label>
          <Input 
            type="text"
            {...register("slug", {required : true})}
            placeholder="slug" 
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
        <RTE label="Content:" name="content" control={control}  defaultValue={getValues("content")} {...register("content", {required : true})}/>
      </div>
      <div className="w-1/3 px-2">
        <Input label="Featured Image" type="file" className="mb-4" accept="image/jpg image/png image/gif" {...register("featured_image",{required:!post})}/>
        {post !== null && (
          <div className="w-full mb-4">
            <img src={fileupload.getFileView(post.featured_image)} alt={post.title} height="150" width="150" className='rounded-lg'/>
          </div>
        )}
        <Select label="Status" options={["inactive","active"]} className="mb-4" {...register("status", {required:true})}></Select>
        <Button type="Submit" className="w-1/4 bg-green-400 rounded-xl px-2 hover:bg-gray-400" >
          {post !== null? "Update": "Submit"}
        </Button>
      </div>
    </form>
  )
}

export default PostForm
