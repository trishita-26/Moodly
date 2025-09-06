import React, { useState } from "react"
import toast from "react-hot-toast"
import api from "../api/axios" // ✅ same axios instance jo CreatePost mein use ho raha hai

const AIStoryGenerator = ({ onGenerated }) => {
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiImage, setAiImage] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const handleGenerateAIStory = async () => {
    if (!aiPrompt.trim()) {
      return Promise.reject(new Error("Please enter a prompt."))
    }

    setLoadingAI(true)

    try {
      // ✅ Axios instance handle karega baseURL (http://localhost:4000 ya proxy)
      const { data } = await api.post("/api/ai/generate", { prompt: aiPrompt })

      if (data.imageUrl) {
        setAiImage(data.imageUrl)

        // parent ko notify karo (StoryModal)
        if (onGenerated) onGenerated(data.imageUrl)

        return Promise.resolve()
      } else {
        return Promise.reject(new Error("No image generated."))
      }
    } catch (error) {
      return Promise.reject(
        error.response?.data?.error || error.message || "AI generation failed."
      )
    } finally {
      setLoadingAI(false)
    }
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
        disabled={loadingAI}
        onClick={() =>
          toast.promise(handleGenerateAIStory(), {
            loading: "Generating...",
            success: "AI Story Generated 🎉",
            error: (err) => err.message || "Oops, something went wrong!",
          })
        }
        className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold disabled:opacity-50"
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
