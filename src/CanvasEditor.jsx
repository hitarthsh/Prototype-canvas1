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

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

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

        // Remove selection event listeners
        // canvas.on("selection:created", (e) => {
        //   console.log("Selection created:", e.target);
        //   setSelectedObject(e.target);
        // });

        // canvas.on("selection:updated", (e) => {
        //   console.log("Selection updated:", e.target);
        //   setSelectedObject(e.target);
        // });

        // canvas.on("selection:cleared", () => {
        //   console.log("Selection cleared");
        //   setSelectedObject(null);
        // });

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
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Toolbar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-3 bg-white rounded shadow px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddText}
            className="p-2 rounded-lg hover:bg-blue-50 transition"
            title="Add Text"
          >
            <FaFont size={20} className="text-blue-600" />
          </button>
          <button
            onClick={handleAddRect}
            className="p-2 rounded-lg hover:bg-purple-50 transition"
            title="Add Rectangle"
          >
            <FaSquareFull size={20} className="text-purple-600" />
          </button>
          <button
            onClick={handleAddCircle}
            className="p-2 rounded-lg hover:bg-green-50 transition"
            title="Add Circle"
          >
            <FaCircle size={20} className="text-green-600" />
          </button>
          <label
            className="p-2 rounded-lg hover:bg-orange-50 transition cursor-pointer"
            title="Upload Image"
          >
            <FaImage size={20} className="text-orange-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-4" />

        {/* Text Formatting Toolbar */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleTextFormat("bold")}
            className="p-2 rounded-lg hover:bg-gray-50 transition"
            title="Bold"
          >
            <FaBold size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleTextFormat("italic")}
            className="p-2 rounded-lg hover:bg-gray-50 transition"
            title="Italic"
          >
            <FaItalic size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleTextFormat("underline")}
            className="p-2 rounded-lg hover:bg-gray-50 transition"
            title="Underline"
          >
            <FaUnderline size={16} className="text-gray-600" />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => handleTextFormat("alignLeft")}
            className="p-2 rounded-lg hover:bg-gray-50 transition"
            title="Align Left"
          >
            <FaAlignLeft size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleTextFormat("alignCenter")}
            className="p-2 rounded-lg hover:bg-gray-50 transition"
            title="Align Center"
          >
            <FaAlignCenter size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleTextFormat("alignRight")}
            className="p-2 rounded-lg hover:bg-gray-50 transition"
            title="Align Right"
          >
            <FaAlignRight size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-4" />

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-50 transition"
            title="Delete"
          >
            <FaTrash size={20} className="text-red-500" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded-lg hover:bg-green-50 transition"
            title="Export PNG"
          >
            <FaDownload size={20} className="text-green-600" />
          </button>
        </div>
      </div>
      {/* Canvas Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex items-center justify-center w-full max-w-4xl h-[500px]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;
