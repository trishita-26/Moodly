import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import toast, {Toaster } from 'react-hot-toast'
import AIStoryGenerator from './AIStoryGenerator'

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColor = [
    "linear-gradient(135deg, #f9d423, #ff4e50)",
    "linear-gradient(135deg, #24c6dc, #514a9d)",
    "linear-gradient(135deg, #ff9966, #ff5e62)",
    "linear-gradient(135deg, #7f00ff, #e100ff)",
    "linear-gradient(135deg, #56ab2f, #a8e063)",
    "linear-gradient(135deg, #43cea2, #185a9d)",
    "linear-gradient(135deg, #ffafbd, #ffc3a0)",
    "linear-gradient(135deg, #00c6ff, #0072ff)",
    "linear-gradient(135deg, #f7971e, #ffd200)",
    "linear-gradient(135deg, #c6ffdd, #fbd786, #f7797d)",
  ];

  const [mode, setMode] = useState("text")
  const [background, setBackground] = useState(bgColor[0])
  const [text, setText] = useState("")
  const [media, setMedia] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setMedia(file)
      setPreview(URL.createObjectURL(file))
    }
  }

const handleCreateStory = async () => {
  console.log({ text, media, background, preview });

  await new Promise((resolve) => setTimeout(resolve, 500)); 
  setShowModal(false);
  fetchStories && fetchStories();
}

  return (
    <div className='fixed inset-0 z-50 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* header */}
        <div className='text-center mb-4 flex items-center justify-between'>
          <button onClick={() => setShowModal(false)} className='text-white p-2 cursor-pointer'>
            <ArrowLeft />
          </button>
          <h2 className='text-lg font-semibold'>Create Story</h2>
          <span className='w-10'></span>
        </div>

        {/* story preview */}
        <div className='rounded-lg h-96 flex items-center justify-center relative overflow-hidden' style={{ background: background }}>
          {mode === 'text' && (
            <textarea
              className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none text-center'
              placeholder='What is your mood today?'
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === 'media' && preview && (
            media?.type.startsWith("image") ? (
              <img src={preview} alt="story-preview" className='object-contain max-h-full' />
            ) : (
              <video src={preview} controls className='object-contain max-h-full' />
            )
          )}

          {mode === 'ai' && preview && (
            <img src={preview} alt="AI story" className='object-contain max-h-full rounded' />
          )}
        </div>

        {/* color buttons */}
        {mode === "text" && (
          <div className='flex mt-4 gap-2 flex-wrap'>
            {bgColor.map((color) => (
              <button
                key={color}
                className='w-6 h-6 rounded-full ring cursor-pointer'
                style={{ background: color }}
                onClick={() => setBackground(color)}
              ></button>
            ))}
          </div>
        )}

        {/* media input + action */}
        <div className='mt-4 flex items-center justify-between'>
          <div className='flex gap-2'>
            <button onClick={() => setMode("text")} className={`px-3 py-1 rounded ${mode === "text" ? "bg-white/20" : ""}`}>Text</button>
            <label className='px-3 py-1 rounded cursor-pointer bg-white/20'>
              Media
              <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} hidden />
            </label>
            <button
            onClick={() => setMode("ai")}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
            mode === "ai" ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-700"
              }`}
             >
             AI
            </button>

          </div>
        <button
     onClick={() =>
    toast.promise(handleCreateStory(), {
      loading: 'Saving...',
      success: 'Vibe Added!!',
      error: (e) =><p> e.message </p>,
    })
  }
  className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold'
>
  Share
</button>


        </div>

        {/* AI input field */}
        {mode === "ai" && (
          <AIStoryGenerator onGenerated={(img) => setPreview(img)} />
        )}
      </div>
    </div>
  )
}

export default StoryModal
