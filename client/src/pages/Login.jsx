import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Background */}
      <img
        src={assets.bgImage}
        alt="background"
        className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
      />

      {/* Left side - Hero Section */}
      <div className="flex-1 flex flex-col justify-between px-8 md:px-16 lg:pl-32 py-10">
        
        {/* Logo */}
        <div>
          <img
            src={assets.logo}
            alt="logo"
            className="h-20 object-contain mix-blend-multiply"
          />
        </div>

        {/* Hero Text */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-700 leading-tight max-w-xl">
            One tap, and your MOOD comes alive
          </h1>
          <p className="text-lg md:text-2xl text-pink-600 max-w-md">
            Your vibes have been waiting patiently 🌙✨
          </p>
        </div>

        {/* Testimonial */}
        <div className="flex items-center gap-3">
          <img src={assets.group_users} alt="" className="h-6 md:h-8" />
          <div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 md:w-5 md:h-5 text-amber-500"
                  fill="#f59e0b"
                  stroke="#f59e0b"
                />
              ))}
            </div>
            <p className="text-sm text-gray-700">Loved By 1M+ users</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default Login
