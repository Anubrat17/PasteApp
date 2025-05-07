import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaShareAlt,
  FaClipboard,
  FaEye,
  FaWhatsapp,
  FaTwitter,
  FaFacebookF,
  FaEnvelope,
} from "react-icons/fa";
import { removePaste } from "../Redux/pasteSlice";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareBoxState, setShareBoxState] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleDelete = (pasteId) => {
    try {
      dispatch(removePaste(pasteId));
    } catch (error) {
      toast.error("Failed to delete paste");
    }
  };

  const handleCopy = (content) => {
    if (!navigator.clipboard) {
      toast.error("Clipboard not supported");
      return;
    }
    navigator.clipboard
      .writeText(content)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  const handleEdit = (pasteId) => {
    navigate(`/?pasteId=${pasteId}`);
  };

  const handleView = (pasteId) => {
    navigate(`/pastes/${pasteId}`);
  };

  const handleShare = (paste, platform) => {
    const url = window.location.href;
    const encodedContent = encodeURIComponent(paste?.content);
    const encodedTitle = encodeURIComponent(paste?.title);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedContent} ${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedContent} ${url}`,
    };

    window.open(shareUrls[platform], "_blank");
    setShareBoxState((prev) => ({
      ...prev,
      [paste._id]: false,
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [pastes]);

  const toggleShareBox = (pasteId) => {
    setShareBoxState((prevState) => ({
      ...prevState,
      [pasteId]: !prevState[pasteId],
    }));
  };

  return (
    <div className="min-h-screen pt-[80px] bg-slate-200 flex flex-col items-center px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <input
          aria-label="Search pastes"
          className="p-3 rounded-xl border border-gray-300 bg-slate-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 w-full"
          type="search"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <div className="py-20 text-center text-gray-600 font-semibold">
            Loading pastes...
          </div>
        ) : filteredPastes.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredPastes.map((paste) => (
              <div
                className="border rounded-2xl p-4 shadow relative bg-slate-100"
                key={paste._id}
              >
                {shareBoxState[paste._id] && (
                  <div className="absolute inset-0 flex justify-center items-center z-20 bg-slate-100 bg-opacity-90 rounded-2xl p-4">
                    <div className="relative w-full max-w-xs mx-auto bg-white rounded-xl p-4 shadow-xl flex flex-col gap-2">
                      <button
                        onClick={() => toggleShareBox(paste._id)}
                        aria-label="Close share options"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full"
                      >
                        ✖
                      </button>
                      <span className="font-semibold text-center text-black">
                        Share this paste:
                      </span>
                      <button
                        onClick={() => handleShare(paste, "whatsapp")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-md hover:bg-green-200 text-black"
                      >
                        <FaWhatsapp className="text-green-500" /> WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare(paste, "twitter")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200 text-black"
                      >
                        <FaTwitter className="text-blue-500" /> Twitter
                      </button>
                      <button
                        onClick={() => handleShare(paste, "facebook")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-200 rounded-md hover:bg-blue-300 text-black"
                      >
                        <FaFacebookF className="text-blue-600" /> Facebook
                      </button>
                      <button
                        onClick={() => handleShare(paste, "email")}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 text-black"
                      >
                        <FaEnvelope className="text-red-500" /> Email
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  {/* Text Section */}
                  <div className="flex flex-col flex-1 break-words">
                    <div className="font-semibold text-lg text-gray-900">
                      {paste.title}
                    </div>
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                      {paste.content}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {formatDate(paste.createdAt)}
                    </div>
                  </div>

                  {/* Button Row */}
                  <div className="w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-nowrap">
                      <button
                        onClick={() => handleEdit(paste._id)}
                        className="bg-blue-500 p-3 rounded-xl hover:bg-blue-600 transition flex-shrink-0"
                      >
                        <FaEdit className="text-white text-xl" />
                      </button>
                      <button
                        onClick={() => handleView(paste._id)}
                        className="bg-green-500 p-3 rounded-xl hover:bg-green-600 transition flex-shrink-0"
                      >
                        <FaEye className="text-white text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(paste._id)}
                        className="bg-red-500 p-3 rounded-xl hover:bg-red-600 transition flex-shrink-0"
                      >
                        <FaTrashAlt className="text-white text-xl" />
                      </button>
                      <button
                        onClick={() => handleCopy(paste.content)}
                        className="bg-purple-500 p-3 rounded-xl hover:bg-purple-600 transition flex-shrink-0"
                      >
                        <FaClipboard className="text-white text-xl" />
                      </button>
                      <button
                        onClick={() => toggleShareBox(paste._id)}
                        className="bg-yellow-500 p-3 rounded-xl hover:bg-yellow-600 transition flex-shrink-0"
                      >
                        <FaShareAlt className="text-white text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-500 font-medium">
            No pastes found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Paste;
