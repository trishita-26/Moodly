import React from 'react'

const Loading = ({ height = '100vh' }) => {
  return (
    <div
      style={{ height }}
      className="flex items-center justify-center relative"
    >
      {/* Pulsing Heart */}
      <div className="relative">
        <div className="w-12 h-12 bg-pink-400 animate-pulse-heart"></div>
      </div>

      {/* Sparkles */}
      <span className="absolute -top-6 -left-6 w-2 h-2 bg-pink-300 rounded-full animate-ping"></span>
      <span className="absolute top-0 -right-8 w-2.5 h-2.5 bg-pink-200 rounded-full animate-pulse"></span>
      <span className="absolute bottom-4 -left-10 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></span>
      <span className="absolute bottom-8 right-6 w-2 h-2 bg-pink-300 rounded-full animate-ping"></span>
    </div>
  )
}

export default Loading
