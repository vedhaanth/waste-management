import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WasteScannerProps {
  onImageCapture: (image: string) => void;
  isAnalyzing: boolean;
}

export function WasteScanner({ onImageCapture, isAnalyzing }: WasteScannerProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file input
      cameraInputRef.current?.click();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setPreviewImage(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const clearImage = () => {
    setPreviewImage(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleCameraClick = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleAnalyze = () => {
    if (previewImage) {
      onImageCapture(previewImage);
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="camera-capture"
      />
      <canvas ref={canvasRef} className="hidden" />

      {!previewImage && !isCameraActive ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-8 min-h-[280px] transition-all duration-300 ${dragActive ? "bg-primary/10 border-primary" : ""
            }`}
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
            <Camera className="w-10 h-10 text-primary" />
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2">
            Scan Your Waste
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-xs">
            Take a photo or upload an image to identify the waste type
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Button
              onClick={handleCameraClick}
              className="flex-1 gap-2"
              size="lg"
            >
              <Camera className="w-5 h-5" />
              {isCameraActive ? 'Stop Camera' : 'Camera'}
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1 gap-2"
              size="lg"
            >
              <Upload className="w-5 h-5" />
              Upload
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            or drag and drop an image
          </p>
        </div>
      ) : isCameraActive ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-4">
              <Button
                onClick={captureImage}
                className="rounded-full w-16 h-16 shadow-lg"
                size="icon"
              >
                <Camera className="w-8 h-8" />
              </Button>
              <Button
                onClick={stopCamera}
                variant="secondary"
                className="rounded-full w-16 h-16 shadow-lg"
                size="icon"
              >
                <X className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewImage}
            alt="Waste preview"
            className="w-full h-64 object-cover"
          />

          {!isAnalyzing && (
            <Button
              onClick={clearImage}
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 rounded-full shadow-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          <div className="p-4 space-y-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full gap-2"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Identify Waste Type
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
