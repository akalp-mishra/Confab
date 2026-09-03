import React from 'react'
import {Header, Login as LoginComponent} from "../components/index"
import {Protected} from '../components/index'

function Login() {
  return (
    <div className="py-8">
        <Protected authentication={false}>
            <Header />
            <LoginComponent />
        </Protected>
    </div>
  )
}

export default Login
