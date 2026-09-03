import React from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'
import conf from "../conf"

function RTE({name, control, label, defaultValue=""}) {
  return (
    <div className="w-full">{
        label && <label className="block text-gray-700 font-bold mb-2">{label}</label>}
        <Controller name={name || 'content'} control={control} render={({field :{onChange}}) =>(
            <Editor 
                apiKey={conf.tinymceapi}
                initialValue={defaultValue} 
                init={{
                initialValue: defaultValue,
                height: 500,
                menubar: false,
                plugins: [
                    "image",
                    "link",
                    "media",
                    "table",
                    "lists",
                    "code",
                    "help",
                    "wordcount",
                    "searchreplace",
                    "insertdatetime",
                    "autolink",
                    "fullscreen",
                    "preview",
                    "codesample",
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={onChange}
            />
        )}/>
        </div>
  )
}

export default RTE
