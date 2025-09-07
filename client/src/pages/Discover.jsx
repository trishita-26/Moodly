import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';
import api from '../api/axios';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../feature/user/userSlice';
import toast from 'react-hot-toast'; // Assuming you use react-hot-toast

const Discover = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        setUsers([]);
        setLoading(true);
        const token = await getToken();
        const { data } = await api.post('/api/user/discover', { input }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        data.success ? setUsers(data.users) : toast.error(data.message);
        setLoading(false);
        setInput('');
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    }
  };

  // NEW: Function to handle following a user
  const handleFollow = async (userIdToFollow) => {
    try {
      const token = await getToken();
      const { data } = await api.post(`/api/user/follow/${userIdToFollow}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        // After following, re-fetch the current user's data to update their following list
        dispatch(fetchUser(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token));
    });
    // Removed the empty array dependency to match your original code, but consider if this should run only once.
  });

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-400 mb-2">Discover People</h1>
          <p className="text-pink-400">Find the same VIBE </p>
        </div>

        {/*Search Bar */}
        <div className='mb-6 shadow-md rounded-md border-slate-200/60 bg-pink-100'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
              <input type="text" placeholder='Search people by name, username, and even mood' className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm' onChange={(e) => setInput(e.target.value)} value={input} onKeyUp={handleSearch} />
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-6'>
          {users.map((user) => (
            // UPDATED: Pass the handleFollow function as a prop
            <UserCard user={user} key={user._id} handleFollow={handleFollow} />
          ))}
        </div>
        {
          loading && (<Loading height='60vh' />)
        }
      </div>
    </div>
  );
};

export default Discover;