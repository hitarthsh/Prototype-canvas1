import React, { useState, useCallback, useRef } from "react";
import {
  Canvas as FabricCanvas,
  Textbox,
  Rect,
  Circle,
  Image as FabricImage,
} from "fabric";
import {
  handleAddCircle,
  handleAddRectangle,
  handleAddText,
  handleImageUpload,
  handleDelete,
  handleUndo,
  handleRedo,
  handleExport,
} from "./allfun.js";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import LayerPanel from "./components/LayerPanel";

const CanvasEditor = () => {
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);
  const [activeTool, setActiveTool] = useState("text");
  const fileInputRef = useRef(null);

  return (
    <div className="flex h-full bg-amber-500 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex-1 flex flex-col">
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onAddText={handleAddText}
          onAddRectangle={handleAddRectangle}
          onAddCircle={handleAddCircle}
          onAddImage={() => fileInputRef.current?.click()}
          onDelete={handleDelete}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onExport={handleExport}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <div className="flex-1 flex">
          <Canvas
            onCanvasReady={handleCanvasReady}
            onObjectModified={handleObjectModified}
          />
          <LayerPanel
            canvas={canvasRef.current}
            onLayerUpdate={handleLayerUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
