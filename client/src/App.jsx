import React, { useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connection from './pages/Connection'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import {useUser , useAuth} from '@clerk/clerk-react'
import Layout from './pages/Layout'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from './feature/user/userSlice'
import { fetchConnections } from './feature/connections/connectionSlice'
import { addMessages } from './feature/messages/messagesSlice'




const App = () => {
  const {user}= useUser()
  const {getToken } = useAuth()
  const {pathname} = useLocation()
  const pathnameRef = useRef(pathname)
  const dispatch = useDispatch()


  useEffect(()=>{
    const fetchData = async()=>{
      if(user){
        const token = await getToken()
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }
    }
    fetchData()
    
  },[user,getToken, dispatch])

  useEffect(()=>{
    pathnameRef.current=pathname
  },[pathname])

  useEffect(()=>{
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + 'api/message/' + user.id);

      eventSource.onmessage=()=>{
        const message = JSON.parse(event.data)

        if (pathnameRef.current===('/messages'+ message.from_user_id._id)){
          dispatch(addMessages(message))
        }else{

        }
      }
      return ()=>{
        eventSource.close()
      }
    }
  },[user, dispatch])

  return (
    <>
    <Toaster/>
      <Routes>

        <Route path='/' element={ !user ? <Login />: <Layout/> }>
          <Route index element={<Feed />} />
          <Route path='messages' element={<Messages />}/>
          <Route path='messages/:userId' element={<ChatBox />}/>
          <Route path='connections' element={<Connection />}/>
          <Route path='discover' element={<Discover />}/>
          <Route path='profile' element={<Profile />}/>
          <Route path='profile/:profileId' element={<Profile />}/>
          <Route path='create-post' element={<CreatePost />}/>
        

        </Route>

      </Routes>
   </>
  )
}

export default App