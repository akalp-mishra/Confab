import React from 'react'
import {Container, PostForm, Protected} from '../components/index'

function AddPost() {
  return (
    <div className="py-8">
        <Protected authentication={true}>
            <Container>
                <PostForm post={null}/>
            </Container>
        </Protected>
    </div>
  )
}

export default AddPost
