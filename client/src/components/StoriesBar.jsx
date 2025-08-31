import React, { useState, useEffect } from 'react'
import { dummyStoriesData } from '../assets/assets'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [viewStory, setViewStory] = useState(null)

  const fetchStories = async () => {
    setStories(dummyStoriesData)
  }

  useEffect(() => {
    fetchStories()
  }, [])

  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
      <div className='flex gap-4 pb-5'>
        {/* Create Story Card */}
        <div
          onClick={() => setShowModal(true)}
          className="rounded-2xl shadow-md min-w-[120px] h-[180px] aspect-[3/4] cursor-pointer 
                hover:shadow-lg transition-all duration-200 border-2 border-dashed 
                border-pink-300 bg-gradient-to-b from-pink-100 to-purple-100 
                flex flex-col items-center justify-center p-4 active:scale-95"
        >
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-3 shadow-md transition-transform duration-200 hover:scale-110">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-700 text-center">
            Create Story
          </p>
        </div>

        {/* Story Cards */}
        {stories?.map((story, index) => (
          <div
            onClick={() => setViewStory(story)}
            key={index}
            className={`relative rounded-2xl shadow-md min-w-[120px] max-w-[120px] h-[180px] cursor-pointer 
                        hover:shadow-lg transition-all duration-200 overflow-hidden active:scale-95
                        ${story.media_type === 'text' ? 'bg-gradient-to-b from-purple-200 to-pink-200' : ''}`}
          >
            {/* Overlay for image/video */}
            {story.media_type !== 'text' && (
              <div className='absolute inset-0 rounded-lg bg-black overflow-hidden z-0 transition-opacity duration-300 hover:opacity-80'>
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    alt="story"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 opacity-70"
                  />
                ) : story.media_type === "video" ? (
                  <video
                    src={story.media_url}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 opacity-70"
                  />
                ) : null}
              </div>
            )}

            {/* Profile Pic */}
            <img
              src={story.user?.profile_picture}
              alt="profile"
              className="absolute w-10 h-10 top-3 left-3 z-10 rounded-full border-2 border-white shadow-md"
            />

            {/* Story Content */}
            <p className="absolute bottom-8 left-3 right-3 text-gray-700 text-sm font-medium truncate z-10">
              {story.content}
            </p>

            {/* Timestamp */}
            <p className="text-white font-bold absolute bottom-2 left-3 text-xs z-10">
              {moment(story.createdAt).fromNow()}
            </p>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}
      {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
    </div>
  )
}

export default StoriesBar
