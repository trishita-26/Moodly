import React from 'react'
import { dummyUserData } from '../assets/assets'
import { MapPin, MessageCircle, Plus, UserPlus, UserPlus2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { fetchUser } from '../feature/user/userSlice'

const UserCard = ({user}) => {
    const currentUser = useSelector((state)=> state.user.value)
    const {getToken} = useAuth()
    const dispatch= useDispatch()
    const navigate = useNavigate()

    const handleFollow = async ({user}) => {
      try{
         const {data} = await api.post('/api/user/follow', {id: user._id},{
          headers:{Authorization:`Bearer ${await getToken()}`}
         })
         if (data.success){
          toast.success(data.message)
          dispatch(fetchUser(await getToken()))
         }else{
          toast.error(data.message)
         }
      }catch(error){
        toast.error(error.message)
      }
    }
    
    const handleConnectionRequest= async () =>{
        if(currentUser,connections.includes(user._id)){
          return navigate('/messages/'+ user._id)
        }
        try{
          const {data} = await api.post('/api/user/connect',{id:user._id},{
            headers: {Authorization:`Bearer ${await getToken()}`}
          }) 
          if(data.success){
            toast.success(data.message)
            dispatch(fetchUser(await getToken()))
          }else{
            toast.error(data.message)
          }

        }catch(error){
            toast.error(data.message)
        } 
    }

    

    
  return (
    <div key={user._id} className="w-full bg-white/80 backdrop-blur-md shadow-md rounded-2xl p-4 flex flex-col items-center border border-gray-100 hover:shadow-lg transition">
  
  {/* Avatar */}
  <img 
    src={user.profile_picture} 
    alt="profile" 
    className="w-20 h-20 rounded-full object-cover border-2 border-rose-400 shadow-sm"
  />

  {/* Name & Username */}
  <h2 className="mt-3 font-semibold text-gray-800 text-lg text-center">{user.name}</h2>
  <p className="text-gray-500 text-sm">@{user.username}</p>

  {/* Bio */}
  <p className="text-gray-600 text-pretty text-center text-sm mt-2 px-2">
    {user.bio || "No bio available..."}
  </p>

  {/* Buttons Section */}
  <div className="flex items-center gap-3 w-full mt-4">
    
    {/* Follow Button */}
    <button 
      onClick={handleFollow} 
      disabled={currentUser?.following.includes(user._id)}
      className="flex-1 py-2.5 rounded-xl flex justify-center items-center gap-2 
                 bg-gradient-to-r from-rose-500 to-purple-600 
                 hover:from-rose-500 hover:to-purple-700 
                 active:scale-95 transition text-white font-medium shadow-sm disabled:opacity-70">
      <UserPlus2 className="w-4 h-4"/>
      {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
    </button>

    {/* Connect Button */}
    <button 
      onClick={handleConnectionRequest} 
      className="w-12 h-11 flex items-center justify-center rounded-xl border border-gray-300 
                 text-slate-500 group bg-white/70 backdrop-blur-sm 
                 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 
                 active:scale-95 transition shadow-sm">
      {
        currentUser?.connections.includes(user._id)
          ? <MessageCircle className="w-5 h-5 group-hover:scale-110 transition"/>
          : <Plus className="w-5 h-5 group-hover:scale-110 transition"/>
      }
    </button>
  </div>
</div>

  )
}

export default UserCard