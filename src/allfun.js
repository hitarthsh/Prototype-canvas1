import { Textbox, Rect, Circle, Image as FabricImage } from "fabric";

export const handleAddText = (canvasRef) => {
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
};

export const handleAddRectangle = (canvasRef) => {
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
};

export const handleAddCircle = (canvasRef) => {
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
};

export const handleImageUpload = (event, canvasRef) => {
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
};

export const handleDelete = (canvasRef) => {
  if (!canvasRef.current) return;
  const activeObject = canvasRef.current.getActiveObject();
  if (activeObject) {
    canvasRef.current.remove(activeObject);
    canvasRef.current.renderAll();
  }
};

export const handleUndo = (canvasRef) => {
  if (!canvasRef.current) return;
  // Implement undo functionality
};

export const handleRedo = (canvasRef) => {
  if (!canvasRef.current) return;
  // Implement redo functionality
};

export const handleExport = (format = "png", canvasRef) => {
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
};
