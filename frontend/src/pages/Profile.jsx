import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);

  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch profile on mount
  useEffect(() => {
    // Read token only from localStorage here
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      toast.info("Please login to view your profile");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token: storedToken },
        });

        if (res.data.success) {
          const u = res.data.user;
          setProfile(u);
          setEditForm({
            name: u.name || "",
            email: u.email || "",
          });
        } else {
          toast.error(res.data.message || "Failed to load profile");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [backendUrl, navigate]); // no `token` here

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          name: editForm.name,
          email: editForm.email,
        },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated");
        const u = res.data.user;
        setProfile(u);
        setEditForm({
          name: u.name || "",
          email: u.email || "",
        });
        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="border-t pt-10">
      <div className="text-center text-2xl mb-5">
        <Title text1={"MY"} text2={"PROFILE"} />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white/90 shadow-lg border border-gray-200 rounded-2xl px-6 py-6 sm:px-10 sm:py-8">
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading profile...</p>
          ) : !profile ? (
            <p className="text-gray-500 text-center py-6">
              Unable to load profile details.
            </p>
          ) : (
            <>
              {/* User avatar + basic info */}
              {!isEditing && (
                <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-900">
                      {profile.name}
                    </p>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                  </div>
                </div>
              )}

              {/* View mode: field/value rows */}
              {!isEditing && (
                <>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3">
                      <span className="w-full sm:w-40 text-xs sm:text-sm font-medium text-gray-500">
                        User ID
                      </span>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-900 break-all">
                        {profile.user_id}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3">
                      <span className="w-full sm:w-40 text-xs sm:text-sm font-medium text-gray-500">
                        Name
                      </span>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-900">
                        {profile.name}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3">
                      <span className="w-full sm:w-40 text-xs sm:text-sm font-medium text-gray-500">
                        Email
                      </span>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-900">
                        {profile.email}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3">
                      <span className="w-full sm:w-40 text-xs sm:text-sm font-medium text-gray-500">
                        Created At
                      </span>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-900">
                        {formatDate(profile.created_at)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3">
                      <span className="w-full sm:w-40 text-xs sm:text-sm font-medium text-gray-500">
                        Updated At
                      </span>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-900">
                        {formatDate(profile.updated_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="px-5 py-2.5 text-sm font-medium rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 text-sm font-medium rounded-full border border-gray-900 bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}

              {/* Edit mode */}
              {isEditing && (
                <form onSubmit={handleSave} className="space-y-6 mt-2">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-4 sm:px-5 sm:py-5 space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/80 focus:border-gray-900"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/80 focus:border-gray-900"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-2 text-sm font-medium rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-sm font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
