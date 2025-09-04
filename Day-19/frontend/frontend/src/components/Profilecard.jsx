import React from "react";

export default function Profilecard() {
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-4 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-pink-200 flex items-center justify-center text-xl font-bold text-white">
        Y
      </div>
      <p className="mt-2 font-semibold">Your Profile</p>
      <p className="text-sm text-gray-500">Welcome back ✨</p>
    </div>
  );
}
