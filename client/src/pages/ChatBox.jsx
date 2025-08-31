import React, { useEffect, useRef, useState } from "react"
import { dummyMessagesData, dummyUserData } from "../assets/assets"
import { ImagePlusIcon, LucideSend } from "lucide-react"

const ChatBox = () => {
  const messages = dummyMessagesData
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(dummyUserData)
  const messagesEndRef = useRef(null)

  const sendMessage = async () => {
    
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    user && (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-2 p-2 md:px-10 bg-gradient-to-r from-rose-100 to-purple-100 border-b border-gray-300">
          <img
            src={user.profile_picture}
            alt=""
            className="size-8 rounded-full"
          />
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages
            .slice()
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.to_user_id !== user._id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`p-3 text-sm max-w-xs break-words rounded-2xl shadow 
                    ${
                      message.to_user_id !== user._id
                        ? "bg-white text-gray-800 rounded-bl-none"
                        : "bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-br-none"
                    }`}
                >
                  {message.message_type === "image" && (
                    <img
                    src={message.media_url}
                    className="w-full max-w-sm rounded-lg mb-1 border-none outline-none shadow-none"
                    alt=""
                    />

                  )}
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Box */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 pl-5 p-1.5 w-full max-w-2xl mx-auto border border-gray-200 shadow rounded-full">
            {/* Input */}
            <input
              type="text"
              className="flex-1 outline-none text-slate-700 placeholder-gray-400 text-sm px-2"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />

            {/* Image Upload */}
            <label htmlFor="image">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="h-8 w-8 object-cover rounded"
                />
              ) : (
                <ImagePlusIcon className="size-6 text-gray-400 cursor-pointer" />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="bg-gradient-to-br from-purple-500 to-rose-600 hover:from-purple-700 hover:to-pink-800 active:scale-95 cursor-pointer text-white p-2 rounded-full"
            >
              <LucideSend size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default ChatBox
