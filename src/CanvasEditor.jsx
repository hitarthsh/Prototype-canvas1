import React, { useEffect, useRef, useState } from "react";
import {
  FaFont,
  FaSquareFull,
  FaCircle,
  FaTrash,
  FaDownload,
  FaImage,
  FaBold,
  FaItalic,
  FaUnderline,
  FaRedo,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLayerGroup,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import {
  Canvas,
  Textbox,
  Rect,
  Circle,
  Group,
  Image as FabricImage,
} from "fabric";

const LayerPanel = ({ canvas, onLayerUpdate }) => {
  const [layers, setLayers] = useState([]);
  const [autoLayer, setAutoLayer] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      let sortedObjects = [...objects];

      if (autoLayer) {
        // Sort objects by type and creation time
        sortedObjects.sort((a, b) => {
          // First sort by type
          const typeOrder = {
            textbox: 0,
            rect: 1,
            circle: 2,
            image: 3,
          };

          const typeA = typeOrder[a.type] ?? 999;
          const typeB = typeOrder[b.type] ?? 999;

          if (typeA !== typeB) {
            return typeA - typeB;
          }

          // If same type, sort by creation time (newer on top)
          return (b.timestamp || 0) - (a.timestamp || 0);
        });
      }

      setLayers(
        sortedObjects.map((obj, index) => ({
          id: obj.id || `layer-${index}`,
          name: obj.type || "Layer",
          visible: !obj.invisible,
          locked: obj.selectable === false,
          object: obj,
        }))
      );
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
  }, [canvas, autoLayer]);

  const toggleVisibility = (layer) => {
    layer.object.set("invisible", !layer.object.invisible);
    canvas.renderAll();
    onLayerUpdate();
  };

  const toggleLock = (layer) => {
    layer.object.set("selectable", layer.object.selectable === false);
    canvas.renderAll();
    onLayerUpdate();
  };

  const moveLayer = (index, direction) => {
    const object = layers[index].object;
    const objects = canvas.getObjects();
    const currentIndex = objects.indexOf(object);
    const newIndex = direction === -1 ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < objects.length) {
      // Remove object from current position
      canvas.remove(object);
      // Add it back at the new position
      canvas.add(object);
      canvas.renderAll();
      onLayerUpdate();
    }
  };

  const toggleAutoLayer = () => {
    setAutoLayer(!autoLayer);
    if (!autoLayer) {
      // When enabling auto-layer, reorganize all objects
      const objects = canvas.getObjects();
      // Remove all objects
      objects.forEach((obj) => canvas.remove(obj));
      // Sort objects by type and add them back
      objects.sort((a, b) => {
        // First sort by type
        const typeOrder = {
          textbox: 0,
          rect: 1,
          circle: 2,
          image: 3,
        };

        const typeA = typeOrder[a.type] ?? 999;
        const typeB = typeOrder[b.type] ?? 999;

        if (typeA !== typeB) {
          return typeA - typeB;
        }

        // If same type, sort by creation time (newer on top)
        return (b.timestamp || 0) - (a.timestamp || 0);
      });

      // Add objects back in sorted order
      objects.forEach((obj) => {
        canvas.add(obj);
        // Ensure each object has a timestamp if it doesn't
        if (!obj.timestamp) {
          obj.timestamp = Date.now();
        }
      });

      canvas.renderAll();
      onLayerUpdate();
    }
  };

  // Add timestamp to new objects
  useEffect(() => {
    if (!canvas) return;

    const addTimestamp = (e) => {
      if (!e.target.timestamp) {
        e.target.timestamp = Date.now();
      }
    };

    canvas.on("object:added", addTimestamp);
    return () => {
      canvas.off("object:added", addTimestamp);
    };
  }, [canvas]);

  // Update layer order when auto-layer is enabled
  useEffect(() => {
    if (!canvas || !autoLayer) return;

    const updateLayerOrder = () => {
      const objects = canvas.getObjects();
      // Remove all objects
      objects.forEach((obj) => canvas.remove(obj));
      // Sort objects by type and add them back
      objects.sort((a, b) => {
        // First sort by type
        const typeOrder = {
          textbox: 0,
          rect: 1,
          circle: 2,
          image: 3,
        };

        const typeA = typeOrder[a.type] ?? 999;
        const typeB = typeOrder[b.type] ?? 999;

        if (typeA !== typeB) {
          return typeA - typeB;
        }

        // If same type, sort by creation time (newer on top)
        return (b.timestamp || 0) - (a.timestamp || 0);
      });

      // Add objects back in sorted order
      objects.forEach((obj) => canvas.add(obj));
      canvas.renderAll();
    };

    canvas.on("object:added", updateLayerOrder);
    canvas.on("object:removed", updateLayerOrder);
    canvas.on("object:modified", updateLayerOrder);

    return () => {
      canvas.off("object:added", updateLayerOrder);
      canvas.off("object:removed", updateLayerOrder);
      canvas.off("object:modified", updateLayerOrder);
    };
  }, [canvas, autoLayer]);

  return (
    <div className="w-64 bg-white border-l p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Layers</h3>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-lg transition-colors ${
              autoLayer
                ? "bg-red-50 text-red-500"
                : "hover:bg-gray-100 text-gray-600"
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
                canvas.remove(activeObject);
                canvas.add(activeObject);
                canvas.renderAll();
                onLayerUpdate();
              }
            }}
            title="Bring to Front"
          >
            <FaLayerGroup className="text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {
              const activeObject = canvas.getActiveObject();
              if (activeObject) {
                const objects = canvas.getObjects();
                canvas.remove(activeObject);
                // Add all objects back in reverse order
                objects.reverse().forEach((obj) => {
                  if (obj !== activeObject) {
                    canvas.add(obj);
                  }
                });
                canvas.add(activeObject);
                canvas.renderAll();
                onLayerUpdate();
              }
            }}
            title="Send to Back"
          >
            <FaLayerGroup className="text-gray-600 rotate-180" />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              canvas.getActiveObject() === layer.object
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility(layer)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {layer.visible ? (
                  <FaEye className="text-gray-600" />
                ) : (
                  <FaEyeSlash className="text-gray-400" />
                )}
              </button>
              <button
                onClick={() => toggleLock(layer)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {layer.locked ? (
                  <FaLock className="text-gray-600" />
                ) : (
                  <FaUnlock className="text-gray-400" />
                )}
              </button>
              <span className="text-sm font-medium">{layer.name}</span>
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

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [showLayers, setShowLayers] = useState(true);

  // Initialize Fabric.js
  useEffect(() => {
    const initCanvas = () => {
      try {
        if (!canvasRef.current) {
          console.error("Canvas ref is not available");
          return;
        }

        console.log("Initializing canvas with dimensions:", {
          width: 900,
          height: 500,
        });

        const canvas = new Canvas(canvasRef.current, {
          width: 900,
          height: 500,
          backgroundColor: "#fff",
        });

        fabricRef.current = canvas;
        setIsCanvasReady(true);
        console.log("Canvas initialized successfully");
      } catch (error) {
        console.error("Error initializing canvas:", error);
      }
    };

    initCanvas();

    return () => {
      if (fabricRef.current) {
        console.log("Disposing canvas");
        fabricRef.current.dispose();
        fabricRef.current = null;
        setIsCanvasReady(false);
      }
    };
  }, []);

  const handleAddText = () => {
    if (!isCanvasReady || !fabricRef.current) {
      console.error("Canvas is not ready");
      return;
    }

    try {
      const text = new Textbox("Jain Canvas", {
        left: 200,
        top: 200,
        fontSize: 42,
        fill: "#222",
        fontFamily: "Arial",
        fontWeight: "normal",
        fontStyle: "normal",
        underline: false,
        textAlign: "left",
      });

      fabricRef.current.add(text);
      fabricRef.current.setActiveObject(text);
      fabricRef.current.renderAll();
      console.log("Text added successfully");
    } catch (error) {
      console.error("Error adding text:", error);
    }
  };

  const handleAddRect = () => {
    if (!isCanvasReady || !fabricRef.current) {
      console.error("Canvas is not ready");
      return;
    }

    try {
      const rect = new Rect({
        left: 150,
        top: 150,
        fill: "#f87171",
        width: 120,
        height: 80,
      });

      fabricRef.current.add(rect);
      fabricRef.current.setActiveObject(rect);
      fabricRef.current.renderAll();
      console.log("Rectangle added successfully");
    } catch (error) {
      console.error("Error adding rectangle:", error);
    }
  };

  const handleAddCircle = () => {
    if (!isCanvasReady || !fabricRef.current) {
      console.error("Canvas is not ready");
      return;
    }

    try {
      const circle = new Circle({
        left: 200,
        top: 200,
        fill: "#60a5fa",
        radius: 50,
      });

      fabricRef.current.add(circle);
      fabricRef.current.setActiveObject(circle);
      fabricRef.current.renderAll();
      console.log("Circle added successfully");
    } catch (error) {
      console.error("Error adding circle:", error);
    }
  };

  const handleDelete = () => {
    if (!isCanvasReady || !fabricRef.current) {
      console.error("Canvas is not ready");
      return;
    }

    try {
      const active = fabricRef.current.getActiveObject();
      if (active) {
        fabricRef.current.remove(active);
        fabricRef.current.renderAll();
        console.log("Object deleted successfully");
      } else {
        console.log("No active object to delete");
      }
    } catch (error) {
      console.error("Error deleting object:", error);
    }
  };

  const handleExport = () => {
    if (!isCanvasReady || !fabricRef.current) {
      console.error("Canvas is not ready");
      return;
    }

    try {
      const dataURL = fabricRef.current.toDataURL({ format: "png" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "jaincanvas-design.png";
      link.click();
      console.log("Canvas exported successfully");
    } catch (error) {
      console.error("Error exporting canvas:", error);
    }
  };

  const handleImageUpload = (e) => {
    console.log("Image upload started");

    if (!isCanvasReady || !fabricRef.current) {
      console.error("Canvas is not ready");
      return;
    }

    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    console.log("File selected:", file.name, file.type);

    // Reset the file input
    e.target.value = "";

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Selected file is not an image");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      console.log("File read complete");
      const imgUrl = event.target.result;

      // Create a new image element
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = function () {
        console.log("Image loaded, dimensions:", img.width, "x", img.height);
        try {
          // Create a new fabric image
          const fabricImg = new FabricImage(img, {
            crossOrigin: "anonymous",
          });

          console.log("Fabric image created");

          // Calculate scaling
          const maxSize = 300;
          const scale = Math.min(
            maxSize / fabricImg.width,
            maxSize / fabricImg.height
          );

          console.log("Calculated scale:", scale);

          // Set image properties
          fabricImg.set({
            scaleX: scale,
            scaleY: scale,
            left: (fabricRef.current.width - fabricImg.width * scale) / 2,
            top: (fabricRef.current.height - fabricImg.height * scale) / 2,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            originX: "center",
            originY: "center",
          });

          console.log("Image properties set");

          // Add to canvas
          fabricRef.current.add(fabricImg);
          fabricRef.current.setActiveObject(fabricImg);
          fabricRef.current.renderAll();

          console.log("Image added to canvas successfully");
        } catch (error) {
          console.error("Error creating fabric image:", error);
        }
      };

      img.onerror = function (err) {
        console.error("Error loading image:", err);
      };

      console.log("Setting image source");
      img.src = imgUrl;
    };

    reader.onerror = function (err) {
      console.error("Error reading file:", err);
    };

    console.log("Starting file read");
    reader.readAsDataURL(file);
  };

  const handleTextFormat = (format) => {
    if (!isCanvasReady || !fabricRef.current) {
      console.error("Canvas is not ready");
      return;
    }

    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject || !(activeObject instanceof Textbox)) {
      console.log("No text object selected");
      return;
    }

    try {
      switch (format) {
        case "bold":
          activeObject.set(
            "fontWeight",
            activeObject.fontWeight === "bold" ? "normal" : "bold"
          );
          break;
        case "italic":
          activeObject.set(
            "fontStyle",
            activeObject.fontStyle === "italic" ? "normal" : "italic"
          );
          break;
        case "underline":
          activeObject.set("underline", !activeObject.underline);
          break;
        case "alignLeft":
          activeObject.set("textAlign", "left");
          break;
        case "alignCenter":
          activeObject.set("textAlign", "center");
          break;
        case "alignRight":
          activeObject.set("textAlign", "right");
          break;
        default:
          break;
      }
      fabricRef.current.renderAll();
    } catch (error) {
      console.error("Error formatting text:", error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-2 mb-4">
          <button
            onClick={handleAddText}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-tooltip-id="text-tooltip"
            data-tooltip-content="Add Text"
          >
            <FaFont className="text-gray-600" />
          </button>
          <button
            onClick={handleAddRect}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-tooltip-id="rect-tooltip"
            data-tooltip-content="Add Rectangle"
          >
            <FaSquareFull className="text-gray-600" />
          </button>
          <button
            onClick={handleAddCircle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-tooltip-id="circle-tooltip"
            data-tooltip-content="Add Circle"
          >
            <FaCircle className="text-gray-600" />
          </button>
          <button
            onClick={() => document.getElementById("imageUpload").click()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-tooltip-id="image-tooltip"
            data-tooltip-content="Upload Image"
          >
            <FaImage className="text-gray-600" />
          </button>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            data-tooltip-id="delete-tooltip"
            data-tooltip-content="Delete Selected"
          >
            <FaTrash className="text-red-500" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-tooltip-id="export-tooltip"
            data-tooltip-content="Export Design"
          >
            <FaDownload className="text-gray-600" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={`p-2 rounded-lg transition-colors ${
              showLayers
                ? "bg-red-50 text-red-500"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            data-tooltip-id="layers-tooltip"
            data-tooltip-content="Toggle Layers Panel"
          >
            <FaLayerGroup />
          </button>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <canvas ref={canvasRef} />
        </div>
      </div>
      {showLayers && (
        <LayerPanel
          canvas={fabricRef.current}
          onLayerUpdate={() => fabricRef.current?.renderAll()}
        />
      )}
      <Tooltip id="text-tooltip" />
      <Tooltip id="rect-tooltip" />
      <Tooltip id="circle-tooltip" />
      <Tooltip id="image-tooltip" />
      <Tooltip id="delete-tooltip" />
      <Tooltip id="export-tooltip" />
      <Tooltip id="layers-tooltip" />
    </div>
  );
};

export default CanvasEditor;
