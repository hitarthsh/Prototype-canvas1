import React, { useState } from "react";
import {
  FaFont,
  FaSquare,
  FaCircle,
  FaImage,
  FaTrash,
  FaUndo,
  FaRedo,
  FaDownload,
  FaChevronDown,
} from "react-icons/fa";

const Toolbar = ({
  onAddText,
  onAddRectangle,
  onAddCircle,
  onAddImage,
  onDelete,
  onUndo,
  onRedo,
  onExport,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportFormats = [
    { format: "png", label: "PNG Image" },
    { format: "jpeg", label: "JPEG Image" },
    { format: "webp", label: "WebP Image" },
    { format: "svg", label: "SVG Vector" },
  ];

  const handleExportClick = (format) => {
    onExport(format);
    setShowExportMenu(false);
  };

  return (
    <div className="bg-white  p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onAddText}
            className="p-2 hover:bg-gray-100 rounded-lg bg-cyan-200"
            title="Add Text"
          >
            <FaFont className="text-gray-600" />
          </button>
          <button
            onClick={onAddRectangle}
            className="p-2 hover:bg-gray-100 rounded-lg bg-cyan-200"
            title="Add Rectangle"
          >
            <FaSquare className="text-gray-600" />
          </button>
          <button
            onClick={onAddCircle}
            className="p-2 hover:bg-gray-100 rounded-lg bg-cyan-200"
            title="Add Circle"
          >
            <FaCircle className="text-gray-600" />
          </button>
          <button
            onClick={onAddImage}
            className="p-2 hover:bg-gray-100 rounded-lg bg-cyan-200"
            title="Add Image"
          >
            <FaImage className="text-gray-600" />
          </button>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg bg-cyan-200"
            title="Delete Selected"
          >
            <FaTrash />
          </button>
          <button
            onClick={onUndo}
            className="p-2 hover:bg-gray-100 rounded-lg bg-cyan-200"
            title="Undo"
          >
            <FaUndo className="text-gray-600" />
          </button>
          <button
            onClick={onRedo}
            className="p-2 hover:bg-gray-100 rounded-lg bg-cyan-200"
            title="Redo"
          >
            <FaRedo className="text-gray-600" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 hover:bg-green-50 text-green-600 rounded-lg bg-cyan-200 flex items-center gap-1"
              title="Export Canvas"
            >
              <FaDownload />
              <FaChevronDown className="text-xs" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {exportFormats.map((format) => (
                  <button
                    key={format.format}
                    onClick={() => handleExportClick(format.format)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
