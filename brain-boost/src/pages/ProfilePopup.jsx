import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePopup = () => {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        setUser(null);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:5000/api/avatar/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.avatar) {
        setUser((prev) => ({ ...prev, avatar: data.avatar }));
      }
    } catch (err) {
      console.error("❌ Avatar upload failed:", err);
    }
  };

  const avatarUrl = user?.avatar
    ? `http://localhost:5000/${user.avatar}`
    : "https://ui-avatars.com/api/?name=U";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Avatar trigger */}
      <img
        src={avatarUrl}
        alt="Avatar"
        className="h-9 w-9 rounded-full cursor-pointer border hover:opacity-80"
        onClick={() => fileInputRef.current?.click()}
        title="Click to change avatar"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* Popup */}
      <AnimatePresence>
        {visible && user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg p-4 border z-[9999]"
          >
            <h3 className="font-semibold text-lg mb-2">User Info</h3>
            <p className="text-sm"><strong>Name:</strong> {user.name}</p>
            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePopup;
