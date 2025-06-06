import { useCallback } from "react";
import { Textbox, Rect, Circle, Image as FabricImage } from "fabric";

export const useCanvasHandlers = (canvasRef, setCanvas) => {
  const handleCanvasReady = useCallback(
    (newCanvas) => {
      canvasRef.current = newCanvas;
      setCanvas(newCanvas);
    },
    [canvasRef, setCanvas]
  );

  const handleObjectModified = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.renderAll();
    }
  }, [canvasRef]);

  const handleAddText = useCallback(() => {
    if (!canvasRef.current) return;
    const text = new Textbox("Hitarth Shah", {
      left: Math.random() * 500 + 50,
      top: 100,
      width: Math.min(110, window.innerWidth - 100),
      fontSize: 20,
      fill: "#000000",
      timestamp: Date.now(),
    });
    canvasRef.current.add(text);
    canvasRef.current.setActiveObject(text);
    canvasRef.current.renderAll();
  }, [canvasRef]);

  const handleAddRectangle = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "#3fd542",
      strokeWidth: 2,
      timestamp: Date.now(),
    });
    canvasRef.current.add(rect);
    canvasRef.current.setActiveObject(rect);
    canvasRef.current.renderAll();
  }, [canvasRef]);

  const handleAddCircle = useCallback(() => {
    if (!canvasRef.current) return;
    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: "#4432ff",
      strokeWidth: 2,
      timestamp: Date.now(),
    });
    canvasRef.current.add(circle);
    canvasRef.current.setActiveObject(circle);
    canvasRef.current.renderAll();
  }, [canvasRef]);

  const handleImageUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file || !canvasRef.current) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvasWidth = canvasRef.current.width;
          const canvasHeight = canvasRef.current.height;

          let scale = 1;
          if (img.width > canvasWidth || img.height > canvasHeight) {
            const scaleX = canvasWidth / img.width;
            const scaleY = canvasHeight / img.height;
            scale = Math.min(scaleX, scaleY) * 0.8;
          }

          const fabricImage = new FabricImage(img, {
            left: (canvasWidth - img.width * scale) / 2,
            top: (canvasHeight - img.height * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockMovementX: false,
            lockMovementY: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            lockUniScaling: false,
            hasRotatingPoint: true,
            transparentCorners: false,
            perPixelTargetFind: true,
            crossOrigin: "anonymous",
            originX: "center",
            originY: "center",
          });

          canvasRef.current.add(fabricImage);
          canvasRef.current.setActiveObject(fabricImage);
          canvasRef.current.renderAll();
          event.target.value = "";
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    [canvasRef]
  );

  const handleDelete = useCallback(() => {
    if (!canvasRef.current) return;
    const activeObject = canvasRef.current.getActiveObject();
    if (activeObject) {
      canvasRef.current.remove(activeObject);
      canvasRef.current.renderAll();
    }
  }, [canvasRef]);

  const handleUndo = useCallback(() => {
    if (!canvasRef.current) return;
    // Implement undo functionality
  }, [canvasRef]);

  const handleRedo = useCallback(() => {
    if (!canvasRef.current) return;
    // Implement redo functionality
  }, [canvasRef]);

  const handleLayerUpdate = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.renderAll();
    }
  }, [canvasRef]);

  const handleExport = useCallback(
    (format = "png") => {
      if (!canvasRef.current) return;
      canvasRef.current.renderAll();

      let dataURL;
      let filename;

      if (format === "svg") {
        dataURL = canvasRef.current.toSVG({
          encoding: "UTF-8",
          viewBox: {
            x: 0,
            y: 0,
            width: canvasRef.current.width,
            height: canvasRef.current.height,
          },
        });
        filename = "canvas-export.svg";
      } else {
        dataURL = canvasRef.current.toDataURL({
          format: format,
          quality: 1,
          multiplier: 2,
          enableRetinaScaling: true,
          withoutTransform: false,
          withoutShadow: false,
        });
        filename = `canvas-export.${format}`;
      }

      const link = document.createElement("a");
      link.download = filename;

      if (format === "svg") {
        const blob = new Blob([dataURL], { type: "image/svg+xml" });
        link.href = URL.createObjectURL(blob);
      } else {
        link.href = dataURL;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (format === "svg") {
        URL.revokeObjectURL(link.href);
      }
    },
    [canvasRef]
  );

  return {
    handleCanvasReady,
    handleObjectModified,
    handleAddText,
    handleAddRectangle,
    handleAddCircle,
    handleImageUpload,
    handleDelete,
    handleUndo,
    handleRedo,
    handleLayerUpdate,
    handleExport,
  };
};
