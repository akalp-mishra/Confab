import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom'
import {Protected} from './components/index'
import AllPost from './pages/AllPost.jsx'
import AddPost from './pages/AddPost.jsx'
import EditPost from './pages/EditPost.jsx'
import Post from './pages/Post.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'

function RouteErrorBoundary(){
  const error = useRouteError();
  console.log(error);

  return (
    <div className="p-20 bg-red">
      <h3>Oops Something went wrong here !</h3>
      <p>{error.statusText || error.message}</p>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <RouteErrorBoundary />
  },
  {
        path: '',
        element: <Home/>,
        errorElement: <RouteErrorBoundary />
      },
  {
        path: '/login',
        element: <Login />,
        errorElement: <RouteErrorBoundary />
      },
  {
        path: '/signup',
        element: <Signup />,
        errorElement: <RouteErrorBoundary />
      },
  {
        path :'/all-posts',
        element :<AllPost />,
        errorElement: <RouteErrorBoundary />
      },
  {
        path: '/add-posts',
        element :<AddPost />,
        errorElement: <RouteErrorBoundary />
      },
  {
        path :'/edit-post/:slug',
        element :<EditPost />,
        errorElement: <RouteErrorBoundary />
      },
  {
        path :'/post/:slug',
        element :<Post />,
        errorElement: <RouteErrorBoundary />
      },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
