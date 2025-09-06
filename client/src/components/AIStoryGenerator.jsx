import React, { useState } from "react"

const AIStoryGenerator = ({ onGenerated }) => {
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiImage, setAiImage] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [error, setError] = useState("")

  const handleGenerateAIStory = async () => {
    // Clear previous error
    setError("")
    
    // Validate input
    if (!aiPrompt.trim()) {
      setError("Please enter an idea to generate a story")
      return
    }
    
    setLoadingAI(true)

    try {
      // Call your backend
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      })

      // Check if response is ok
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      // Validate response data
      if (!data) {
        throw new Error("No data received from server")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.imageUrl) {
        setAiImage(data.imageUrl)
        // Notify parent component
        if (onGenerated) {
          onGenerated(data.imageUrl)
        }
      } else {
        throw new Error("No image URL returned from server")
      }
    } catch (err) {
      console.error("AI generation failed:", err)
      setError(err.message || "Failed to generate story. Please try again.")
    } finally {
      setLoadingAI(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loadingAI) {
      handleGenerateAIStory()
    }
  }

  return (
    <div className="p-4 bg-black/20 rounded-lg mt-3">
      <input
        type="text"
        placeholder="Enter your idea..."
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        onKeyPress={handleKeyPress}
        className="px-3 py-2 rounded w-full bg-white/10 mb-2 text-sm"
        disabled={loadingAI}
      />

      {/* Error message */}
      {error && (
        <div className="text-red-400 text-sm mb-2 bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerateAIStory}
        disabled={loadingAI || !aiPrompt.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold disabled:opacity-50 transition-colors"
      >
        {loadingAI ? "Generating... (this may take 1-2 minutes)" : "Create with AI"}
      </button>

      {/* Preview */}
      {aiImage && (
        <div className="mt-3">
          <img
            src={aiImage}
            alt="AI Generated Story"
            className="rounded-lg object-contain max-h-60 w-full"
            onError={(e) => {
              console.error("Failed to load image:", aiImage)
              setError("Failed to load generated image")
              setAiImage(null)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default AIStoryGenerator