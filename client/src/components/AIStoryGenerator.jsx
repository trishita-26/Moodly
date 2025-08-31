import React, { useState } from "react"

const AIStoryGenerator = ({ onGenerated }) => {
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiImage, setAiImage] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const handleGenerateAIStory = async () => {
    if (!aiPrompt.trim()) return
    setLoadingAI(true)

    // 🚀 yahan future me backend API call se image laana hai
    setTimeout(() => {
      const dummyImg =
        "https://via.placeholder.com/400x600.png?text=AI+Generated+Story"
      setAiImage(dummyImg)
      setLoadingAI(false)

      // parent ko notify karo (StoryModal)
      if (onGenerated) onGenerated(dummyImg)
    }, 2000)
  }

  return (
    <div className="p-4 bg-black/20 rounded-lg mt-3">
      <input
        type="text"
        placeholder="Enter your idea..."
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        className="px-3 py-2 rounded w-full bg-white/10 mb-2 text-sm"
      />

      <button
        onClick={handleGenerateAIStory}
        className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
      >
        {loadingAI ? "Generating..." : "Create with AI"}
      </button>

      {/* Preview */}
      {aiImage && (
        <div className="mt-3">
          <img
            src={aiImage}
            alt="AI Story"
            className="rounded-lg object-contain max-h-60 w-full"
          />
        </div>
      )}
    </div>
  )
}

export default AIStoryGenerator
