import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

import api from '../api/axios'; // Make sure this path is correct
import Loading from '../components/Loading';
import UserProfileInfo from '../components/UserProfileInfo';
import Postcard from '../components/Postcard';
import ProfileModal from '../components/ProfileModal';

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEdit, setShowEdit] = useState(false);

  // Fetch user data
  const fetchUser = useCallback(async (id) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        '/api/user/profiles',
        { profileId: id },
        { headers: { Authorization: `Bearer ${token}` } } // fixed typo
      );

      if (data.success) {
        setUser(data.profile);
        setPosts(data.posts || []);
      } else {
        toast.error(data.message || 'Failed to fetch user');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  }, [getToken]);

  useEffect(() => {
    if (profileId) fetchUser(profileId);
    else if (currentUser?._id) fetchUser(currentUser._id);
  }, [profileId, currentUser, fetchUser]);

  if (!user) return <Loading />;

  return (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-rose-300 rounded-2xl shadow overflow-hidden">
          {/* Cover Photo */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-pink-200 via-purple-300 to-red-300">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* User Info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
            {['posts', 'media', 'likes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'posts' && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.length > 0 ? (
                posts.map((post) => <Postcard key={post._id} post={post} />)
              ) : (
                <p className="text-gray-500 mt-4">No posts yet</p>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="flex flex-wrap mt-6 max-w-6xl gap-4">
              {posts
                .filter((post) => post.image_urls?.length > 0)
                .map((post) =>
                  post.image_urls.map((image, index) => (
                    <Link
                      target="_blank"
                      to={image}
                      key={`${post._id}-${index}`}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt="Post media"
                        className="w-64 aspect-square object-cover"
                      />
                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))
                )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="mt-6 text-center text-gray-500">
              No likes to display
            </div>
          )}
        </div>
      </div>

      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  );
};

export default Profile;
