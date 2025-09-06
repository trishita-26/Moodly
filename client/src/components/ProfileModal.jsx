import React, { useState } from 'react'
import {dummyUserData} from '../assets/assets'
import { PencilIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../feature/user/userSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const ProfileModal = ({setShowEdit}) => {

  const dispatch = useDispatch();
  const {getToken} = useAuth()

     const user = dummyUserData;
     const [editForm, setEditForm]= useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo:null,
        full_name: user.full_name,
     })

     const handleSaveProfile = async (e) => {
        e.preventDefault();
        try{

          const userData= new FormData();
          const {full_name,username,bio,location,profile_picture,cover_photo} = editForm

          userData.append('username',username);
          userData.append('bio',bio);
          userData.append('location',location);
          userData.append('full_name',full_name);
          profile_picture && userData.append('profile',profile_picture)
          cover_photo && userData.append('cover',cover_photo)

          const token = await getToken()
          dispatch(updateUser({userData,token}))

          setShowEdit(false)
        }catch(error){
            toast.error(error.message)
        }
     }


  return (
    <div className='fixed inset-0 z-110 flex items-center justify-center bg-black/50'>
  <div className='h-screen overflow-y-auto flex flex-col items-center justify-start p-6 bg-gray-50'>
    <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>

    <form className='space-y-6' onSubmit={e=> toast.promise (handleSaveProfile(e),{loading:'Saving...'})}>
      {/* Profile Picture */}
      <div className='flex flex-col items-center gap-3'>
        <label htmlFor='profile_picture' className='text-sm font-medium text-gray-700'>
          Profile Picture
          <input
            hidden
            type="file"
            accept="image/*"
            id="profile_picture"
            onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })}
          />
          <div className='group/profile relative mt-2'>
            <img
              src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture}
              alt=''
              className='w-24 h-24 rounded-full object-cover'
            />
            <div className='absolute inset-0 hidden group-hover/profile:flex bg-black/20 rounded-full items-center justify-center'>
              <PencilIcon className='w-5 h-5 text-white' />
            </div>
          </div>
        </label>
      </div>

      {/* Cover Photo */}
      <div className='flex flex-col items-center gap-3'>
        <label htmlFor='cover_photo' className='text-sm font-medium text-gray-700'>
          Cover Photo
          <input
            hidden
            type="file"
            accept="image/*"
            id="cover_photo"
            onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })}
          />
          <div className='group/cover relative mt-2'>
            <img
              src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo}
              alt=''
              className='w-80 h-40 rounded-lg object-cover'
            />
            <div className='absolute inset-0 hidden group-hover/cover:flex bg-black/20 rounded-lg items-center justify-center'>
              <PencilIcon className='w-5 h-5 text-white' />
            </div>
          </div>
        </label>
      </div>

      {/* Name */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Name
        </label>
        <input
          type="text"
          className='w-full p-3 border border-gray-200 rounded-lg'
          placeholder='Please enter your name'
          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
          value={editForm.full_name}
        />
      </div>

      {/* Username */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Username
        </label>
        <input
          type="text"
          className='w-full p-3 border border-gray-200 rounded-lg'
          placeholder='Please enter a username'
          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
          value={editForm.username}
        />
      </div>

      {/* Bio */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Bio
        </label>
        <textarea
          rows={4}
          className='w-full p-3 border border-gray-200 rounded-lg'
          placeholder='Tell them about yourself'
          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          value={editForm.bio}
        />
      </div>

      {/* Location */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Location
        </label>
        <input
          type="text"
          className='w-full p-3 border border-gray-200 rounded-lg'
          placeholder='Where are you now'
          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
          value={editForm.location}
        />
      </div>

      {/* Buttons */}
      <div className='flex justify-end space-x-3 pt-6'>
        <button
          type='button'
          onClick={() => setShowEdit(false)}
          className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='px-4 py-2 bg-gradient-to-r from-rose-400 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition cursor-pointer'
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>

  )
}

export default ProfileModal