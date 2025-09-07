import React, { useState, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Image, X } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const CreatePost = ({ fetchPosts }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

const handlePost = async () => {
  if (!text && !image) {
    toast.error("Write something or add an image first!");
    return;
  }

  try {
    setLoading(true);
    const token = await getToken();

    let postType = "text";
if (image && text) postType = "text+image";
else if (image) postType = "image";

const formData = new FormData();
formData.append("content", text);
if (image) formData.append("image", image);
formData.append("post_type", postType);


    

    const res = await api.post("/api/post/add", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      toast.success("Post published 🎉");
      setText("");
      setImage(null);
      fetchPosts && fetchPosts();
    } else {
      toast.error(res.data.message || "Failed to publish post ❌");
    }
  } catch (error) {
    console.log("POST ERROR:", error.response?.data || error.message);
    toast.error("Failed to publish post ❌");
  } finally {
    setLoading(false);
  }
};


  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-pink-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Create Post
        </h2>

        <div className="flex items-center gap-3 mb-3">
          <img
            src={user.imageUrl}
            alt="profile"
            className="w-11 h-11 rounded-full border-2 border-pink-400"
          />
          <span className="font-semibold text-gray-700">{user.fullName}</span>
        </div>

        <textarea
          placeholder={`What's on your mood, ${user.firstName}?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
          rows="3"
        />

        {image && (
          <div className="relative mt-3">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="rounded-xl max-h-56 object-cover"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 text-pink-500 hover:text-purple-600 transition"
          >
            <Image size={20} /> Add Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handlePost}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
