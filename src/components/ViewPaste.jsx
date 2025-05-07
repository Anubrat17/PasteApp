import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewPaste = () => {
  const { id } = useParams();

  const allPastes = useSelector((state) => state.paste.pastes);
  const paste = allPastes.find((paste) => paste._id === id);

  if (!paste) {
    return (
      <div className="text-center text-red-500 text-lg">Paste not found</div>
    );
  }

  return (
    <div className="h-screen pt-[80px] bg-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-slate-50 shadow-lg rounded-2xl p-8 flex flex-col space-y-6">
        <div className="flex flex-row justify-between gap-4">
          <input
            type="text"
            placeholder="Enter title here"
            className="p-4 rounded-xl w-full border border-gray-300 bg-slate-200 text-lg font-semibold text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={paste.title}
            disabled
          />
        </div>

        <div className="mt-8">
          <textarea
            className="w-full mt-4 p-6 rounded-2xl border border-gray-300 bg-slate-100 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm text-gray-700"
            value={paste.content}
            placeholder="Enter content here"
            disabled
            rows={15}
          />
        </div>

        <div className="mt-6 text-xs text-gray-500 text-right">
          <span>{new Date(paste.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewPaste;
