import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import api from "../api/axios"; // ✅ backend axios instance
import { useAuth } from "@clerk/clerk-react"; // ✅ token lene ke liye

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { getToken } = useAuth();

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const res = await api.get("/messages/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data.messages || []); // ✅ backend se aa raha data
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h2 className="font-semibold text-slate-800 mb-4">Recent Messages</h2>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Link
              to={`/messages/${message.from_user_id._id}`}
              key={index}
              className="flex items-start gap-2 py-2 hover:bg-slate-100"
            >
              <img
                src={message.from_user_id.profile_picture}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="font-medium">{message.from_user_id.full_name}</p>
                  <p className="text-[10px] text-slate-400">
                    {moment(message.createdAt).fromNow()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    {message.text ? message.text : "Media"}
                  </p>
                  {!message.seen && (
                    <p className="bg-rose-400 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                      1
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-slate-400 text-center">No recent messages</p>
        )}
      </div>
    </div>
  );
};

export default RecentMessages;
