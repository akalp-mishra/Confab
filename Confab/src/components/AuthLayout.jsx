import React, {useState,useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

function Protected({children,authentication=true}) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector((state)=>state.auth.isAuthenticated)

    useEffect(() => {
        if(authentication && !authStatus){
            navigate('/login')
        }
        else if(!authentication && authStatus){
            navigate("/")
        } else {
            setLoading(false)
        }
    }, [authStatus, navigate, authentication])

    if(loading) {
        return <div className="flex justify-center items-center min-h-screen"><h1 className="text-2xl">Loading...</h1></div>
    }

    return <>{children}</>
}

export default Protected
