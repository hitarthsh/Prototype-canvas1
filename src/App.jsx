import React, { useState } from "react";
import CanvasEditor from "./CanvasEditor";
import TextFormatPanel from "./components/TextFormatPanel";

const App = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [showTextFormat, setShowTextFormat] = useState(false);

  const handleObjectSelected = (object) => {
    setSelectedObject(object);
    setShowTextFormat(object?.type === "textbox");
  };

  const handleFormatChange = (property, value) => {
    if (!selectedObject || selectedObject.type !== "textbox") return;
    selectedObject.set(property, value);
    selectedObject.canvas.renderAll();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 select-none">
      {/* Topbar */}
      <header className="flex items-center justify-between bg-gradient-to-r from-red-600 to-red-500 h-16 px-6 shadow-md text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-2 shadow-sm transition-transform hover:scale-105">
            <span className="text-red-600 text-2xl font-bold">🛕</span>
          </div>
          <span className="text-2xl font-bold tracking-wide">JainCanvas</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium">
            Help
          </button>
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors">
            <span className="text-lg font-bold">👤</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col py-4 px-3 gap-2 shadow-sm">
          <div className="relative mb-4">
            <input
              className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Search..."
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <nav className="flex flex-col gap-1 text-gray-700">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-xl group-hover:scale-110 transition-transform">
                📄
              </span>
              <span className="font-medium">Templates</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-xl group-hover:scale-110 transition-transform">
                🖼️
              </span>
              <span className="font-medium">Assets</span>
            </button>
            <button
              onClick={() => setShowTextFormat(!showTextFormat)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                🔤
              </span>
              <span className="font-medium">Text</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-xl group-hover:scale-110 transition-transform">
                ☁️
              </span>
              <span className="font-medium">Uploads</span>
            </button>
          </nav>

          <div className="mt-6 border-t pt-4 flex flex-col gap-1 text-gray-500">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-xl group-hover:scale-110 transition-transform">
                📁
              </span>
              <span className="font-medium">Projects</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-xl group-hover:scale-110 transition-transform">
                ⚙️
              </span>
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-start p-4 bg-gray-50 h-full overflow-hidden">
          <div className="w-full max-w-6xl">
            <CanvasEditor onObjectSelected={handleObjectSelected} />
          </div>
        </main>

        {/* Text Format Panel */}
        {showTextFormat && (
          <div className="w-64 bg-white border-l p-4 shadow-sm">
            <TextFormatPanel
              onFormatChange={handleFormatChange}
              selectedObject={selectedObject}
            />
          </div>
        )}
      </div>

      {/* Copyright Footer */}
      <footer className="flex justify-between items-center px-6 py-3 text-gray-600 text-sm bg-white border-t">
        <div className="flex items-center gap-2">
          <span className="text-red-500">🛕</span>
          <span>&copy; {new Date().getFullYear()} Hitarth Shah</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="hover:text-red-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-red-500 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-red-500 transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
