import React from "react";
import CanvasEditor from "./CanvasEditor";

const App = () => {
  return (
    <div className="flex flex-col h-screen w-full  bg-gray-100">
      {/* Topbar */}
      <header className="flex items-center justify-between bg-gradient-to-r from-red-700 to-red-500 h-16 px-6 shadow text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
            {/* Logo Placeholder */}
            <span className="text-red-600 text-2xl font-bold">🛕</span>
          </div>
          <span className="text-2xl font-bold tracking-wide">Jaincanvas</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
          {/* Profile Placeholder */}
          <span className="text-lg font-bold">👤</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col py-4 px-2 gap-2 shadow-sm">
          <input
            className="mb-4 px-3 py-2 rounded bg-gray-100 border text-sm"
            placeholder="Search..."
          />
          <nav className="flex flex-col gap-2 text-gray-700 text-2xl">
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
              <span>📄</span> Templates
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
              <span>🖼️</span> Assets
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
              <span>🔤</span> Text
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
              <span>☁️</span> Uploads
            </button>
          </nav>
          <div className="mt-8 border-t pt-4 flex flex-col gap-2 text-gray-500 text-2xl">
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <span>📁</span> Projects
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <span>⚙️</span> Settings
            </button>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex flex-col items-center justify-start p-3 overflow-auto">
          {/* Toolbar */}
          {/* <div className="w-full flex items-center gap-3 bg-white rounded shadow px-4 py-2 text-3xl ">
            <button className="text-red-500">●</button>
            <button className="text-gray-500">⟲</button>
            <button className="text-gray-500">⟲</button>
            <button className="text-gray-500">✏️</button>
            <button className="text-gray-500">🏁</button>
            <button className="text-gray-500">⬜</button>
            <div className="flex-1" />
            <button className="text-gray-500">💾</button>
            <button className="text-gray-500">🗑️</button>
            <button className="text-red-500">⬇️</button>
          </div> */}
          {/* Canvas placeholder */}
          <CanvasEditor />
        </main>
      </div>
      {/* Copyright Footer */}
      <footer className="flex justify-evenly py-2 text-red-500 text-sm bg-gray-400">
        &copy; {new Date().getFullYear()} Hitarth Shah
      </footer>
    </div>
  );
};

export default App;
