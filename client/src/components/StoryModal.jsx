import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AIStoryGenerator from './AIStoryGenerator';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
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

  const { getToken } = useAuth();
  const MAX_VIDEO_DURATION = 60; // seconds
  const MAX_VIDEO_SIZE_MB = 50; // MB

  const [mode, setMode] = useState("text"); // text | media | ai
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle media upload
  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("video")) {
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        toast.error(`Video cannot exceed ${MAX_VIDEO_SIZE_MB} MB`);
        setMedia(null);
        setPreview(null);
        return;
      }

      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_VIDEO_DURATION) {
          toast.error("Video duration cannot exceed 1 minute");
          setMedia(null);
          setPreview(null);
        } else {
          setMedia(file);
          setPreview(URL.createObjectURL(file));
          setText("");
          setMode("media");
        }
      };
      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith("image")) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
      setText("");
      setMode("media");
    }
  };

  // Handle story creation
  const handleCreateStory = async () => {
    // Determine media type
    const mediaType =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : mode === "ai"
        ? "image"
        : "text";

    // Validation: text story cannot be empty
    if (mode === "text" && !text.trim()) {
      toast.error("Please write something about your mood");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    if (mode === "text") formData.append("content", text.trim());
    if ((mode === "media" || mode === "ai") && media) formData.append("media", media);
    formData.append("media_type", mediaType);
    formData.append("background_color", background);

    try {
      const token = await getToken();
      const { data } = await api.post("/api/story/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setShowModal(false);
        fetchStories();
        toast.success("Story added successfully!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save story");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen bg-black/80 backdrop-blur text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setShowModal(false)} className="p-2 text-white">
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        {/* Story Preview */}
        <div
          className="relative flex items-center justify-center h-96 overflow-hidden rounded-lg"
          style={{ background }}
        >
          {mode === "text" && (
            <textarea
              className="w-full h-full p-6 text-lg text-center bg-transparent resize-none focus:outline-none"
              placeholder="What is your mood today?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          {mode === "media" && preview && (
            media?.type.startsWith("image") ? (
              <img src={preview} alt="story-preview" className="object-contain max-h-full" />
            ) : (
              <video src={preview} controls className="object-contain max-h-full" />
            )
          )}

          {mode === "ai" && preview && (
            <img src={preview} alt="AI story" className="object-contain max-h-full rounded" />
          )}
        </div>

        {/* Background color picker */}
        {mode === "text" && (
          <div className="flex flex-wrap gap-2 mt-4">
            {bgColors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-full ring cursor-pointer"
                style={{ background: color }}
                onClick={() => setBackground(color)}
              />
            ))}
          </div>
        )}

        {/* Mode buttons + Share */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("text")}
              className={`px-3 py-1 rounded ${mode === "text" ? "bg-white/20" : ""}`}
            >
              Text
            </button>

            <label className="px-3 py-1 rounded bg-white/20 cursor-pointer">
              Media
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                hidden
              />
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
            disabled={mode === "ai" && !preview}
            onClick={handleCreateStory}
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Share
          </button>
        </div>

        {/* AI Story Generator */}
        {mode === "ai" && <AIStoryGenerator onGenerated={(img) => setPreview(img)} />}
      </div>
    </div>
  );
};

export default StoryModal;
