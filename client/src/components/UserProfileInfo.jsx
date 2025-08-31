import { Calendar, MapPin, PenBox, PenBoxIcon, VerifiedIcon } from 'lucide-react'
import React from 'react'
import moment from "moment";

const UserProfileInfo = ({user, posts, profileId, setShowEdit}) => {
  return (
    <div className='relative py-4 px-6 md:px-8 bg-pink-100'>
        <div className='flex flex-col md:flex-row items-start gap-6'>


            <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full'>
                <img src={user.profile_picture} alt='' className='absolute rounded-full z-2'/>
            </div>

            <div className='w-full pt-16 md:pt-0 md:pl-36'>
                <div className='flex flex-col d:flex-row items-start justify-between'>
                    <div>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                            <VerifiedIcon className='w-6 h-6 text-rose-400'/>

                        </div>

                        <p className='text-pink-500'>{user.username ? `@${user.username}` : 'Add a username'} </p>
                    </div>
                    {/*If user is not on others profile that means he is opening his profile so we will give edit button */}
                    {!profileId && 
                         <button onClick={()=>setShowEdit(true)} className='flex items-center gap-2 border border-red-50 hover:bg-rose-200 px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0 cursor-pointer'>
                            <PenBox className='w-4 h-4'/>
                            Edit
                         </button>

                    }


                </div>
                <p className='text-violet-600 text-sm max-w-md mt-4'>{user.bio}</p>
                <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4'>
                    <span className='flex items-center gap-1.5'>
                        <MapPin className='w-4 h-4' />
                        {user.location ? user.location : 'Add Location'}
                    </span>

                    <span className='flex items-center gap-1.5'>
                        <Calendar className='w-4 h-4'/>
                        Vibing Since <span className='font-medium'>{moment(user.createdAt).fromNow()}</span>
                    </span>

                </div>
                <div className='flex items-center gap-6 mt-6 border-t border-gray-200 pt-4'>
                    <div>
                        <span className='sm:text-xl font-bold text-gray-800'>{posts.length}</span>
                        <span className='text-xs sm:text-sm text-gray-00 ml-1.5'>Posts</span>
                    </div>

                     <div>
                        <span className='sm:text-xl font-bold text-gray-800'>{user.followers.length}</span>
                        <span className='text-xs sm:text-sm text-gray-00 ml-1.5'>Followers</span>
                    </div>

                     <div>
                        <span className='sm:text-xl font-bold text-gray-800'>{user.following.length}</span>
                        <span className='text-xs sm:text-sm text-gray-00 ml-1.5'>Following</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfileInfo