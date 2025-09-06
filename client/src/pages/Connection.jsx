import React, { useEffect, useState } from 'react'
import { User, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../assets/assets'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchConnections } from '../feature/connections/connectionSlice'
import toast from 'react-hot-toast'

const Connection = () => {
  const [currentTab, setCurrentTab] = useState('Followers')
  const navigate = useNavigate()
  const {getToken } = useAuth()
  const dispatch= useDispatch()

  const {connections,pendingConnections,followers,following}=useSelector((state)=>state.connections)

  const dataArray = [
    { label: 'Followers', value: followers, icon: User },
    { label: 'Following', value: following, icon: UserCheck },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: UserPlus },
  ]

  const handleUnfollow = async(userId)=>{
    try{
      const{data}= await api.post('/api/user/unfollow',{id:userId},{
        headers:{Authorization: `Bearer ${await getToken()}`}
      })
      if (data.success){
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      } else {
        toast(data.message)
      }
    } catch(error){
      toast.error(error.message)
    }
  }

    const acceptConnection = async(userId)=>{
    try{
      const{data}= await api.post('/api/user/accept',{id:userId},{
        headers:{Authorization: `Bearer ${await getToken()}`}
      })
      if (data.success){
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      } else {
        toast(data.message)
      }
    } catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getToken().then((token)=>{
      dispatch(fetchConnections(token))
    })
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-400 mb-2">Connections</h1>
          <p className="text-pink-400">Because every connection starts with ‘Hey!’</p>
        </div>

        {/* Counts */}
       <div className='mb-8 flex flex-wrap gap-6'>
  {dataArray.map((item, index) => (
    <div
      key={index}
      className='flex flex-col items-center justify-center gap-1 border h-20 w-40 
                 border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50 
                 shadow-md rounded-lg hover:shadow-lg transition'
    >
      <b className='text-purple-600 text-lg'>{item.value.length}</b>
      <p className='text-slate-700 font-medium'>{item.label}</p>
    </div>
  ))}
</div>


        {/* Tabs */}
        <div className="inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm">
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors 
              ${currentTab === tab.label
                  ? 'bg-rose-100 font-medium text-rose-700'
                  : 'text-red-400 hover:text-rose-700'}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="ml-1">{tab.label}</span>
              <span className="ml-2 text-xs bg-gray-100 text-rose-700 px-2 py-0.5 rounded-full">
                {tab.value.length}
              </span>
            </button>
          ))}
        </div>

        {/*Connections*/}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find((item)=> item.label === currentTab).value.map((user)=>(
            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt='' className='rounded-full w-12 h-12 shadow-md mx-auto'/>
              <div className='flex-1'>
                <p className='font-medium text-rose-700'>{user.full_name}</p>
                <p className=' text-rose-500'>{user.username}</p>
                <p className='font-sm text-rose-600'>{user.bio.slice(0,30)}...</p>
                <div className='flex max-sm:flex-col gap-2 mt-4'>

                  {
                    <button onClick={()=> navigate(`/profile/${user._id}`)}
                    className='w-full p-2 text-sm rounded bg-gradient-to-r from-purple-500 to-rose-600 hover:from-purple-600 hover:to-purple-7-- active:scale-95 transition text-white curson-pointer'>
                        View Profile
                    </button>
                     
                     }

                     {
                      currentTab=== 'Following' && (
                        <button onClick={()=>handleUnfollow(user._id)} className='w-full p-2 text-sm rounded bg-pink-100 hover:bg-pink-300  text-black active:scale-95 transition cusrsor-pointer'>
                          Unfollow
                        </button>
                      )
                     }
                     {
                      currentTab=== 'Pending' && (
                        <button onClick={()=>acceptConnection(user._id)} className='w-full p-2 text-sm rounded bg-pink-100 hover:bg-pink-300  text-black active:scale-95 transition cusrsor-pointer'>
                          Accept
                        </button>
                      )
                     }
                     {
                      currentTab=== 'Connections' && (
                        <button onClick={()=> navigate(`/messages${user._id}`)} className='w-full p-2 text-sm rounded bg-pink-100 hover:bg-pink-300  text-black active:scale-95 transition cusrsor-pointer flex items-center justify-center gap-1'>
                          <MessageSquare className='w-4 h-4'/>
                          Message
                        </button>
                      )
                     }



                </div>
              </div>
              </div>
          ))}
        </div>



      </div>
    </div>
  )
}

export default Connection
