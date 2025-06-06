import React from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaFont,
  FaFill,
} from "react-icons/fa";

const TextFormatPanel = ({ onFormatChange, selectedObject }) => {
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96];
  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Impact",
    "Comic Sans MS",
  ];
  const colors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
    "#800000", // Maroon
    "#000080", // Navy
    "#808080", // Gray
  ];

  const handleFontFamilyChange = (e) => {
    onFormatChange("fontFamily", e.target.value);
    console.log("Font family changed to:", e.target.value);
  };

  const handleFontSizeChange = (e) => {
    onFormatChange("fontSize", parseInt(e.target.value));
    console.log("Font size changed to:", e.target.value);
    console.log("Selected object:", selectedObject);
  };

  const handleColorChange = (color) => {
    onFormatChange("fill", color);
    console.log("Text color changed to:", color);
    console.log("Selected object:", selectedObject);
  };

  const handleStyleChange = (style) => {
    const currentValue = selectedObject?.[style] || false;
    onFormatChange(style, !currentValue);
    console.log(`${style} changed to:`, !currentValue);
    console.log("Selected object:", selectedObject);
  };

  const handleAlignChange = (align) => {
    onFormatChange("textAlign", align);
    console.log("Text alignment changed to:", align);
    console.log("Selected object:", selectedObject);
  };

  const handleFillChange = (e) => {
    if (selectedObject) {
      selectedObject.set("fill", e.target.value);
      onFormatChange(selectedObject);
    }
  };

  if (!selectedObject || selectedObject.type !== "textbox") {
    return null;
  }

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="space-y-4">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            className="w-full p-2 border rounded-md"
            onChange={handleFontFamilyChange}
            value={selectedObject?.fontFamily || "Arial"}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <select
            className="w-full p-2 border rounded-md"
            onChange={handleFontSizeChange}
            value={selectedObject?.fontSize || 16}
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Text Style Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleStyleChange("fontWeight")}
            className={`p-2 rounded-md ${
              selectedObject?.fontWeight === "bold"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            title="Bold"
          >
            <FaBold />
          </button>
          <button
            onClick={() => handleStyleChange("fontStyle")}
            className={`p-2 rounded-md ${
              selectedObject?.fontStyle === "italic"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            title="Italic"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => handleStyleChange("underline")}
            className={`p-2 rounded-md ${
              selectedObject?.underline
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            title="Underline"
          >
            <FaUnderline />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-2">
          <button
            onClick={() => handleAlignChange("left")}
            className={`p-2 rounded-md ${
              selectedObject?.textAlign === "left"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            title="Align Left"
          >
            <FaAlignLeft />
          </button>
          <button
            onClick={() => handleAlignChange("center")}
            className={`p-2 rounded-md ${
              selectedObject?.textAlign === "center"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            title="Align Center"
          >
            <FaAlignCenter />
          </button>
          <button
            onClick={() => handleAlignChange("right")}
            className={`p-2 rounded-md ${
              selectedObject?.textAlign === "right"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            title="Align Right"
          >
            <FaAlignRight />
          </button>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <div className="grid grid-cols-7 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded-md border ${
                  selectedObject?.fill === color ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fill Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={selectedObject.fill}
              onChange={handleFillChange}
              className="mt-1 block w-8 h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">{selectedObject.fill}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextFormatPanel;
