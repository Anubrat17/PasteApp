import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPaste, updatePaste } from "../Redux/pasteSlice";
import { toast } from "react-hot-toast";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");

  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);

  useEffect(() => {
    setLoading(true);
    setTitle("");
    setValue("");

    if (pasteId) {
      const paste = allPastes.find((paste) => paste._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      } else {
        setSearchParams({});
      }
    }

    const timeout = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timeout);
  }, [pasteId, allPastes, setSearchParams]);

  const createPaste = () => {
    if (!title.trim() || !value.trim()) {
      toast.error("Title and content cannot be empty!");
      return;
    }

    const paste = {
      title,
      content: value,
      _id: pasteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updatePaste(paste));
    } else {
      dispatch(addPaste(paste));
    }

    setTitle("");
    setValue("");
    setSearchParams({});
  };

  return (
    <div className="bg-slate-200 pt-[80px] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-slate-50 shadow-lg rounded-2xl p-8 flex flex-col space-y-6">
        {loading ? (
          <div className="text-center text-gray-500 py-40">Loading...</div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <input
                type="text"
                placeholder="Enter title here"
                className="flex-1 p-3 rounded-xl bg-slate-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                onClick={createPaste}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                {pasteId ? "Update My Paste" : "Create My Paste"}
              </button>
            </div>
            <textarea
              className="w-full h-[400px] p-4 rounded-xl bg-slate-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              value={value}
              placeholder="Enter content here"
              onChange={(e) => setValue(e.target.value)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
