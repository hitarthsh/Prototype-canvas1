import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

const Canvas = ({ onCanvasReady, onObjectModified }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // Initialize canvas only once
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    // Store canvas reference
    fabricRef.current = canvas;

    // Notify parent component that canvas is ready
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    // Cleanup
    return () => {
      if (canvas) {
        canvas.dispose();
        fabricRef.current = null;
      }
    };
  }, [onCanvasReady]); // Only depend on onCanvasReady

  // Handle object modifications separately
  useEffect(() => {
    if (!fabricRef.current || !onObjectModified) return;

    const canvas = fabricRef.current;
    const handleObjectModified = () => {
      onObjectModified(canvas);
    };

    canvas.on("object:modified", handleObjectModified);

    return () => {
      canvas.off("object:modified", handleObjectModified);
    };
  }, [onObjectModified]);

  return (
    <div className="flex-1 bg-gray-100 p-4 h-[73vh] overflow-hidden">
      <div className="bg-white shadow-lg h-full rounded-lg overflow-hidden relative">
        <div className="min-h-full min-w-full">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
