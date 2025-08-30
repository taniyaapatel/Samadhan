import React, { useState, useEffect } from 'react';
import { useAnimation } from './hooks/useAnimation'; // Import the custom hook

// Main App Component
export default function App() {
  // --- State Management ---
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // State to trigger the initial load animation
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Use the custom hook to trigger the counter animation
  const isCountAnimating = useAnimation(count);

  // --- Event Handlers ---
  const handleIncrement = () => setCount(prevCount => prevCount + 1);
  const handleDecrement = () => setCount(prevCount => prevCount - 1);
  const handleResetCounter = () => setCount(0);
  const handleTextChange = (event) => setText(event.target.value);
  const handleClearText = () => setText('');

  return (
    // Main container with a soft background and ensuring no scroll
    <div className="bg-rose-50 h-screen w-screen flex items-center justify-center font-sans p-4 overflow-hidden">
      {/* The main card with a load-in animation */}
      <div 
        className={`w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-rose-200/50 p-8 space-y-10 transform transition-all duration-700 ease-out ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
      >
        
        <header className="text-center">
          <h1 className="text-4xl font-bold text-rose-500">useState is Fun!</h1>
          <p className="text-slate-500 mt-2">A cute little state demo ✨</p>
        </header>

        {/* --- Counter Section --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-slate-600 text-center">Counter</h2>
          <div className="flex items-center justify-center gap-5 bg-rose-100/70 p-4 rounded-full">
            <button
              onClick={handleDecrement}
              className="w-14 h-14 bg-rose-400 rounded-full font-bold text-white text-2xl shadow-md shadow-rose-300/80 hover:bg-rose-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:scale-90"
            >
              -
            </button>
            {/* The counter number, which will pop when changed */}
            <span 
              className={`text-6xl font-mono font-bold text-slate-700 w-28 text-center transition-transform duration-300 ${isCountAnimating ? 'transform scale-125 text-rose-500' : 'transform scale-100'}`}
            >
              {count}
            </span>
            <button
              onClick={handleIncrement}
              className="w-14 h-14 bg-indigo-400 rounded-full font-bold text-white text-2xl shadow-md shadow-indigo-300/80 hover:bg-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:scale-90"
            >
              +
            </button>
          </div>
           <div className="text-center mt-4">
             <button
                onClick={handleResetCounter}
                className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors text-sm font-semibold"
              >
                Reset
              </button>
           </div>
        </section>

        {/* --- Live Text Preview Section --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-slate-600 text-center">Live Text Preview</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Type something cute..."
              className="w-full p-3 bg-rose-100/70 border-2 border-transparent rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
            />
            <div className="w-full p-4 bg-slate-800 rounded-xl min-h-[90px] shadow-inner">
              <p className="text-lg text-rose-100 break-words font-mono">{text || '...'}</p>
            </div>
             <div className="text-center">
             <button
                onClick={handleClearText}
                className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors text-sm font-semibold"
              >
                Clear
              </button>
           </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}