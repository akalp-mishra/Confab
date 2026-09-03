import React from 'react'
import { Header, Protected, Signup as SignupComponent} from '../components/index'

function Signup() {
  return (
    <div className="py-8">
        <Protected authentication={false}>
            <Header />
            <SignupComponent />
        </Protected>
    </div>
  )
}

export default Signup
