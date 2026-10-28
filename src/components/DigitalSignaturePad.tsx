import React, { useRef, useState, useEffect } from "react";
import { PenTool, Trash2, CheckCircle2, RefreshCw, RotateCcw } from "lucide-react";

interface DigitalSignaturePadProps {
  signerName?: string;
  signerTitle?: string;
  onSignerNameChange?: (name: string) => void;
  onSignatureChange: (dataUrl: string | null) => void;
  initialSignature?: string | null;
}

export function DigitalSignaturePad({
  signerName = "Samson K. (Site Manager)",
  signerTitle = "Site Manager & Quality Inspector",
  onSignerNameChange,
  onSignatureChange,
  initialSignature = null
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(initialSignature));
  const [penColor, setPenColor] = useState("#1e3a8a"); // Default Navy Blue ink

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  // Draw grid line for signature baseline on canvas
  const drawBaseline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = "#e2e8f0";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, height - 25);
    ctx.lineTo(width - 20, height - 25);
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high DP resolution
    const width = 360;
    const height = 120;
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;

    drawBaseline(ctx, width, height);

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = initialSignature;
    }
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert to PNG data URL
    const dataUrl = canvas.toDataURL("image/png");
    onSignatureChange(dataUrl);
  };

  return (
    <div className="bg-white border border-stone-250 p-4 rounded-xl shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PenTool className="h-4 w-4 text-amber-600" />
          <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-900">
            Digital Canvas Signature
          </h4>
        </div>
        {hasSignature ? (
          <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Signature Captured</span>
          </span>
        ) : (
          <span className="text-[10px] font-mono text-stone-400">
            Sign below with Mouse or Touch
          </span>
        )}
      </div>

      {/* Signer Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-[9px] font-mono uppercase text-stone-500 font-bold mb-0.5">
            Signer / Manager Name
          </label>
          <input
            type="text"
            value={signerName}
            onChange={(e) => onSignerNameChange && onSignerNameChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 focus:border-amber-500 text-stone-900 rounded-lg text-xs font-sans focus:outline-none"
            placeholder="e.g. Samson K. / F. O. Dugbazah MD"
          />
        </div>
        <div>
          <label className="block text-[9px] font-mono uppercase text-stone-500 font-bold mb-0.5">
            Ink Color
          </label>
          <div className="flex items-center space-x-2 pt-0.5">
            <button
              type="button"
              onClick={() => setPenColor("#1e3a8a")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                penColor === "#1e3a8a" ? "bg-blue-900 text-white shadow-xs" : "bg-stone-100 text-stone-600"
              }`}
            >
              Navy Blue
            </button>
            <button
              type="button"
              onClick={() => setPenColor("#18181b")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                penColor === "#18181b" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600"
              }`}
            >
              Black Ink
            </button>
            <button
              type="button"
              onClick={() => setPenColor("#065f46")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                penColor === "#065f46" ? "bg-emerald-800 text-white shadow-xs" : "bg-stone-100 text-stone-600"
              }`}
            >
              Emerald
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Canvas Pad */}
      <div className="relative border-2 border-dashed border-stone-300 rounded-xl bg-stone-50/50 p-2 flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair bg-white rounded-lg shadow-inner touch-none border border-stone-200"
        />

        <div className="w-full flex items-center justify-between mt-2 px-1 text-[10px] font-mono">
          <span className="text-stone-400 italic">Draw your signature inside the box</span>
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors cursor-pointer font-sans font-bold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear Signature</span>
          </button>
        </div>
      </div>
    </div>
  );
}
