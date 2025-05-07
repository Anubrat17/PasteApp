import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaEdit, FaTrashAlt, FaShareAlt, FaClipboard, FaEye, FaWhatsapp, FaTwitter, FaFacebookF, FaEnvelope } from "react-icons/fa";
import { removePaste } from "../Redux/pasteSlice"; // Import removePaste from pasteSlice

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

  const handleDelete = async (pasteId) => {
    try {
      dispatch(removePaste(pasteId)); // Dispatch the removePaste action
      //toast.success("Paste deleted successfully");
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
    <div className="min-h-screen pt-[80px] bg-slate-200 flex flex-col items-center justify-start px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl bg-slate-50 shadow-lg rounded-2xl p-8 flex flex-col space-y-6">
        <input
          aria-label="Search pastes"
          className="p-3 rounded-xl border border-gray-300 bg-slate-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors placeholder:text-gray-500"
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
          <div className="flex flex-col gap-5 mt-5">
            {filteredPastes.map((paste) => (
              <div
                className="border rounded-2xl p-4 shadow-md relative bg-slate-100"
                key={paste._id}
              >
                <div className="absolute top-4 right-4 flex gap-4 z-10">
                  <button
                    aria-label={`Edit paste titled ${paste.title}`}
                    className="bg-blue-500 p-2 rounded-xl hover:bg-blue-600 transition"
                    onClick={() => handleEdit(paste._id)}
                  >
                    <FaEdit className="text-white text-xl" />
                  </button>
                  <button
                    aria-label={`View paste titled ${paste.title}`}
                    className="bg-green-500 p-2 rounded-xl hover:bg-green-600 transition"
                    onClick={() => handleView(paste._id)}
                  >
                    <FaEye className="text-white text-xl" />
                  </button>
                  <button
                    aria-label={`Delete paste titled ${paste.title}`}
                    onClick={() => handleDelete(paste._id)} // Pass paste._id
                    className="p-2 rounded-xl transition text-white text-xl bg-red-500 hover:bg-red-600"
                  >
                    <FaTrashAlt />
                  </button>

                  <button
                    aria-label={`Copy content of paste titled ${paste.title}`}
                    onClick={() => handleCopy(paste?.content)}
                    className="bg-purple-500 p-2 rounded-xl hover:bg-purple-600 transition"
                  >
                    <FaClipboard className="text-white text-xl" />
                  </button>
                  <button
                    aria-label={`Share paste titled ${paste.title}`}
                    className="bg-yellow-500 p-2 rounded-xl hover:bg-yellow-600 transition"
                    onClick={() => toggleShareBox(paste._id)}
                  >
                    <FaShareAlt className="text-white text-xl" />
                  </button>
                </div>

                {shareBoxState[paste._id] && (
                  <div className="absolute inset-0 flex justify-center items-center z-20 bg-slate-100 bg-opacity-70 rounded-2xl p-4">
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

                <div className="flex flex-row justify-between items-start">
                  <div className="flex flex-col w-2/3 break-words">
                    <div className="font-semibold text-lg text-gray-900">
                      {paste.title}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                      {paste.content}
                    </div>
                  </div>
                  <div className="ml-4 text-xs text-gray-500 self-end whitespace-nowrap">
                    {formatDate(paste.createdAt)}
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
