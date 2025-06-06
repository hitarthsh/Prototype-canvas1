import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUnlock,
  FaLayerGroup,
} from "react-icons/fa";

const LayerPanel = ({ canvas, onLayerUpdate }) => {
  const [layers, setLayers] = useState([]);
  const [autoLayer, setAutoLayer] = useState(false);
  const [draggedLayer, setDraggedLayer] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const newLayers = objects.map((obj, index) => ({
        id: obj.id || `layer-${index}`,
        name: obj.type || "Layer",
        object: obj,
        visible: !obj.invisible,
        locked: obj.selectable === false,
      }));
      setLayers(newLayers);
    };

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);

    updateLayers();

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
    };
  }, [canvas]);

  const handleDragStart = (e, index) => {
    if (autoLayer) return;
    setDraggedLayer(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (autoLayer || draggedLayer === null) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (autoLayer || draggedLayer === null) return;

    const objects = canvas.getObjects();
    const draggedObject = objects[draggedLayer];

    if (draggedObject) {
      canvas.remove(draggedObject);
      const updatedObjects = canvas.getObjects();
      const newIndex = Math.min(index, updatedObjects.length);
      canvas.add(draggedObject);
      draggedObject.set("zIndex", newIndex);

      const allObjects = canvas.getObjects();
      allObjects.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      allObjects.forEach((obj) => {
        canvas.remove(obj);
        canvas.add(obj);
      });

      canvas.renderAll();
      onLayerUpdate();
    }

    setDraggedLayer(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedLayer(null);
    setDragOverIndex(null);
  };

  const toggleVisibility = (layer) => {
    if (!canvas) return;
    const obj = layer.object;
    obj.set("invisible", !obj.invisible);
    canvas.renderAll();
    onLayerUpdate();
  };

  const toggleLock = (layer) => {
    if (!canvas) return;
    const obj = layer.object;
    obj.set({
      selectable: obj.selectable === false,
      evented: obj.selectable === false,
    });
    canvas.renderAll();
    onLayerUpdate();
  };

  const moveLayer = (index, direction) => {
    if (!canvas || autoLayer) return;
    const objects = canvas.getObjects();
    const obj = objects[index];

    if (obj) {
      const currentZIndex = obj.zIndex || index;
      const newZIndex =
        direction === -1 ? currentZIndex + 1 : currentZIndex - 1;
      obj.set("zIndex", newZIndex);

      const allObjects = canvas.getObjects();
      allObjects.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      allObjects.forEach((obj) => {
        canvas.remove(obj);
        canvas.add(obj);
      });

      canvas.renderAll();
      onLayerUpdate();
    }
  };

  const toggleAutoLayer = () => {
    if (!canvas) return;
    const newAutoLayer = !autoLayer;
    setAutoLayer(newAutoLayer);

    if (newAutoLayer) {
      const objects = canvas.getObjects();
      const sortedObjects = [...objects].sort((a, b) => {
        const typeOrder = { text: 0, rect: 1, circle: 2, image: 3 };
        const typeA = typeOrder[a.type] ?? 4;
        const typeB = typeOrder[b.type] ?? 4;
        if (typeA !== typeB) return typeA - typeB;
        return (a.timestamp || 0) - (b.timestamp || 0);
      });

      objects.forEach((obj) => canvas.remove(obj));
      sortedObjects.forEach((obj) => canvas.add(obj));
      canvas.renderAll();
      onLayerUpdate();
    }
  };

  return (
    <div className="w-64 bg-white border-l p-4 overflow-y-auto text-black">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Layers</h3>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-lg transition-colors ${
              autoLayer
                ? "bg-red-50 text-red-500"
                : "hover:bg-gray-100 text-gray-900"
            }`}
            onClick={toggleAutoLayer}
            title="Toggle Auto Layer"
          >
            <FaLayerGroup className="text-current" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {
              const activeObject = canvas.getActiveObject();
              if (activeObject) {
                canvas.bringToFront(activeObject);
                canvas.renderAll();
                onLayerUpdate();
              }
            }}
            title="Bring to Front"
          >
            <FaLayerGroup className="text-gray-950" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {
              const activeObject = canvas.getActiveObject();
              if (activeObject) {
                canvas.sendToBack(activeObject);
                canvas.renderAll();
                onLayerUpdate();
              }
            }}
            title="Send to Back"
          >
            <FaLayerGroup className="text-gray-900 rotate-180" />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            draggable={!autoLayer}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
              canvas.getActiveObject() === layer.object
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50"
            } ${
              draggedLayer === index
                ? "opacity-50 cursor-grabbing"
                : "cursor-grab"
            } ${
              dragOverIndex === index
                ? "border-2 border-blue-400 bg-blue-50"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility(layer)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {layer.visible ? (
                  <FaEye className="text-gray-950" />
                ) : (
                  <FaEyeSlash className="text-gray-700" />
                )}
              </button>
              <button
                onClick={() => toggleLock(layer)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {layer.locked ? (
                  <FaLock className="text-gray-950" />
                ) : (
                  <FaUnlock className="text-gray-800" />
                )}
              </button>
              <span className="text-sm font-medium truncate max-w-[100px]">
                {layer.name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveLayer(index, -1)}
                disabled={index === layers.length - 1 || autoLayer}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Move Up"
              >
                ↑
              </button>
              <button
                onClick={() => moveLayer(index, 1)}
                disabled={index === 0 || autoLayer}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Move Down"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;
