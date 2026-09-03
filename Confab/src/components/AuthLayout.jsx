import React, {useState,useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

function Protected({children,authentication=true}) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector((state)=>state.auth.isAuthenticated)

    useEffect(() => {
        // Redirect if authentication requirement doesn't match user status
        if(authentication && !authStatus){
            // User needs to be authenticated but isn't
            navigate('/login')
        }
        else if(!authentication && authStatus){
            // User should NOT be authenticated (like login page) but is
            navigate("/")
        } else {
            // Authentication status matches requirement
            setLoading(false)
        }
    }, [authStatus, navigate, authentication])

    if(loading) {
        return <div className="flex justify-center items-center min-h-screen"><h1 className="text-2xl">Loading...</h1></div>
    }

    return <>{children}</>
}

export default Protected
