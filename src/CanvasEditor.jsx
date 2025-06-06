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

  const handleCanvasReady = useCallback((newCanvas) => {
    canvasRef.current = newCanvas;
    setCanvas(newCanvas);
  }, []);

  const handleObjectModified = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.renderAll();
    }
  }, []);

  const handleToolChange = useCallback((tool) => {
    setActiveTool(tool);
    if (!canvasRef.current) return;

    switch (tool) {
      case "text":
        handleAddText(canvasRef);
        break;
      case "rectangle":
        handleAddRectangle(canvasRef);
        break;
      case "circle":
        handleAddCircle(canvasRef);
        break;
      default:
        break;
    }
  }, []);

  const handleImageUploadWrapper = useCallback((event) => {
    handleImageUpload(event, canvasRef);
  }, []);

  const handleDeleteWrapper = useCallback(() => {
    handleDelete(canvasRef);
  }, []);

  const handleUndoWrapper = useCallback(() => {
    handleUndo(canvasRef);
  }, []);

  const handleRedoWrapper = useCallback(() => {
    handleRedo(canvasRef);
  }, []);

  const handleExportWrapper = useCallback((format) => {
    handleExport(format, canvasRef);
  }, []);

  return (
    <div className="flex h-full bg-amber-500 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex-1 flex flex-col">
        <Toolbar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          onAddText={() => handleAddText(canvasRef)}
          onAddRectangle={() => handleAddRectangle(canvasRef)}
          onAddCircle={() => handleAddCircle(canvasRef)}
          onAddImage={() => fileInputRef.current?.click()}
          onDelete={handleDeleteWrapper}
          onUndo={handleUndoWrapper}
          onRedo={handleRedoWrapper}
          onExport={handleExportWrapper}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUploadWrapper}
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
            onLayerUpdate={handleObjectModified}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
